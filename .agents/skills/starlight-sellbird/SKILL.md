---
name: starlight-sellbird
description: Set up, upgrade, operate, and troubleshoot Sellbird (formerly Harvey) with Codex for Starlight AI's prospect discovery, lead qualification, email drafts, and reply monitoring. Never deploy Sellbird with the website.
---

# Starlight AI — Sellbird operator for Codex

Sellbird (formerly Harvey) is a **separate Linux sales app**, not a Starlight website dependency. Work in WSL2 Ubuntu, under `~/tools/sellbird` (or a detected existing `~/tools/harvey` installation). Never modify Starlight's website, Cloudflare deployment or GitHub Actions to host it.

Read `docs/sellbird-starlight-install.md` before running commands. Check for a prior Harvey installation, its .env, local configuration and data before cloning or migrating. Never overwrite, delete or expose those files. The upstream migration automatically converts legacy Harvey filenames on first run. Back up locally and shut down the old Harvey instance before migrating.

## Business and outreach constraints
- Starlight AI: https://starlightai.site
- Demo: https://starlightai.site/demo/ai-receptionist
- Services: 24/7 AI phone receptionist, AI website chat assistants, WhatsApp agents, enquiry automation.
- Offer: 14-day $149 pilot credited toward $297/mo Growth plan.
- Primary ICP: property managers and leasing/operations teams; secondary: HVAC, plumbers, real estate, home services, clinics, dental and law firms.
- Markets: US, UK, UAE, Kuwait, Turkey and other appropriate English-language European and Middle Eastern markets, subject to recipient-country laws. Do not target restricted markets without compliance review.
- Personalization: only real and checked website observations. 50–75 words or less, truthful urgency, focus on missed enquiries and faster response; no invented competitor claims or exaggerated guarantees. Use demo only when relevant.
- Do not use Hunter. No LinkedIn automation.

## Mandatory controls
- `channels.email.require_approval: true`; never approve, auto-approve or send from this installation request.
- Initial `max_daily_sends: 5`, `send_to_risky: false`, `max_bounce_rate: 0.03`; keep 08:00–17:00 recipient-local weekdays.
- Obtain explicit approval for each exact draft and offer before sending, including replies and follow-ups.
- Never cold-send without mailbox OAuth, real postal address, SPF/DKIM/DMARC, warmup and relevant jurisdiction compliance. Suppress opt-outs and previously contacted contacts; coordinate with the existing Starlight prospecting automations so nobody is contacted twice.
- Credentials and prospect records remain local, never Git.
- Keep dashboard local on 127.0.0.1:5555. Never publish to Cloudflare or internet.
- Default to discovery-only until setup validated.

## Codex installation and operation
Upstream currently requires Linux/macOS, Python 3.11+, Node.js, Codex CLI **0.159.3 exactly**, ChatGPT login via `codex login` (not an API key). Check current upstream `docs/codex.md` before installing. Its isolated Codex runtime deliberately does not load user skills or MCP.

After local setup, inspect `sellbird.local.yaml`, run `sellbird status --check`, `sellbird signals`, `sellbird discover`, `sellbird profile`, and `sellbird export` in safe discovery-only mode. `sellbird mcp install codex` is a separate optional integration; it changes local Codex config and asks for approval, and its MCP is read/pause only.

Do not claim that GitHub skill files installed the Sellbird runtime on the user's machine. Report what ran, what is only prepared, and what remains blocked.
