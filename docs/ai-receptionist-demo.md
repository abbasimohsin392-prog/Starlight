# AI receptionist demo setup

The `/demo/ai-receptionist` page uses Google's Gemini Live API over WebSockets for low-latency microphone input and spoken responses. The permanent API key remains server-side; the backend issues a short-lived, one-use ephemeral token for the browser connection.

## Required server secret

1. Create an API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Add it as `GEMINI_API_KEY` in the hosting provider's **private server-side runtime secrets/environment variables**. `GOOGLE_API_KEY` is also accepted as a fallback.
3. Never put the permanent key in browser code, `NEXT_PUBLIC_*` variables, a public issue, or a committed file.
4. Redeploy/restart the runtime if your host requires it for secret changes.

For local development, put the key in an untracked `.env.local` file:

```bash
GEMINI_API_KEY=your_google_ai_studio_key_here
```

## Test the demo

1. Open `/demo/ai-receptionist` over HTTPS in a recent version of Chrome or Edge.
2. Click **Start voice chat** and grant microphone permission.
3. Speak naturally; the assistant should respond aloud. You can also type messages, mute the microphone, clear the visible transcript, or end the session.
4. If the demo says it is not configured, the runtime secret is missing or not visible to the server function. If Google returns an access or quota error, verify the key, project, current Live model availability, and AI Studio limits.

## Free tier, costs, and abuse protection

Google lists free-tier access for supported Gemini Live models subject to account and rate limits. Free-tier requests are subject to Google's data-use terms; check the current [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) and [terms](https://ai.google.dev/gemini-api/terms) before sharing the demo broadly. Requests on a billable paid tier may incur charges.

The token endpoint checks the browser's same-site origin and issues a single-use token with a short setup window and a 15-minute expiry. These checks do not replace hosting/edge rate limiting. Before widely sharing the public page, configure a rate limit on `POST /api/session` and set Google API usage alerts/limits. Audio-only Live sessions also have a provider-defined session-duration limit; start a new session if one ends.

## Privacy and scope

The page does not persist the transcript in a Starlight AI database. Audio is sent directly to Google Gemini for the live conversation. The assistant is only a demonstration: it does not book meetings, collect leads, contact employees, or connect to any business CRM, calendar, listing, or messaging account. Keep the on-page disclosure in place.
