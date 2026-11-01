import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

export type DomainCheckResult = {
  email: string;
  syntax_valid: boolean;
  routing_status: "mx_records_found" | "implicit_mx_possible" | "no_mail_routing" | "invalid_syntax" | "dns_error";
  decision: "domain_routable" | "do_not_use" | "manual_review";
  domain: string | null;
  mx_hosts: string[];
  checked_at: string;
  explanation: string;
};

type DnsAnswer = { name?: string; type?: number; data?: string };
type DnsJsonResponse = { Status?: number; Answer?: DnsAnswer[]; Comment?: string };

function parseEmail(value: string): { normalized: string; domain: string } | null {
  const normalized = value.trim().toLowerCase();
  if (normalized.length > 320 || /\s/.test(normalized)) return null;
  const at = normalized.lastIndexOf('@');
  if (at < 1 || at !== normalized.indexOf('@') || at === normalized.length - 1) return null;
  const local = normalized.slice(0, at);
  const rawDomain = normalized.slice(at + 1);
  if (local.length > 64 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)) return null;
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return null;
  let domain: string;
  try {
    const parsedUrl = new URL('https://' + rawDomain);
    if (parsedUrl.pathname !== '/' || parsedUrl.search || parsedUrl.hash || parsedUrl.username || parsedUrl.password || parsedUrl.port) {
      return null;
    }
    domain = parsedUrl.hostname.toLowerCase();
  } catch {
    return null;
  }
  if (!domain || domain.length > 253 || !domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return null;
  const labels = domain.split('.');
  if (labels.some((label) => !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label))) return null;
  return { normalized, domain };
}

async function queryDns(domain: string, recordType: 'MX' | 'A' | 'AAAA'): Promise<DnsJsonResponse> {
  const url = new URL('https://cloudflare-dns.com/dns-query');
  url.searchParams.set('name', domain);
  url.searchParams.set('type', recordType);
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { accept: 'application/dns-json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('DNS query failed with HTTP ' + response.status);
  return await response.json() as DnsJsonResponse;
}

async function checkOneEmail(email: string): Promise<DomainCheckResult> {
  const checkedAt = new Date().toISOString();
  const parsed = parseEmail(email);
  if (!parsed) {
    return {
      email: email.trim().toLowerCase(), syntax_valid: false, routing_status: 'invalid_syntax',
      decision: 'do_not_use', domain: null, mx_hosts: [], checked_at: checkedAt,
      explanation: 'Email address syntax is invalid. This check does not test a mailbox.',
    };
  }
  try {
    const mxResponse = await queryDns(parsed.domain, 'MX');
    const mxAnswers = (mxResponse.Answer || []).filter((answer) => answer.type === 15 && typeof answer.data === 'string');
    const isNullMx = mxAnswers.length === 1 && (mxAnswers[0].data || '').trim().split(/\s+/).slice(1).join(' ') === '.';
    if (mxResponse.Status === 0 && isNullMx) {
      return {
        email: parsed.normalized, syntax_valid: true, routing_status: 'no_mail_routing',
        decision: 'do_not_use', domain: parsed.domain, mx_hosts: [], checked_at: checkedAt,
        explanation: 'The domain publishes a Null MX record, explicitly indicating that it does not accept email. This does not test an individual mailbox.',
      };
    }
    if (mxResponse.Status === 0 && mxAnswers.length > 0) {
      const hosts = mxAnswers.map((answer) => (answer.data || '').trim().split(/\s+/).slice(1).join(' ').replace(/\.$/, '')).filter(Boolean);
      return {
        email: parsed.normalized, syntax_valid: true, routing_status: 'mx_records_found',
        decision: 'domain_routable', domain: parsed.domain, mx_hosts: hosts, checked_at: checkedAt,
        explanation: 'The domain publishes MX records. This confirms domain-level mail routing only; it does not confirm that this specific mailbox exists or accepts mail.',
      };
    }
    // SMTP permits an implicit MX fallback to A/AAAA when the domain has no MX record.
    const [aResponse, aaaaResponse] = await Promise.all([
      queryDns(parsed.domain, 'A'),
      queryDns(parsed.domain, 'AAAA'),
    ]);
    const hasAddressRecord = (aResponse.Answer || []).some((answer) => answer.type === 1) ||
      (aaaaResponse.Answer || []).some((answer) => answer.type === 28);
    if (hasAddressRecord && aResponse.Status === 0 && aaaaResponse.Status === 0) {
      return {
        email: parsed.normalized, syntax_valid: true, routing_status: 'implicit_mx_possible',
        decision: 'manual_review', domain: parsed.domain, mx_hosts: [], checked_at: checkedAt,
        explanation: 'No MX record was found, but the domain has an A/AAAA address record. SMTP implicit-MX fallback may apply; manual review is required. This does not confirm a mailbox.',
      };
    }
    if (mxResponse.Status === 3 || (mxResponse.Status === 0 && !hasAddressRecord)) {
      return {
        email: parsed.normalized, syntax_valid: true, routing_status: 'no_mail_routing',
        decision: 'do_not_use', domain: parsed.domain, mx_hosts: [], checked_at: checkedAt,
        explanation: 'No MX or implicit-MX address routing was found for the domain at check time. This does not test an individual mailbox.',
      };
    }
    return {
      email: parsed.normalized, syntax_valid: true, routing_status: 'dns_error',
      decision: 'manual_review', domain: parsed.domain, mx_hosts: [], checked_at: checkedAt,
      explanation: 'DNS returned an inconclusive result. Do not treat this address as verified.',
    };
  } catch (error) {
    return {
      email: parsed.normalized, syntax_valid: true, routing_status: 'dns_error',
      decision: 'manual_review', domain: parsed.domain, mx_hosts: [], checked_at: checkedAt,
      explanation: error instanceof Error ? error.message : 'DNS check failed. Manual review required.',
    };
  }
}

export async function checkEmailDomains(emails: string[]): Promise<DomainCheckResult[]> {
  const unique = Array.from(new Set(emails.map((email) => email.trim().toLowerCase())));
  const results: DomainCheckResult[] = [];
  for (let index = 0; index < unique.length; index += 5) {
    const chunk = unique.slice(index, index + 5);
    const checked = await Promise.all(chunk.map(checkOneEmail));
    results.push(...checked);
  }
  return results;
}

export function registerEmailDomainCheckTool(server: McpServer): void {
  server.registerTool(
    "check_email_domain_routing",
    {
      description: 'Check email syntax and domain-level MX/A/AAAA mail routing using DNS-over-HTTPS. Returns domain_routable, do_not_use, or manual_review. It cannot verify an individual mailbox, SMTP recipient acceptance, or inbox delivery.',
      inputSchema: z.object({ emails: z.array(z.string().trim().min(1).max(500)).min(1).max(20) }),
    },
    async ({ emails }) => {
      const results = await checkEmailDomains(emails);
      return {
        content: [{ type: 'text', text: JSON.stringify({
          ok: true, checked: results.length,
          domainRoutable: results.filter((result) => result.decision === 'domain_routable').length,
          doNotUse: results.filter((result) => result.decision === 'do_not_use').length,
          manualReview: results.filter((result) => result.decision === 'manual_review').length,
          mailboxVerification: 'not_performed',
          results,
        }, null, 2) }],
      };
    },
  );
}
