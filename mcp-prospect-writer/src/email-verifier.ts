import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

export type HunterEnv = { HUNTER_API_KEY?: string };

export type HunterVerificationResult = {
  email: string;
  provider: "Hunter";
  status: string;
  decision: "sendable" | "do_not_send" | "manual_review";
  score: number | null;
  mx_records: boolean | null;
  smtp_server: boolean | null;
  smtp_check: boolean | null;
  accept_all: boolean | null;
  blocked: boolean | null;
  disposable: boolean | null;
  webmail: boolean | null;
  verification_date: string | null;
  checked_at: string;
  reasons: string[];
  provider_sources: Array<{ domain: string | null; url: string | null; last_seen_on: string | null }>;
};

type HunterSource = { domain?: string; uri?: string; last_seen_on?: string };
type HunterData = {
  email?: string; status?: string; score?: number; regexp?: boolean; gibberish?: boolean;
  disposable?: boolean; webmail?: boolean; mx_records?: boolean; smtp_server?: boolean;
  smtp_check?: boolean; accept_all?: boolean; block?: boolean;
  verification?: { date?: string; status?: string } | null; sources?: HunterSource[];
};

export async function verifyEmailWithHunter(env: HunterEnv, email: string): Promise<HunterVerificationResult> {
  if (!env.HUNTER_API_KEY) {
    throw new Error("HUNTER_API_KEY is not configured. Add it as a Cloudflare Worker secret before mailbox verification can run.");
  }
  const normalizedEmail = email.trim().toLowerCase();
  const url = new URL("https://api.hunter.io/v2/email-verifier");
  url.searchParams.set("email", normalizedEmail);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "X-API-KEY": env.HUNTER_API_KEY,
      "accept": "application/json",
    },
  });
  if (response.status === 202 || response.status === 222) {
    return {
      email: normalizedEmail, provider: "Hunter", status: "unknown", decision: "manual_review",
      score: null, mx_records: null, smtp_server: null, smtp_check: null, accept_all: null,
      blocked: null, disposable: null, webmail: null, verification_date: null,
      checked_at: new Date().toISOString(),
      reasons: [response.status === 202 ? "Verification is still processing; retry later." : "The recipient server returned an unexpected SMTP response."],
      provider_sources: [],
    };
  }
  if (response.status === 401) throw new Error("Hunter rejected HUNTER_API_KEY (HTTP 401). Check the secret.");
  if (response.status === 403 || response.status === 429) {
    throw new Error("Hunter rate limit or verification quota reached (HTTP " + response.status + "). No prospect was approved.");
  }
  if (!response.ok) {
    throw new Error("Hunter email verification failed (HTTP " + response.status + "). No prospect was approved.");
  }
  let payload: { data?: HunterData };
  try { payload = await response.json() as { data?: HunterData }; }
  catch { throw new Error("Hunter returned an unreadable verification response. No prospect was approved."); }
  const data = payload.data;
  if (!data || typeof data.status !== "string") throw new Error("Hunter response did not contain a verification status. No prospect was approved.");
  const status = data.status.toLowerCase();
  const sendable = status === "valid" && data.mx_records === true && data.smtp_server === true &&
    data.smtp_check === true && data.accept_all !== true && data.block !== true &&
    data.disposable !== true && data.webmail !== true;
  const reasons: string[] = [];
  if (status !== "valid") reasons.push("Provider status is " + status + ".");
  if (data.mx_records !== true) reasons.push("Domain MX records were not confirmed.");
  if (data.smtp_server !== true) reasons.push("SMTP server connection was not confirmed.");
  if (data.smtp_check !== true) reasons.push("Mailbox SMTP check was not confirmed.");
  if (data.accept_all === true) reasons.push("Domain is catch-all/accept-all; individual mailbox cannot be confirmed.");
  if (data.block === true) reasons.push("Recipient server blocked the SMTP verification.");
  if (data.disposable === true) reasons.push("Disposable email provider detected.");
  if (data.webmail === true) reasons.push("Free webmail address detected; manual review required.");
  if (data.gibberish === true) reasons.push("Address appears automatically generated.");
  const hardInvalid = status === "invalid" || status === "disposable" || data.disposable === true ||
    data.mx_records === false || data.smtp_check === false;
  return {
    email: normalizedEmail, provider: "Hunter", status,
    decision: sendable ? "sendable" : hardInvalid ? "do_not_send" : "manual_review",
    score: typeof data.score === "number" ? data.score : null,
    mx_records: typeof data.mx_records === "boolean" ? data.mx_records : null,
    smtp_server: typeof data.smtp_server === "boolean" ? data.smtp_server : null,
    smtp_check: typeof data.smtp_check === "boolean" ? data.smtp_check : null,
    accept_all: typeof data.accept_all === "boolean" ? data.accept_all : null,
    blocked: typeof data.block === "boolean" ? data.block : null,
    disposable: typeof data.disposable === "boolean" ? data.disposable : null,
    webmail: typeof data.webmail === "boolean" ? data.webmail : null,
    verification_date: data.verification?.date || null,
    checked_at: new Date().toISOString(), reasons,
    provider_sources: (data.sources || []).slice(0, 5).map((source) => ({
      domain: source.domain || null, url: source.uri || null, last_seen_on: source.last_seen_on || null,
    })),
  };
}

export async function verifyEmailAddresses(env: HunterEnv, emails: string[]): Promise<HunterVerificationResult[]> {
  if (!env.HUNTER_API_KEY) throw new Error("HUNTER_API_KEY is not configured. Add it as a Cloudflare Worker secret before mailbox verification can run.");
  const uniqueEmails = Array.from(new Set(emails.map((email) => email.trim().toLowerCase())));
  const results: HunterVerificationResult[] = [];
  // Keep concurrency below Hunter's documented 10-requests-per-second limit.
  for (let index = 0; index < uniqueEmails.length; index += 5) {
    const chunk = uniqueEmails.slice(index, index + 5);
    const batch = await Promise.all(chunk.map((email) => verifyEmailWithHunter(env, email)));
    results.push(...batch);
  }
  return results;
}

export function registerEmailVerificationTool(server: McpServer, env: HunterEnv): void {
  server.registerTool(
    "verify_email_addresses",
    {
      description: "Verify 1-20 email addresses with Hunter's mailbox verifier. Returns provider status, MX and SMTP signals, catch-all/disposable/webmail flags, and a conservative sendable/do_not_send/manual_review decision. Only 'sendable' results pass the Starlight production lead writer's automatic verification gate. Requires the HUNTER_API_KEY Cloudflare Worker secret. Verification is not a guarantee of eventual inbox delivery.",
      inputSchema: z.object({ emails: z.array(z.string().trim().email().max(320)).min(1).max(20) }),
    },
    async ({ emails }) => {
      try {
        const results = await verifyEmailAddresses(env, emails);
        return {
          content: [{ type: "text", text: JSON.stringify({
            ok: true, provider: "Hunter", checked: results.length,
            sendable: results.filter((result) => result.decision === "sendable").length,
            doNotSend: results.filter((result) => result.decision === "do_not_send").length,
            manualReview: results.filter((result) => result.decision === "manual_review").length,
            results,
          }, null, 2) }],
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: "text", text: JSON.stringify({
            ok: false, error: error instanceof Error ? error.message : "Email verification failed.",
            noAddressesApproved: true,
          }) }],
        };
      }
    },
  );
}
