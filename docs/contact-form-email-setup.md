# Website lead email setup

The contact form sends each valid enquiry to hello@starlightai.site through Brevo transactional email. The prospect’s email is set as Reply-To. The visitor sees success only after Brevo accepts the email request; missing configuration, provider rejection, or a timeout produces an error with the direct email fallback.

## Production setup (Cloudflare Worker)

1. In Brevo, create a transactional API key and verify a sender address/domain for Starlight AI. Do not put the key in this repository, a browser component, or chat.
2. Add the API key as an encrypted Worker secret named `BREVO_API_KEY` (Dashboard → Workers & Pages → your Worker → Settings → Variables and Secrets, or `npx wrangler secret put BREVO_API_KEY`).
3. Add `BREVO_FROM_EMAIL` as a Worker variable using the exact sender address verified in Brevo.
4. Deploy the Worker. `wrangler secret put` deploys a new Worker version. If gradual deployments are enabled, use the matching `wrangler versions secret put` and deploy that version.
5. Submit one real end-to-end test and verify the message reaches `hello@starlightai.site`; if delayed or bounced, check Brevo transactional logs. A 2xx response means Brevo accepted the send request, not a guarantee of inbox placement.

## Local preview

For an accurate local test, run the Cloudflare Worker preview (`pnpm preview`) rather than relying on plain Next.js `next dev`. Put `BREVO_API_KEY=...` and `BREVO_FROM_EMAIL=...` in an untracked `.dev.vars` file beside `wrangler.jsonc`; `.dev.vars*` is ignored by Git. Never commit real credentials.