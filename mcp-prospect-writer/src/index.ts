// Cloudflare MCP Worker entrypoint; do not replace with the default Hello World template.
// Build trigger after Cloudflare Git integration reconnection (no runtime behavior change).
import { OAuthProvider, type OAuthHelpers, type ConsentDescription } from "@cloudflare/workers-oauth-provider";
import { createMcpHandler } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

type Env = {
  MCP_BEARER_TOKEN?: string;
  GOOGLE_SERVICE_ACCOUNT_JSON?: string;
  TEST_SPREADSHEET_ID?: string;
  PRODUCTION_SPREADSHEET_ID?: string;
  ENABLE_PRODUCTION_WRITES?: string;
  MCP_OAUTH_APPROVAL_SECRET?: string;
  OAUTH_KV: any;
  OAUTH_PROVIDER: OAuthHelpers;
};

type WorkerContext = {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException?(): void;
};

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

type SheetsValuesResponse = {
  range?: string;
  majorDimension?: string;
  values?: unknown[][];
};

type AppendResponse = {
  spreadsheetId?: string;
  tableRange?: string;
  updates?: { updatedRange?: string; updatedRows?: number; updatedColumns?: number; updatedCells?: number };
};

type Prospect = {
  business_name: string;
  website: string;
  location: string;
  services: string;
  decision_maker?: string;
  email?: string;
  phone?: string;
  website_observation: string;
  buying_signal?: string;
  signal_date?: string;
  source_urls: string[];
  potential_service: string;
  fit_score: number;
  score_reasoning: string;
  personalization_angle: string;
  research_date?: string;
  status?: string;
  notes?: string;
};

const TEST_TAB = "API Test Leads";
const PRODUCTION_TAB = "Leads";
const TEST_MARKER = "STARLIGHT_MCP_WRITE_TEST_2026_10_26";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token";
const encoder = new TextEncoder();

let cachedAccessToken: { token: string; expiresAt: number; account: string } | null = null;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function constantTimeEqual(left: string, right: string): boolean {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  let diff = a.length ^ b.length;
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlText(value: string): string {
  return base64Url(encoder.encode(value));
}

function decodePem(pem: string): ArrayBuffer {
  const clean = pem
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function getGoogleAccessToken(env: Env): Promise<string> {
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON secret is not configured.");
  }
  let account: ServiceAccount;
  try {
    account = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }
  if (!account.client_email || !account.private_key) {
    throw new Error("The service-account JSON must include client_email and private_key.");
  }
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.account === account.client_email && cachedAccessToken.expiresAt > now + 60) {
    return cachedAccessToken.token;
  }

  const tokenUri = account.token_uri || GOOGLE_TOKEN_URI;
  const header = base64UrlText(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64UrlText(JSON.stringify({
    iss: account.client_email,
    scope: GOOGLE_SCOPE,
    aud: tokenUri,
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = header + "." + claims;
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    decodePem(account.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, encoder.encode(unsigned)));
  const assertion = unsigned + "." + base64Url(signature);

  const tokenResponse = await fetch(tokenUri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!tokenResponse.ok) {
    throw new Error("Google service-account authentication failed (HTTP " + tokenResponse.status + "). Check the service-account secret and Google Sheets API setup.");
  }
  const tokenBody = await tokenResponse.json() as { access_token?: string; expires_in?: number };
  if (!tokenBody.access_token) throw new Error("Google did not return an access token.");
  cachedAccessToken = {
    token: tokenBody.access_token,
    account: account.client_email,
    expiresAt: now + Math.max(120, (tokenBody.expires_in || 3600) - 90),
  };
  return tokenBody.access_token;
}

function quoteSheetRange(tab: string, range: string): string {
  return "'" + tab.replace(/'/g, "''") + "'!" + range;
}

async function sheetsGet(env: Env, spreadsheetId: string, range: string): Promise<SheetsValuesResponse> {
  const token = await getGoogleAccessToken(env);
  const url = "https://sheets.googleapis.com/v4/spreadsheets/" +
    encodeURIComponent(spreadsheetId) + "/values/" + encodeURIComponent(range);
  const response = await fetch(url, { headers: { authorization: "Bearer " + token } });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240);
    throw new Error("Google Sheets read failed (HTTP " + response.status + "): " + detail);
  }
  return await response.json() as SheetsValuesResponse;
}

async function sheetsAppend(
  env: Env,
  spreadsheetId: string,
  tab: string,
  rows: (string | number)[][],
): Promise<AppendResponse> {
  const token = await getGoogleAccessToken(env);
  const range = quoteSheetRange(tab, "A:ZZ");
  const url = "https://sheets.googleapis.com/v4/spreadsheets/" +
    encodeURIComponent(spreadsheetId) + "/values/" + encodeURIComponent(range) +
    ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&includeValuesInResponse=true";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
      "content-type": "application/json",
    },
    body: JSON.stringify({ majorDimension: "ROWS", values: rows }),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240);
    throw new Error("Google Sheets append failed (HTTP " + response.status + "): " + detail);
  }
  return await response.json() as AppendResponse;
}

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function testCellValue(header: unknown): string | number | undefined {
  const key = normalizeHeader(header);
  if (["recordid", "id", "prospectid", "leadid", "test", "testrecord"].includes(key)) return TEST_MARKER;
  if (["researchdate", "createddate", "dateadded", "date", "addedon"].includes(key)) return today();
  if (["status", "prospectstatus", "leadstatus", "stage"].includes(key)) return "TEST ONLY - NOT A REAL PROSPECT";
  if (["businessname", "companyname", "company", "name", "prospect", "leadname"].includes(key)) return TEST_MARKER;
  if (["website", "officialwebsite", "url", "businesswebsite"].includes(key)) return "https://example.invalid/test-record";
  if (["location", "city", "market", "servicearea"].includes(key)) return "TEST ONLY";
  if (["sourceurl", "sourceurls", "sources", "evidence", "evidenceurls", "sourcelink", "sourcelinks"].includes(key)) return "https://example.invalid/test-record";
  if (["notes", "researchnotes", "description", "comments", "evidenceandnotes"].includes(key)) return "Automated MCP connector test. Not a real prospect. Safe to remove after verification.";
  if (["result", "writeresult", "testresult"].includes(key)) return "WRITE AND READ-BACK VERIFICATION";
  if (["services", "hvacservices"].includes(key)) return "TEST ONLY";
  if (["potentialservice", "starlightservice"].includes(key)) return "TEST ONLY";
  if (["fitscore", "score", "scoreoutof100"].includes(key)) return 0;
  return undefined;
}

function mapTestRow(headers: unknown[]): (string | number)[] {
  let matched = 0;
  const row = headers.map((header) => {
    const value = testCellValue(header);
    if (value !== undefined) matched++;
    return value ?? "";
  });
  if (matched === 0) {
    throw new Error("The existing API Test Leads header row has no recognized fields. No write was attempted. Headers found: " + headers.map(String).join(" | "));
  }
  if (!row.some((cell) => String(cell) === TEST_MARKER)) {
    throw new Error("The existing header row has no safe test marker or record-id column. No write was attempted.");
  }
  return row;
}

function isRecordPresent(rows: unknown[][], marker: string): boolean {
  return rows.some((row) => row.some((cell) => String(cell ?? "") === marker));
}

async function writeTestRow(env: Env): Promise<Record<string, unknown>> {
  if (!env.TEST_SPREADSHEET_ID) throw new Error("TEST_SPREADSHEET_ID is not configured.");
  const readRange = quoteSheetRange(TEST_TAB, "A1:ZZ5000");
  const sheet = await sheetsGet(env, env.TEST_SPREADSHEET_ID, readRange);
  const values = sheet.values || [];
  const headers = values[0] || [];
  if (!headers.length || headers.every((cell) => String(cell ?? "").trim() === "")) {
    throw new Error("API Test Leads has no populated header row. No row was written to avoid changing the existing sheet structure.");
  }

  if (isRecordPresent(values.slice(1), TEST_MARKER)) {
    return {
      ok: true,
      action: "skipped_duplicate_test_marker",
      marker: TEST_MARKER,
      readBackVerified: true,
      spreadsheet: "Starlight Automation Test",
      tab: TEST_TAB,
      message: "The test marker already exists and was read back. No duplicate row was added.",
    };
  }

  const row = mapTestRow(headers);
  const appendResult = await sheetsAppend(env, env.TEST_SPREADSHEET_ID, TEST_TAB, [row]);
  let verification: SheetsValuesResponse | null = null;
  if (appendResult.updates?.updatedRange) {
    verification = await sheetsGet(env, env.TEST_SPREADSHEET_ID, appendResult.updates.updatedRange);
  } else {
    verification = await sheetsGet(env, env.TEST_SPREADSHEET_ID, readRange);
  }
  if (!isRecordPresent(verification.values || [], TEST_MARKER)) {
    throw new Error("The Sheets API accepted the append, but the marker was not found on read-back. Treat the write as unverified.");
  }
  return {
    ok: true,
    action: "added_and_verified",
    marker: TEST_MARKER,
    readBackVerified: true,
    spreadsheet: "Starlight Automation Test",
    tab: TEST_TAB,
    updatedRange: appendResult.updates?.updatedRange || verification.range || "read-back range",
    message: "One clearly labelled test row was appended and read back successfully. No production spreadsheet was accessed.",
  };
}

function findHeaderIndex(headers: unknown[], aliases: string[]): number {
  const aliasSet = new Set(aliases.map(normalizeHeader));
  return headers.findIndex((header) => aliasSet.has(normalizeHeader(header)));
}

function normalizeName(value: unknown): string {
  return String(value ?? "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
}

function normalizeDomain(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw.includes("://") ? raw : "https://" + raw);
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return raw.toLowerCase().replace(/^www\./, "").replace(/\/.*$/, "");
  }
}

function productionCellValue(header: unknown, prospect: Prospect): string | number | undefined {
  const key = normalizeHeader(header);
  if (["recordid", "prospectid", "leadid"].includes(key)) return normalizeDomain(prospect.website) + "|" + normalizeName(prospect.business_name);
  if (["researchdate", "createddate", "dateadded", "date"].includes(key)) return prospect.research_date || today();
  if (["status", "prospectstatus", "leadstatus", "stage"].includes(key)) return prospect.status || "Research - Not Contacted";
  if (["businessname", "companyname", "company", "name", "prospect", "leadname"].includes(key)) return prospect.business_name;
  if (["website", "officialwebsite", "url", "businesswebsite"].includes(key)) return prospect.website;
  if (["location", "city", "market", "servicearea"].includes(key)) return prospect.location;
  if (["services", "hvacservices", "servicesoffered"].includes(key)) return prospect.services;
  if (["decisionmaker", "owner", "contactname", "decisionmakername"].includes(key)) return prospect.decision_maker || "";
  if (["email", "businessemail", "contactemail"].includes(key)) return prospect.email || "";
  if (["phone", "businessphone", "contactphone"].includes(key)) return prospect.phone || "";
  if (["websiteobservation", "websitefit", "websitefindings"].includes(key)) return prospect.website_observation;
  if (["buyingsignal", "recentbuyingsignal", "operationalopportunity"].includes(key)) return prospect.buying_signal || "";
  if (["signaldate", "buyingsignaldate"].includes(key)) return prospect.signal_date || "";
  if (["sourceurl", "sourceurls", "sources", "evidence", "evidenceurls", "sourcelinks", "sourcelink"].includes(key)) return prospect.source_urls.join(" | ");
  if (["potentialservice", "starlightservice", "recommendedservice"].includes(key)) return prospect.potential_service;
  if (["fitscore", "score", "scoreoutof100"].includes(key)) return prospect.fit_score;
  if (["scorereasoning", "fitreasoning", "scorereasons"].includes(key)) return prospect.score_reasoning;
  if (["personalizationangle", "personalisationangle", "outreachangle"].includes(key)) return prospect.personalization_angle;
  if (["notes", "researchnotes", "comments"].includes(key)) return prospect.notes || "";
  return undefined;
}

function mapProductionRow(headers: unknown[], prospect: Prospect): (string | number)[] {
  return headers.map((header) => productionCellValue(header, prospect) ?? "");
}

async function appendProductionProspects(env: Env, prospects: Prospect[]): Promise<Record<string, unknown>> {
  if (env.ENABLE_PRODUCTION_WRITES !== "true") {
    throw new Error("Production writes are disabled. The test write must pass and Aoun must explicitly authorize production before ENABLE_PRODUCTION_WRITES is enabled.");
  }
  if (!env.TEST_SPREADSHEET_ID || !env.PRODUCTION_SPREADSHEET_ID) {
    throw new Error("Both TEST_SPREADSHEET_ID and PRODUCTION_SPREADSHEET_ID must be configured.");
  }
  if (env.PRODUCTION_SPREADSHEET_ID === env.TEST_SPREADSHEET_ID) {
    throw new Error("Production and test spreadsheet IDs must be different.");
  }
  const range = quoteSheetRange(PRODUCTION_TAB, "A1:ZZ5000");
  const sheet = await sheetsGet(env, env.PRODUCTION_SPREADSHEET_ID, range);
  const values = sheet.values || [];
  const headers = values[0] || [];
  if (!headers.length) throw new Error("Production Leads tab has no header row. No write was attempted.");
  const businessIndex = findHeaderIndex(headers, ["Business Name", "Company Name", "Company", "Lead Name", "Prospect"]);
  const websiteIndex = findHeaderIndex(headers, ["Website", "Official Website", "URL"]);
  const sourceIndex = findHeaderIndex(headers, ["Source URL", "Source URLs", "Sources", "Evidence URLs", "Source Links"]);
  if (businessIndex < 0 || websiteIndex < 0 || sourceIndex < 0) {
    throw new Error("The production Leads tab must have recognizable Business Name, Website, and Source URL columns. No write was attempted.");
  }

  const existingRows = values.slice(1);
  const existingNames = new Set(existingRows.map((row) => normalizeName(row[businessIndex])).filter(Boolean));
  const existingDomains = new Set(existingRows.map((row) => normalizeDomain(row[websiteIndex])).filter(Boolean));
  const addedCandidates: Prospect[] = [];
  const skippedDuplicates: string[] = [];
  for (const prospect of prospects) {
    const domain = normalizeDomain(prospect.website);
    const name = normalizeName(prospect.business_name);
    if (existingNames.has(name) || existingDomains.has(domain)) {
      skippedDuplicates.push(prospect.business_name);
      continue;
    }
    addedCandidates.push(prospect);
    existingNames.add(name);
    existingDomains.add(domain);
  }

  if (addedCandidates.length === 0) {
    return { ok: true, added: 0, skippedDuplicates, rejected: [], readBackVerified: true, message: "All submitted prospects were already present; no rows were written." };
  }

  const rows = addedCandidates.map((prospect) => mapProductionRow(headers, prospect));
  const appendResult = await sheetsAppend(env, env.PRODUCTION_SPREADSHEET_ID, PRODUCTION_TAB, rows);
  const verify = await sheetsGet(env, env.PRODUCTION_SPREADSHEET_ID, range);
  const verifyValues = verify.values || [];
  const verifyHeaders = verifyValues[0] || [];
  const verifyBusinessIndex = findHeaderIndex(verifyHeaders, ["Business Name", "Company Name", "Company", "Lead Name", "Prospect"]);
  const verifyWebsiteIndex = findHeaderIndex(verifyHeaders, ["Website", "Official Website", "URL"]);
  const verified = addedCandidates.filter((prospect) => verifyValues.slice(1).some((row) =>
    normalizeName(row[verifyBusinessIndex]) === normalizeName(prospect.business_name) &&
    normalizeDomain(row[verifyWebsiteIndex]) === normalizeDomain(prospect.website)
  ));
  if (verified.length !== addedCandidates.length) {
    throw new Error("The append request returned but read-back could not verify every submitted row. Do not retry blindly; inspect the Leads tab to avoid duplicates.");
  }
  return {
    ok: true,
    added: verified.length,
    addedBusinessNames: verified.map((prospect) => prospect.business_name),
    skippedDuplicates,
    rejected: [],
    readBackVerified: true,
    updatedRange: appendResult.updates?.updatedRange || null,
  };
}

const prospectSchema = z.object({
  business_name: z.string().trim().min(2).max(200),
  website: z.string().url(),
  location: z.string().trim().min(2).max(200),
  services: z.string().trim().min(2).max(500),
  decision_maker: z.string().trim().max(200).optional(),
  email: z.string().trim().max(320).optional(),
  phone: z.string().trim().max(80).optional(),
  website_observation: z.string().trim().min(2).max(1000),
  buying_signal: z.string().trim().max(1000).optional(),
  signal_date: z.string().trim().max(40).optional(),
  source_urls: z.array(z.string().url()).min(1).max(10),
  potential_service: z.string().trim().min(2).max(500),
  fit_score: z.number().int().min(0).max(100),
  score_reasoning: z.string().trim().min(2).max(1000),
  personalization_angle: z.string().trim().min(2).max(1000),
  research_date: z.string().trim().max(40).optional(),
  status: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(1000).optional(),
});

function createServer(env: Env): McpServer {
  const server = new McpServer({
    name: "Starlight Prospect Sheet Writer",
    version: "1.0.0",
  });

  server.registerTool(
    "write_test_row",
    {
      description: "Append one clearly labelled test row to Starlight Automation Test > API Test Leads, then read it back. Never writes to the production tracker.",
      inputSchema: z.object({}),
    },
    async () => {
      try {
        const result = await writeTestRow(env);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: "text", text: JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error", writeAttemptedOnlyAfterValidation: true }) }],
        };
      }
    },
  );

  if (env.ENABLE_PRODUCTION_WRITES === "true" && env.PRODUCTION_SPREADSHEET_ID) {
    server.registerTool(
      "append_verified_prospects",
      {
        description: "Append 1-5 verified, deduplicated HVAC prospect records to the production Leads tab. Only exposed when production writes have been deliberately enabled in Worker settings. Never sends outreach.",
        inputSchema: { prospects: z.array(prospectSchema).min(1).max(5) },
      },
      async ({ prospects }) => {
        try {
          const result = await appendProductionProspects(env, prospects as Prospect[]);
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
          return {
            isError: true,
            content: [{ type: "text", text: JSON.stringify({ ok: false, error: error instanceof Error ? error.message : "Unknown error", writeAttemptedOnlyAfterValidation: true }) }],
          };
        }
      },
    );
  }

  return server;
}


const MCP_PUBLIC_ORIGIN = "https://starlight-prospect-mcp.starlightai306.workers.dev";
const MCP_RESOURCE_URL = MCP_PUBLIC_ORIGIN + "/mcp";
const GROK_CLIENT_ID = "https://grok.com/oauth/mcp-client.json";
const MCP_OAUTH_SCOPES = ["mcp:write", "offline_access"];
const GROK_REDIRECT_URIS = new Set([
  "https://grok.com/connectors-oauth-exchange-code/",
  "https://console.x.ai/connectors-oauth-exchange-code/",
]);

function htmlEscape(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] || character);
}

function oauthHtmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      "x-frame-options": "DENY",
    },
  });
}

function oauthConsentPage(details: ConsentDescription, handle: string, message = ""): string {
  const name = htmlEscape(details.clientName);
  const publisher = details.clientDomain
    ? "Published by <strong>" + htmlEscape(details.clientDomain) + "</strong>."
    : "This client has not published a verified domain.";
  const scopesHtml = details.scope
    .map((scope) =>
      "<label><input type=\"checkbox\" name=\"scope\" value=\"" +
      htmlEscape(scope) + "\" checked> " + htmlEscape(scope) + "</label>"
    )
    .join("<br>");
  const messageHtml = message ? "<p role=\"alert\">" + htmlEscape(message) + "</p>" : "";
  const loopbackWarning = details.redirectIsLoopback
    ? "<p><strong>This sends access to an app on your computer. Continue only if you initiated this sign-in.</strong></p>"
    : "";
  return [
    "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">",
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
    "<title>Authorize Starlight Prospect MCP</title>",
    "<style>body{font:16px system-ui,sans-serif;max-width:640px;margin:8vh auto;padding:0 20px;color:#1b1b1b}",
    "main{border:1px solid #ddd;border-radius:16px;padding:24px}label{display:block;margin:10px 0}",
    "input[type=password]{box-sizing:border-box;width:100%;padding:12px;border:1px solid #888;border-radius:8px}",
    "button{padding:11px 16px;border:0;border-radius:8px;cursor:pointer}",
    "button[name=decision][value=approve]{background:#111;color:white}.muted{color:#555}</style></head><body><main>",
    "<h1>Authorize Starlight Prospect MCP</h1>",
    "<p>Allow <strong>", name, "</strong> to access the MCP tools?</p>",
    "<p>", publisher, " Access will be sent to <strong>", htmlEscape(details.redirectHost), "</strong>.</p>",
    loopbackWarning,
    "<p><strong>Requested permissions</strong></p><form method=\"post\" autocomplete=\"off\">",
    "<input type=\"hidden\" name=\"handle\" value=\"", htmlEscape(handle), "\">",
    scopesHtml,
    "<p class=\"muted\">Confirm this is your Grok connector. Enter the separate MCP OAuth approval secret stored in Cloudflare. Do not enter your Bearer token, Google service-account JSON, or GitHub deployment token.</p>",
    messageHtml,
    "<label for=\"approval_secret\">MCP OAuth approval secret</label>",
    "<input id=\"approval_secret\" name=\"approval_secret\" type=\"password\" minlength=\"32\" required autocomplete=\"off\">",
    "<p><button name=\"decision\" value=\"approve\" type=\"submit\">Approve access</button> ",
    "<button name=\"decision\" value=\"deny\" type=\"submit\">Deny</button></p>",
    "</form></main></body></html>",
  ].join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

type StoredOAuthConsent = {
  // AuthRequest is validated by OAuthProvider before storage; JSON restores its plain fields.
  // Runtime checks below fail closed before this value reaches completeAuthorization().
  request: any;
  createdAt: number;
};

function oauthErrorPage(title: string, message: string, status = 400): Response {
  return oauthHtmlResponse(
    "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>" +
    htmlEscape(title) + "</title></head><body><main><h1>" + htmlEscape(title) +
    "</h1><p>" + htmlEscape(message) + "</p><p>Return to Grok and start a fresh connection attempt.</p></main></body></html>",
    status,
  );
}

async function handleOAuthAuthorization(request: Request, env: Env): Promise<Response> {
  if (!env.MCP_OAUTH_APPROVAL_SECRET || env.MCP_OAUTH_APPROVAL_SECRET.length < 32) {
    return jsonResponse({
      error: "server_error",
      error_description: "MCP_OAUTH_APPROVAL_SECRET is not configured or is too short.",
    }, 503);
  }
  if (!env.OAUTH_KV) {
    return jsonResponse({ error: "server_error", error_description: "OAuth KV storage is not configured." }, 503);
  }

  const oauth = env.OAUTH_PROVIDER;
  if (!oauth) return jsonResponse({ error: "server_error", error_description: "OAuth provider is not initialized." }, 503);

  try {
    if (request.method === "GET") {
      const oauthRequest = await oauth.parseAuthRequest(request);

      // This Worker is specifically the Starlight Grok connector. Fail closed for other OAuth clients.
      if (oauthRequest.clientId !== GROK_CLIENT_ID) {
        return oauthErrorPage("Unrecognized OAuth client", "Only the official Grok connector client is allowed to authorize this MCP server.", 403);
      }
      if (!GROK_REDIRECT_URIS.has(oauthRequest.redirectUri)) {
        return oauthErrorPage("Unapproved callback", "The OAuth callback is not one of the official Grok connector callback URLs.", 403);
      }
      const requestedResources = Array.isArray(oauthRequest.resource)
        ? oauthRequest.resource
        : oauthRequest.resource
          ? [oauthRequest.resource]
          : [];
      if (requestedResources.some((resource: string) => resource !== MCP_RESOURCE_URL)) {
        return oauthErrorPage("Invalid resource", "The OAuth request targets a resource other than this MCP server.", 400);
      }

      const requestedScopes = Array.isArray(oauthRequest.scope) ? oauthRequest.scope : [];
      if (!requestedScopes.includes("mcp:write") || requestedScopes.some((scope: string) => !MCP_OAUTH_SCOPES.includes(scope))) {
        return oauthErrorPage("Invalid permissions", "The request must use the supported Starlight MCP scopes.", 400);
      }

      const details = await oauth.describeConsent(oauthRequest);
      // Grok's embedded consent browser is not returning cookies. Use a random, server-stored,
      // one-time synchronizer token instead of the provider helper's cookie-bound consent handle.
      const handle = base64Url(crypto.getRandomValues(new Uint8Array(32)));
      const key = "grok-consent-form:" + await sha256Hex(handle);
      const record: StoredOAuthConsent = {
        request: oauthRequest,
        createdAt: Date.now(),
      };
      await env.OAUTH_KV.put(key, JSON.stringify(record), { expirationTtl: 600 });
      return oauthHtmlResponse(oauthConsentPage(details, handle));
    }

    if (request.method === "POST") {
      const form = await request.formData();
      const handle = String(form.get("handle") || "");
      if (!handle || handle.length > 200) {
        return oauthErrorPage("Invalid authorization request", "The one-time authorization form is missing or invalid.");
      }

      const key = "grok-consent-form:" + await sha256Hex(handle);
      const stored = await env.OAUTH_KV.get(key);
      if (!stored) {
        return oauthErrorPage("Authorization expired", "This one-time authorization form is expired or already used.");
      }

      // Consume before processing approval or denial so the same form cannot be replayed.
      await env.OAUTH_KV.delete(key);
      let saved: StoredOAuthConsent;
      try {
        saved = JSON.parse(stored) as StoredOAuthConsent;
      } catch {
        return oauthErrorPage("Authorization unavailable", "The one-time authorization record was invalid.");
      }

      const oauthRequest = saved.request;
      if (
        !oauthRequest ||
        oauthRequest.clientId !== GROK_CLIENT_ID ||
        !GROK_REDIRECT_URIS.has(oauthRequest.redirectUri) ||
        Date.now() - saved.createdAt > 600_000
      ) {
        return oauthErrorPage("Authorization expired", "The authorization request is invalid, expired, or has already been used.");
      }

      if (String(form.get("decision") || "") !== "approve") {
        const denied = new URL(oauthRequest.redirectUri);
        denied.searchParams.set("error", "access_denied");
        denied.searchParams.set("error_description", "The user denied access.");
        if (oauthRequest.state) denied.searchParams.set("state", oauthRequest.state);
        denied.searchParams.set("iss", MCP_PUBLIC_ORIGIN);
        return Response.redirect(denied.toString(), 302);
      }

      const suppliedSecret = String(form.get("approval_secret") || "");
      if (!constantTimeEqual(suppliedSecret, env.MCP_OAUTH_APPROVAL_SECRET)) {
        return oauthErrorPage("Authorization not approved", "The approval secret did not match. Start a fresh authorization attempt.", 403);
      }

      const requestedScopes = Array.isArray(oauthRequest.scope) ? oauthRequest.scope : [];
      const scope = form.getAll("scope").map(String).filter((value) =>
        MCP_OAUTH_SCOPES.includes(value) && requestedScopes.includes(value)
      );
      if (!scope.includes("mcp:write")) {
        return oauthErrorPage("Authorization not approved", "The MCP write permission is required. Start a fresh authorization attempt.", 403);
      }

      const completed = await oauth.completeAuthorization({
        request: oauthRequest,
        userId: "starlight-ai-owner",
        metadata: {},
        scope,
        props: { userId: "starlight-ai-owner" },
      });
      return Response.redirect(completed.redirectTo, 302);
    }

    return new Response("Method not allowed", { status: 405, headers: { allow: "GET, POST" } });
  } catch (error) {
    const redirectTo = error && typeof error === "object" && "redirectTo" in error
      ? (error as { redirectTo?: unknown }).redirectTo
      : undefined;
    if (typeof redirectTo === "string") return Response.redirect(redirectTo, 302);
    const message = error instanceof Error ? error.message : "Invalid OAuth authorization request.";
    return oauthErrorPage("Authorization could not be completed", message, 400);
  }
}

const oauthApiHandler = {
  fetch(request: Request, env: Env, ctx: WorkerContext) {
    return createMcpHandler(() => createServer(env))(request, env, ctx);
  },
};

const oauthDefaultHandler = {
  fetch(request: Request, env: Env, _ctx: WorkerContext) {
    const url = new URL(request.url);
    if (url.pathname === "/authorize") return handleOAuthAuthorization(request, env);
    if (url.pathname === "/health") {
      return jsonResponse({
        ok: true,
        service: "starlight-prospect-mcp",
        authenticationRequiredForTools: true,
        oauthEnabled: true,
      });
    }
    return jsonResponse({ ok: false, error: "Not found" }, 404);
  },
};

const oauthHandler = new OAuthProvider<Env>({
  apiRoute: "/mcp",
  apiHandler: oauthApiHandler,
  defaultHandler: oauthDefaultHandler,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/oauth/token",
  clientRegistrationEndpoint: "/oauth/register",
  scopesSupported: MCP_OAUTH_SCOPES,
  requiredScopes: ["mcp:write"],
  resourceMetadata: {
    resource: MCP_RESOURCE_URL,
    authorization_servers: [MCP_PUBLIC_ORIGIN],
  },
  clientIdMetadataDocumentEnabled: true,
  clientRegistrationCallback: ({ clientMetadata }) => {
    const rawUris = clientMetadata.redirect_uris;
    const redirectUris = Array.isArray(rawUris) ? rawUris.map(String) : [];
    if (redirectUris.length === 0 || redirectUris.some((uri) => !GROK_REDIRECT_URIS.has(uri))) {
      return {
        code: "invalid_client_metadata",
        description: "Only the official Grok connector callback URLs are allowed.",
        status: 400,
      };
    }
  },
});

export default {
  async fetch(request: Request, env: Env, ctx: WorkerContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return jsonResponse({
        ok: true,
        service: "starlight-prospect-mcp",
        authenticationRequiredForTools: true,
        oauthEnabled: true,
      });
    }

    // Preserve the established, secret-authenticated test workflow. Grok uses OAuth.
    const authorization = request.headers.get("authorization") || "";
    if (
      url.pathname === "/mcp" &&
      env.MCP_BEARER_TOKEN &&
      env.MCP_BEARER_TOKEN.length >= 32 &&
      constantTimeEqual(authorization, "Bearer " + env.MCP_BEARER_TOKEN)
    ) {
      return createMcpHandler(() => createServer(env))(request, env, ctx);
    }

    return oauthHandler.fetch(request, env, ctx);
  },
};
