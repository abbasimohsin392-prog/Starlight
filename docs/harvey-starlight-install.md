# Install Harvey for Starlight AI (Codex + WSL2)

This guide prepares Harvey as a **separate local sales application** for Starlight AI. It does not add Harvey to the Cloudflare Worker, the website build, the Starlight Prospect MCP, or GitHub Actions. Harvey's Codex brain uses a local Codex CLI through a private, isolated app-server runtime.

## Compatibility

Upstream Harvey currently documents these Codex requirements:

- Linux or macOS (Windows is refused by Harvey's Codex provider).
- Codex CLI **0.159.3 exactly**; Harvey intentionally rejects other versions until it verifies them.
- Node.js for the Codex npm package.
- Python 3.11 or newer.
- A ChatGPT account login through `codex login`; API-key logins are refused.

On this Windows workstation, use WSL2 with Ubuntu. Keep the Harvey checkout under the Linux home directory (for example `/home/<linux-user>/tools/harvey`), not under `/mnt/c` and not inside the Starlight website repository. Do not use the Harvey Docker image for Codex; upstream says its image ships the Claude CLI only.

Upstream references: [Harvey README — Codex provider](https://github.com/ethanplusai/harvey#using-a-chatgpt-plan-instead-codex), [Harvey changelog](https://github.com/ethanplusai/harvey/blob/main/CHANGELOG.md).

## 1. Install WSL2

In **PowerShell as Administrator**:

```powershell
wsl --install -d Ubuntu
```

Restart Windows if prompted, open Ubuntu from the Start menu, and complete the Linux username/password setup.

## 2. Install the Linux prerequisites

In the Ubuntu terminal:

```bash
sudo apt update
sudo apt install -y git curl build-essential python3 python3-venv python3-pip
python3 --version
```

Confirm Python is 3.11 or newer. Install Node.js 22 with nvm, then pin the Codex CLI version Harvey verifies:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
npm install -g @openai/codex@0.159.3
codex --version
```

The reported Codex version must be `0.159.3`. Then authenticate with the ChatGPT subscription:

```bash
codex login
```

Choose **Sign in with ChatGPT**, not an API key. Keep this WSL Codex installation separate from any native Windows Codex installation.

## 3. Clone and install Harvey separately

```bash
mkdir -p ~/tools
cd ~/tools
git clone https://github.com/ethanplusai/harvey.git
cd harvey
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e .
harvey setup
```

In `harvey setup`, select `codex` as the brain provider. Use the verified suggested model `gpt-5.5` if it is available in the account's model catalog. The wizard creates local configuration and credentials files. Do not commit them.

Before doing anything with email, run:

```bash
harvey status --check
```

If the check fails, stop and resolve the exact reported requirement. Harvey does not fall back to Claude or an API key.

## 4. Train Harvey on Starlight

After setup completes:

```bash
harvey train https://starlightai.site --provider codex --model gpt-5.5
```

Training writes `harvey.local.yaml`, which takes precedence over `harvey.yaml` and is intended to contain private company configuration. Review the file locally; do not upload it to GitHub.

Use the following Starlight profile as the configuration target when reviewing the wizard output and `harvey.local.yaml`:

- Company: Starlight AI.
- Website: https://starlightai.site
- Product: AI phone receptionist, website chat assistant, WhatsApp AI agents, and lead/enquiry automation for service businesses.
- Main positioning: help businesses capture and respond to customer enquiries when staff are unavailable, including after hours.
- Standard subscription: Growth from $297/month.
- Entry offer: $149 for a 14-day pilot, credited toward the $297/month subscription.
- Primary ICP: property management companies.
- Secondary ICPs: HVAC, plumbing, home services, real estate, dental practices, clinics, and law firms.
- Markets: United States, United Kingdom, UAE, Kuwait, Turkey, and other suitable English-language markets in Europe and the Middle East. Do not add Russia or another restricted/high-risk jurisdiction without the owner's explicit approval and current legal review.
- Decision-maker roles: owner/founder, property manager, operations manager, leasing manager, office manager, and relevant business leadership.

## 5. Mandatory conservative email settings

After training, merge these settings into the relevant sections of `harvey.local.yaml` (do not replace the whole file):

```yaml
brain:
  provider: codex
  model: gpt-5.5
  reasoning_effort: ""

channels:
  email:
    enabled: true
    provider: gmail
    max_daily_sends: 5
    require_approval: true
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

These are initial limits, not permission to send. Keep every draft in Harvey's Outbox for human review. Never disable `require_approval`, enable LinkedIn automation, approve a batch, or raise daily limits without the owner's explicit instruction.

## 6. Gmail and deliverability are a separate setup

Harvey's Gmail integration does **not** automatically reuse the Gmail connector login already connected to ChatGPT. It requires its own Google Cloud OAuth Desktop application:

1. Create a Google Cloud project and enable the Gmail API.
2. Create an OAuth client ID of type **Desktop app**.
3. Put its client ID and secret into Harvey's local `.env` as `GMAIL_CLIENT_ID` and `GMAIL_CLIENT_SECRET`.
4. Set `channels.email.provider: gmail` and run `harvey gmail auth`.

Use a dedicated sending mailbox on a secondary sending domain, not the primary Starlight domain or a personal inbox. Verify SPF, DKIM, and DMARC, and warm the mailbox gradually (Harvey's README recommends 2–4 weeks). Check readiness with `harvey warmup`. Do not start cold campaigns until the mailbox is actually ready, the real sender identity and required postal details are filled in, and country-specific compliance has been reviewed. Do not invent a mailing address or sender identity.

## 7. First run — discovery only

Begin with free, low-risk discovery and review the signal catalog first:

```bash
harvey signals
harvey signals --confirm free
harvey discover
harvey profile
harvey status
```

Do not run `harvey run` with a live sending mailbox until the owner has checked the configuration, verified the suppression list, reviewed deliverability and compliance, and explicitly authorized starting the workflow. When authorized, keep the dashboard and heartbeat local:

```bash
# Terminal 1
source ~/tools/harvey/.venv/bin/activate
cd ~/tools/harvey
harvey dashboard

# Terminal 2
source ~/tools/harvey/.venv/bin/activate
cd ~/tools/harvey
harvey run
```

The dashboard should remain on loopback (127.0.0.1:5555). Never expose it publicly, through a tunnel without explicit security review, or through Cloudflare.

## Data and safety

- Keep `.env`, `harvey.local.yaml`, `data/harvey.db`, `~/.codex/auth.json`, and OAuth files private and local.
- Do not put credentials in Starlight's GitHub repository, Cloudflare environment variables, GitHub Actions, or this guide.
- Do not send to unverified addresses, opted-out contacts, existing customers, competitors, or anyone on a do-not-contact list.
- Keep outreach short and factual. A prospect-specific observation must be verifiable; do not claim a competitor is winning their leads unless evidence supports it.
- Present the exact email draft and offer for the owner's approval before any send. A general request to install or run Harvey is not permission to send.
- Use the demo link only where relevant: https://starlightai.site/demo/ai-receptionist.

## Codex skill

The repository skill lives at `.agents/skills/starlight-harvey/SKILL.md`. In Codex, ask for `$starlight-harvey` after the branch is merged and the workspace is refreshed. The skill guides Codex while managing the WSL installation. Harvey's own isolated Codex runtime deliberately does not load this or other user skills.
