// Cloudflare MCP Worker entrypoint; do not replace with the default Hello World template.
// Build trigger after Cloudflare Git integration reconnection (no runtime behavior change).
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
  OAUTH_KV?: KvNamespaceLike;
};

interface KvNamespaceLike {
  get(key: string, type?: "text"): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number; expiration?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

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


const GROK_OAUTH_CLIENT_ID = "grok-starlight-prospect-mcp";
const GROK_OAUTH_SCOPE = "mcp";
const GROK_OAUTH_CALLBACK = "https://grok.com/connectors-oauth-exchange-code/";
const OAUTH_CODE_TTL_SECONDS = 300;
const OAUTH_ACCESS_TTL_SECONDS = 3600;
const OAUTH_REFRESH_TTL_SECONDS = 60 * 60 * 24 * 30;

type PendingOAuthAuthorization = {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state: string;
  scope: string;
  resource: string;
  csrf: string;
  issuedAt: number;
};

type OAuthCodeRecord = {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  scope: string;
  resource: string;
  issuedAt: number;
};

type OAuthRefreshRecord = {
  clientId: string;
  scope: string;
  resource: string;
  expiresAt: number;
};

type OAuthAccessClaims = {
  iss: string;
  sub: string;
  aud: string;
  client_id: string;
  scope: string;
  iat: number;
  exp: number;
  jti: string;
};

function base64UrlDecode(value: string): ArrayBuffer {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function randomOAuthValue(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function sha256Base64Url(value: string): Promise<string> {
  return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}

function htmlEscape(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
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

function authorizationForm(handle: string, csrf: string, message = ""): string {
  const messageHtml = message ? "<p role=\"alert\">" + htmlEscape(message) + "</p>" : "";
  return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
    "<title>Authorize Starlight Prospect MCP</title>" +
    "<style>body{font:16px system-ui,sans-serif;max-width:640px;margin:8vh auto;padding:0 20px;color:#1b1b1b}" +
    "main{border:1px solid #ddd;border-radius:16px;padding:24px}label{display:block;margin:18px 0 8px}" +
    "input[type=password]{box-sizing:border-box;width:100%;padding:12px;border:1px solid #888;border-radius:8px}" +
    "button{padding:11px 16px;border:0;border-radius:8px;cursor:pointer}" +
    "button[name=decision][value=approve]{background:#111;color:white}.muted{color:#555}</style></head><body><main>" +
    "<h1>Authorize Starlight Prospect MCP</h1>" +
    "<p>Grok is requesting access to the Starlight prospect test tool.</p>" +
    "<p><strong>Access requested:</strong> " + htmlEscape(GROK_OAUTH_SCOPE) + "</p>" +
    "<p><strong>Redirect destination:</strong> grok.com</p>" +
    "<p class=\"muted\">This authorizes the MCP tools exposed by this Worker. Production writing remains disabled. " +
    "Enter your separate MCP OAuth approval secret. Do not enter your Google service-account JSON or GitHub deployment token.</p>" +
    messageHtml +
    "<form method=\"post\" action=\"/authorize\" autocomplete=\"off\">" +
    "<input type=\"hidden\" name=\"handle\" value=\"" + htmlEscape(handle) + "\">" +
    "<input type=\"hidden\" name=\"csrf\" value=\"" + htmlEscape(csrf) + "\">" +
    "<label for=\"approval_secret\">MCP OAuth approval secret</label>" +
    "<input id=\"approval_secret\" name=\"approval_secret\" type=\"password\" minlength=\"32\" required autocomplete=\"off\">" +
    "<p><button name=\"decision\" value=\"approve\" type=\"submit\">Approve access</button> " +
    "<button name=\"decision\" value=\"deny\" type=\"submit\">Deny</button></p>" +
    "</form></main></body></html>";
}

function requireOAuthKV(env: Env): KvNamespaceLike {
  if (!env.OAUTH_KV) throw new Error("OAUTH_KV namespace binding is not configured.");
  return env.OAUTH_KV;
}

function validGrokRedirectUri(value: string): boolean {
  try {
    const redirect = new URL(value);
    return redirect.protocol === "https:" &&
      redirect.hostname === "grok.com" &&
      redirect.pathname === "/connectors-oauth-exchange-code/" &&
      redirect.search === "" &&
      redirect.hash === "" &&
      redirect.username === "" &&
      redirect.password === "" &&
      redirect.toString() === GROK_OAUTH_CALLBACK;
  } catch {
    return false;
  }
}

function oauthMetadata(origin: string): Record<string, unknown> {
  return {
    issuer: origin,
    authorization_endpoint: origin + "/authorize",
    token_endpoint: origin + "/token",
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["none"],
    code_challenge_methods_supported: ["S256"],
    scopes_supported: [GROK_OAUTH_SCOPE],
    authorization_response_iss_parameter_supported: true,
  };
}

function protectedResourceMetadata(origin: string): Record<string, unknown> {
  return {
    resource: origin + "/mcp",
    authorization_servers: [origin],
    bearer_methods_supported: ["header"],
    scopes_supported: [GROK_OAUTH_SCOPE],
  };
}

async function handleOAuthAuthorize(request: Request, env: Env): Promise<Response> {
  if (!env.OAUTH_KV) return jsonResponse({ error: "server_error", error_description: "OAuth storage is not configured." }, 503);
  if (!env.MCP_OAUTH_APPROVAL_SECRET || env.MCP_OAUTH_APPROVAL_SECRET.length < 32) {
    return jsonResponse({ error: "server_error", error_description: "MCP_OAUTH_APPROVAL_SECRET is not configured or is too short." }, 503);
  }

  const url = new URL(request.url);
  const kv = env.OAUTH_KV;

  if (request.method === "GET") {
    const clientId = url.searchParams.get("client_id") || "";
    const redirectUri = url.searchParams.get("redirect_uri") || "";
    const responseType = url.searchParams.get("response_type") || "";
    const state = url.searchParams.get("state") || "";
    const challenge = url.searchParams.get("code_challenge") || "";
    const challengeMethod = url.searchParams.get("code_challenge_method") || "";
    const requestedScopes = (url.searchParams.get("scope") || GROK_OAUTH_SCOPE).split(/\s+/).filter(Boolean);
    const resource = url.searchParams.get("resource") || (url.origin + "/mcp");

    if (
      clientId !== GROK_OAUTH_CLIENT_ID ||
      !validGrokRedirectUri(redirectUri) ||
      responseType !== "code" ||
      !state || state.length > 1024 ||
      !/^[A-Za-z0-9_-]{43}$/.test(challenge) ||
      challengeMethod !== "S256" ||
      requestedScopes.length !== 1 ||
      requestedScopes[0] !== GROK_OAUTH_SCOPE ||
      resource !== (url.origin + "/mcp")
    ) {
      return jsonResponse({ error: "invalid_request", error_description: "The OAuth request is invalid or unsupported." }, 400);
    }

    const handle = randomOAuthValue(24);
    const csrf = randomOAuthValue(24);
    const pending: PendingOAuthAuthorization = {
      clientId,
      redirectUri,
      codeChallenge: challenge,
      state,
      scope: GROK_OAUTH_SCOPE,
      resource,
      csrf,
      issuedAt: Math.floor(Date.now() / 1000),
    };
    await kv.put("oauth:pending:" + handle, JSON.stringify(pending), { expirationTtl: 600 });
    return oauthHtmlResponse(authorizationForm(handle, csrf));
  }

  if (request.method === "POST") {
    if (request.headers.get("origin") !== url.origin) {
      return jsonResponse({ error: "invalid_request", error_description: "Invalid authorization form origin." }, 403);
    }
    const form = await request.formData();
    const handle = String(form.get("handle") || "");
    const csrf = String(form.get("csrf") || "");
    const approvalSecret = String(form.get("approval_secret") || "");
    const decision = String(form.get("decision") || "");
    if (!/^[A-Za-z0-9_-]{32}$/.test(handle)) {
      return jsonResponse({ error: "invalid_request", error_description: "Invalid authorization request." }, 400);
    }

    const pendingText = await kv.get("oauth:pending:" + handle, "text");
    if (!pendingText) return oauthHtmlResponse(authorizationForm("", "", "This authorization request expired. Return to Grok and start again."), 410);
    const pending = JSON.parse(pendingText) as PendingOAuthAuthorization;
    if (!constantTimeEqual(csrf, pending.csrf)) {
      return jsonResponse({ error: "invalid_request", error_description: "Invalid authorization form token." }, 403);
    }

    if (decision !== "approve") {
      await kv.delete("oauth:pending:" + handle);
      const target = new URL(pending.redirectUri);
      target.searchParams.set("error", "access_denied");
      target.searchParams.set("state", pending.state);
      target.searchParams.set("iss", url.origin);
      return Response.redirect(target.toString(), 302);
    }

    if (!constantTimeEqual(approvalSecret, env.MCP_OAUTH_APPROVAL_SECRET)) {
      return oauthHtmlResponse(authorizationForm(handle, pending.csrf, "That approval secret did not match. Try again or restart the connection."), 403);
    }

    const code = randomOAuthValue(32);
    const codeRecord: OAuthCodeRecord = {
      clientId: pending.clientId,
      redirectUri: pending.redirectUri,
      codeChallenge: pending.codeChallenge,
      scope: pending.scope,
      resource: pending.resource,
      issuedAt: Math.floor(Date.now() / 1000),
    };
    await kv.put("oauth:code:" + await sha256Base64Url(code), JSON.stringify(codeRecord), { expirationTtl: OAUTH_CODE_TTL_SECONDS });
    await kv.delete("oauth:pending:" + handle);

    const target = new URL(pending.redirectUri);
    target.searchParams.set("code", code);
    target.searchParams.set("state", pending.state);
    target.searchParams.set("iss", url.origin);
    return Response.redirect(target.toString(), 302);
  }

  return new Response("Method not allowed", { status: 405, headers: { allow: "GET, POST" } });
}

async function createOAuthTokens(
  env: Env,
  origin: string,
  clientId: string,
  scope: string,
  resource: string,
): Promise<{ access_token: string; token_type: "Bearer"; expires_in: number; refresh_token: string; scope: string }> {
  const secret = env.MCP_OAUTH_APPROVAL_SECRET;
  if (!secret || secret.length < 32) throw new Error("OAuth signing secret is not configured.");
  const now = Math.floor(Date.now() / 1000);
  const claims: OAuthAccessClaims = {
    iss: origin,
    sub: "starlight-ai-owner",
    aud: resource,
    client_id: clientId,
    scope,
    iat: now,
    exp: now + OAUTH_ACCESS_TTL_SECONDS,
    jti: randomOAuthValue(16),
  };
  const unsigned = base64UrlText(JSON.stringify({ alg: "HS256", typ: "JWT" })) + "." + base64UrlText(JSON.stringify(claims));
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(unsigned)));
  const accessToken = unsigned + "." + base64Url(signature);

  const refreshToken = randomOAuthValue(32);
  const refreshRecord: OAuthRefreshRecord = {
    clientId,
    scope,
    resource,
    expiresAt: now + OAUTH_REFRESH_TTL_SECONDS,
  };
  await requireOAuthKV(env).put(
    "oauth:refresh:" + await sha256Base64Url(refreshToken),
    JSON.stringify(refreshRecord),
    { expirationTtl: OAUTH_REFRESH_TTL_SECONDS },
  );
  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: OAUTH_ACCESS_TTL_SECONDS,
    refresh_token: refreshToken,
    scope,
  };
}

async function handleOAuthToken(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
  }
  if (!env.OAUTH_KV || !env.MCP_OAUTH_APPROVAL_SECRET || env.MCP_OAUTH_APPROVAL_SECRET.length < 32) {
    return jsonResponse({ error: "server_error", error_description: "OAuth storage or signing secret is not configured." }, 503);
  }

  const bodyText = await request.text();
  if (bodyText.length > 16384) return jsonResponse({ error: "invalid_request" }, 413);
  const form = new URLSearchParams(bodyText);
  const clientId = form.get("client_id") || "";
  const clientSecret = form.get("client_secret") || "";
  const grantType = form.get("grant_type") || "";
  const resourceParam = form.get("resource") || "";
  if (clientId !== GROK_OAUTH_CLIENT_ID || clientSecret !== "") {
    return jsonResponse({ error: "invalid_client" }, 401);
  }

  if (grantType === "authorization_code") {
    const code = form.get("code") || "";
    const redirectUri = form.get("redirect_uri") || "";
    const verifier = form.get("code_verifier") || "";
    if (!code || !validGrokRedirectUri(redirectUri) || !/^[A-Za-z0-9._~-]{43,128}$/.test(verifier)) {
      return jsonResponse({ error: "invalid_grant" }, 400);
    }

    const kv = env.OAUTH_KV;
    const codeKey = "oauth:code:" + await sha256Base64Url(code);
    const recordText = await kv.get(codeKey, "text");
    if (!recordText) return jsonResponse({ error: "invalid_grant" }, 400);
    const record = JSON.parse(recordText) as OAuthCodeRecord;
    const challenge = await sha256Base64Url(verifier);
    if (
      record.clientId !== clientId ||
      record.redirectUri !== redirectUri ||
      record.codeChallenge !== challenge ||
      (resourceParam !== "" && resourceParam !== record.resource) ||
      Math.floor(Date.now() / 1000) - record.issuedAt > OAUTH_CODE_TTL_SECONDS
    ) {
      return jsonResponse({ error: "invalid_grant" }, 400);
    }

    await kv.delete(codeKey);
    try {
      const tokens = await createOAuthTokens(env, new URL(request.url).origin, clientId, record.scope, record.resource);
      return jsonResponse(tokens, 200);
    } catch {
      return jsonResponse({ error: "server_error", error_description: "Could not issue tokens." }, 500);
    }
  }

  if (grantType === "refresh_token") {
    const refreshToken = form.get("refresh_token") || "";
    if (!refreshToken) return jsonResponse({ error: "invalid_grant" }, 400);
    const kv = env.OAUTH_KV;
    const refreshKey = "oauth:refresh:" + await sha256Base64Url(refreshToken);
    const refreshText = await kv.get(refreshKey, "text");
    if (!refreshText) return jsonResponse({ error: "invalid_grant" }, 400);
    const record = JSON.parse(refreshText) as OAuthRefreshRecord;
    if (record.clientId !== clientId || record.expiresAt <= Math.floor(Date.now() / 1000) ||
        (resourceParam !== "" && resourceParam !== record.resource)) {
      return jsonResponse({ error: "invalid_grant" }, 400);
    }
    await kv.delete(refreshKey);
    try {
      const tokens = await createOAuthTokens(env, new URL(request.url).origin, clientId, record.scope, record.resource);
      return jsonResponse(tokens, 200);
    } catch {
      return jsonResponse({ error: "server_error", error_description: "Could not refresh tokens." }, 500);
    }
  }

  return jsonResponse({ error: "unsupported_grant_type" }, 400);
}

async function validOAuthAccessToken(env: Env, token: string, origin: string): Promise<boolean> {
  const secret = env.MCP_OAUTH_APPROVAL_SECRET;
  if (!secret || secret.length < 32) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  let claims: OAuthAccessClaims;
  try {
    const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0]))) as { alg?: string; typ?: string };
    if (header.alg !== "HS256" || header.typ !== "JWT") return false;
    claims = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1]))) as OAuthAccessClaims;
  } catch {
    return false;
  }

  const unsigned = parts[0] + "." + parts[1];
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"],
  );
  let signatureValid = false;
  try {
    signatureValid = await crypto.subtle.verify("HMAC", key, base64UrlDecode(parts[2]), encoder.encode(unsigned));
  } catch {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return signatureValid &&
    claims.iss === origin &&
    claims.aud === (origin + "/mcp") &&
    claims.client_id === GROK_OAUTH_CLIENT_ID &&
    claims.scope.split(/\s+/).includes(GROK_OAUTH_SCOPE) &&
    Number.isInteger(claims.exp) && claims.exp > now &&
    Number.isInteger(claims.iat) && claims.iat <= now + 60;
}

export default {
  async fetch(request: Request, env: Env, ctx: WorkerContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return jsonResponse({ ok: true, service: "starlight-prospect-mcp", authenticationRequiredForTools: true });
    }

    if (url.pathname === "/.well-known/oauth-authorization-server" && request.method === "GET") {
      return jsonResponse(oauthMetadata(url.origin));
    }
    if (
      (url.pathname === "/.well-known/oauth-protected-resource" ||
        url.pathname === "/.well-known/oauth-protected-resource/mcp") &&
      request.method === "GET"
    ) {
      return jsonResponse(protectedResourceMetadata(url.origin));
    }
    if (url.pathname === "/authorize") return handleOAuthAuthorize(request, env);
    if (url.pathname === "/token") return handleOAuthToken(request, env);

    if (url.pathname !== "/mcp") return jsonResponse({ ok: false, error: "Not found" }, 404);
    if (!env.MCP_BEARER_TOKEN || env.MCP_BEARER_TOKEN.length < 32) {
      return jsonResponse({ ok: false, error: "MCP_BEARER_TOKEN secret is not configured or is too short." }, 503);
    }

    const authorization = request.headers.get("authorization") || "";
    let authenticated = constantTimeEqual(authorization, "Bearer " + env.MCP_BEARER_TOKEN);
    if (!authenticated && authorization.startsWith("Bearer ")) {
      authenticated = await validOAuthAccessToken(env, authorization.slice(7).trim(), url.origin);
    }
    if (!authenticated) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "www-authenticate": "Bearer resource_metadata=\"" + url.origin + "/.well-known/oauth-protected-resource/mcp\", scope=\"" + GROK_OAUTH_SCOPE + "\"",
          "cache-control": "no-store",
        },
      });
    }
    return createMcpHandler(() => createServer(env))(request, env, ctx);
  },
};
