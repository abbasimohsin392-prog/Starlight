# AI receptionist demo setup

The `/demo/ai-receptionist` page uses the OpenAI Realtime API over WebRTC for live microphone input and spoken responses. The standard API key stays on the server.

## Required server secret

Set `OPENAI_API_KEY` as a **server-side secret** in the deployment provider's environment settings. Do not add it to source control or name it `NEXT_PUBLIC_OPENAI_API_KEY`.

For local development, add it to your untracked `.env.local` file:

```bash
OPENAI_API_KEY=your_api_key_here
```

For production, add the secret in the hosting provider's runtime environment (for example, Cloudflare Worker or Netlify site settings), then redeploy or restart the service as required by that provider. Do not paste the key into browser code, public issues, or committed files.

## How to test

1. Open `/demo/ai-receptionist` over HTTPS in a recent version of Chrome or Edge.
2. Click **Start voice chat** and grant microphone permission.
3. Wait for the live connection, then speak naturally. The assistant should respond aloud.
4. Test the text input, mute control, end-call control, and a fresh session.
5. If the page says the demo is not configured, the runtime secret is missing or is not visible to the server function. If the provider reports an access or usage error, verify API project access and usage limits.

## Cost and abuse protection

The Realtime API is usage-metered. Before promoting this public demo, configure provider usage alerts/limits and an edge or hosting-platform rate limit for `POST /api/session`. The route validates the same-site origin and bounds the SDP request size, but those checks are not a substitute for infrastructure-level rate limiting.

## Privacy and scope

The page does not persist the transcript in a Starlight AI database. Audio is sent to the voice provider for the live session. It is a demonstration only: it does not book meetings, collect leads, contact employees, or connect to any business CRM or messaging account. Keep the visible disclosure in place.
