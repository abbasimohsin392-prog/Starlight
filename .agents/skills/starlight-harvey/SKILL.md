---
name: starlight-harvey
description: Set up, configure, operate, or troubleshoot the Harvey autonomous sales agent for Starlight AI, including prospect discovery, company research, email drafting, reply handling, and its local dashboard. Do not use for Starlight website or Cloudflare deployments.
---

# Starlight AI — Harvey operator

Harvey is a separate local sales application, not a Starlight website dependency or a Codex extension. Keep its checkout, database, credentials, and runtime outside the Starlight production app. The Codex provider requires macOS/Linux, Codex CLI `0.159.3` exactly, Node.js, Python 3.11+, and a ChatGPT-backed Codex login. On Windows, run Harvey in WSL2 Ubuntu. Do not use Harvey's Docker image for the Codex provider.

## Starlight positioning

- Company: Starlight AI.
- Website: https://starlightai.site
- Demo: https://starlightai.site/demo/ai-receptionist
- Offer: $149 for a 14-day pilot, credited toward the $297/month Growth subscription.
- Core services: AI phone receptionist, website AI chat assistant, WhatsApp AI agents, and enquiry/lead automation.
- Primary prospect segment: property management companies.
- Secondary segments: HVAC, plumbing, home services, real estate, dental practices, clinics, and law firms.
- Target markets: United States, United Kingdom, UAE, Kuwait, Turkey, and suitable English-language markets in Europe and the Middle East. Do not add Russia or another restricted/high-risk jurisdiction without the owner's explicit instruction and current legal/sanctions review.

## Mandatory outreach approval rules

1. Keep `channels.email.require_approval: true`. Never switch it off and never use an autopilot/auto-approve mode.
2. Keep `channels.email.max_daily_sends: 5` as the initial cap, `send_to_risky: false`, and `max_bounce_rate: 0.03`. Do not raise limits without explicit approval.
3. Every cold email and every drafted reply must be shown to the owner in full before it is approved. Wait for an explicit approval for the exact draft. Never approve a batch or send on the owner's behalf based on a general request to set up Harvey.
4. Emails must be short (aim for under 75 words), specific to a verified prospect observation, emotionally intelligent, and honest. No fabricated competitor activity, fake urgency, invented personalization, misleading subject lines, guarantees, or unsupported ROI claims.
5. For relevant after-hours enquiry problems, the approved demo link may be included: https://starlightai.site/demo/ai-receptionist. Do not add unrelated links.
6. Configure weekday sending windows of 08:00–17:00 in each recipient's local timezone. Use Asia/Karachi for Harvey's operator quiet-hours timezone.
7. Do not begin cold sending until the owner has supplied a real sending mailbox, its separate OAuth credentials, the truthful sender/postal details, and has verified SPF, DKIM, DMARC, domain warmup, list quality, and applicable country rules. The existing Gmail connector login is not automatically reusable by Harvey; Harvey's Gmail integration needs its own Google OAuth Desktop app credentials.
8. Leave LinkedIn automation disabled. Do not add Hunter credentials unless the owner explicitly reauthorizes that provider. Do not contact anyone in a supplied suppression/do-not-contact list.
9. Never place secrets, OAuth tokens, `.env`, `harvey.local.yaml`, `auth.json`, or Harvey's SQLite database in Git, issues, pull requests, logs, or chat.
10. If any compliance, recipient, deliverability, or account detail is uncertain, pause and ask the owner rather than guessing.

## Safe setup and operation

Follow `docs/harvey-starlight-install.md` in this repository. Clone upstream Harvey into a separate WSL home directory such as `~/tools/harvey`, not into the Starlight site repository. Pin the verified Codex CLI version required by upstream. Run `harvey setup`, train it on https://starlightai.site with the Codex provider, and inspect the generated local configuration before running anything.

Use the free discovery source first. Review and explicitly confirm signal categories before collection. Start with small batches and review company-level evidence before drafting. Keep email approval enabled at every stage. The local dashboard must remain bound to loopback; do not expose it publicly or through Cloudflare.

Harvey uses an isolated, tool-less Codex runtime for its own model calls. It intentionally does not inherit the user's normal Codex skills, MCP servers, hooks, project instructions, or settings. This Starlight skill guides Codex while managing the installation; it does not become an instruction inside Harvey's private runtime.
