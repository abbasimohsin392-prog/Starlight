# Starlight AI — Sellbird (formerly Harvey) on Codex + WSL2 Ubuntu

This guide supersedes `docs/harvey-starlight-install.md` for **new** installations. Sellbird is a standalone Python sales application, **not** part of the Next.js website or Cloudflare Worker. No website build/deployment changes are necessary.

Upstream: https://github.com/ethanplusai/sellbird. Read its `README.md`, `docs/codex.md`, `docs/configuration.md`, `docs/deliverability.md` and `docs/approval-and-sending.md` before a live installation. As checked November 15, 2026, it requires Linux or macOS for its Codex provider, Python 3.11+, Node.js and **exactly Codex CLI 0.159.3**. Codex in Docker or native Windows is unsupported.

## 1. Detect prior Harvey before any install

On **Ubuntu WSL2** (not PowerShell):

```bash
command -v codex || true
codex --version || true
python3 --version
node --version
for d in "$HOME/tools/harvey" "$HOME/tools/sellbird"; do
  if [ -d "$d" ]; then echo "Existing installation: $d"; fi
done
```

If `~/tools/harvey` already exists, **stop any running Harvey**, make a private local backup of its `.env`, `harvey.local.yaml`, and `data/`, and upgrade **in place** rather than making a duplicate instance:

```bash
cd ~/tools/harvey
git status --short
git remote -v
# Confirm this is the original ethanplusai/harvey repository and changes are safe.
git pull --ff-only
source .venv/bin/activate
python -m pip install -e .
sellbird --help
```

GitHub redirects `ethanplusai/harvey` to Sellbird. Sellbird migrates legacy `harvey.local.yaml` and `data/harvey.db` on first run if safe, preserving user configuration. Do not clobber existing Sellbird files. If `git pull` is blocked or the migration is unclear, stop rather than forcing a merge.

## 2. Fresh installation (only if no Harvey/Sellbird checkout exists)

```bash
sudo apt update
sudo apt install -y git python3 python3-venv python3-pip
# Confirm python3 is at least 3.11; install a newer Python if not.
npm install -g @openai/codex@0.159.3
codex --version
codex login
mkdir -p ~/tools
cd ~/tools
git clone https://github.com/ethanplusai/sellbird.git
cd sellbird
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e .
sellbird setup
```

In `sellbird setup`, choose **codex**, a model present in the ChatGPT account catalog (upstream suggests `gpt-5.5`) and **approval mode**. Sign in via ChatGPT; never use an API key. Don't print or commit `~/.codex/auth.json`.

## 3. Train Starlight AI and review generated config

```bash
sellbird train https://starlightai.site --provider codex --model gpt-5.5
sellbird status --check
```

Only use `gpt-5.5` if it is available; otherwise choose an exact supported model from the account catalog. Training generates `sellbird.local.yaml` and may write additional local knowledge. Review its content and merge the following keys **into existing sections**, not as duplicate YAML mappings:

```yaml
brain:
  provider: codex
  model: gpt-5.5
  reasoning_effort: ""
channels:
  email:
    provider: gmail
    require_approval: true
    max_daily_sends: 5
    send_to_risky: false
    max_bounce_rate: 0.03
    send_window:
      start: "08:00"
      end: "17:00"
      weekdays_only: true
      recipient_timezone: true
  linkedin:
    enabled: false
usage:
  max_daily_claude_percent: 80
  heartbeat_interval_minutes: 15
  quiet_hours:
    start: "22:00"
    end: "07:00"
    timezone: "Asia/Karachi"
```

Review configuration schema with upstream `docs/configuration.md`. Preserve any already configured inbox/warmup data.

Product: 24/7 AI receptionist, chatbots and enquiry automation. $149 / 14-day pilot credited to the $297/mo Growth plan. Primary: property management. Secondary: HVAC, plumbing, real estate, clinics, dental, law and home services. Geo: US, UK, UAE, Kuwait, Turkey, and legally appropriate European/Middle Eastern markets. Use `https://starlightai.site/demo/ai-receptionist` in relevant personalized emails. Avoid Hunter and fabricated claims.

## 4. Discovery-only initial validation

```bash
sellbird status --check
sellbird signals
# After reviewing and confirming the free signals:
sellbird signals --confirm free
sellbird discover
sellbird profile
sellbird status
sellbird export
```

No email sends are authorized by these steps. Review address verification classifications; never send to risky/guessed addresses. Maintain suppression lists covering existing outreach and opt-outs to prevent duplicate sends from other Starlight automations.

## 5. Gmail, compliance, and optional Codex MCP

Sellbird **cannot reuse** the ChatGPT Gmail plugin's OAuth login. Create a Gmail API OAuth **Desktop app** in Google Cloud and store `GMAIL_CLIENT_ID` and `GMAIL_CLIENT_SECRET` only in the local `.env`; then run `sellbird gmail auth` interactively. Prefer a separate verified and warmed sending domain/inbox. Before sending, confirm true sender details and `compliance.postal_address`, SPF/DKIM/DMARC, opt-out controls, relevant GDPR/PECR/CAN-SPAM and other recipient-country requirements.

```bash
sellbird warmup
sellbird dashboard   # local dashboard 127.0.0.1:5555
```

Run `sellbird run` only after all gates have been checked and the operator has approved the workflow. Email stays in the Outbox until the exact draft is approved; no automatic approval.

To give regular Codex **read-only inspection and pause** of Sellbird, optionally run `sellbird mcp install codex` from a separate terminal and confirm its proposed config change. Sellbird's own isolated Codex provider does not inherit your normal skills/MCP.

Never commit secrets, prospect addresses, raw lead data, OAuth files or SQLite databases; never expose the local dashboard or modify the Starlight website deployment.
