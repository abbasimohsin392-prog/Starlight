# Starlight Prospect MCP Bridge

Isolated Cloudflare Worker intended to let Grok call a narrowly scoped Google Sheets writer over MCP. This folder is separate from the live Starlight website. Do not merge or deploy it as part of the website Worker.

## Security model

- MCP tools require an `Authorization: Bearer ...` header. `MCP_BEARER_TOKEN` must be stored as a Cloudflare Worker secret and must be at least 32 characters.
- The Google service-account JSON must be stored as `GOOGLE_SERVICE_ACCOUNT_JSON` (Worker secret), never committed to GitHub, pasted into Grok prompts, or added as a plain Worker variable.
- Initially, share only **Starlight Automation Test** with the service account, as Editor. Do not share the production tracker during setup.
- The only initially exposed write tool is `write_test_row`. It targets `TEST_SPREADSHEET_ID` and `API Test Leads`, preserves the existing header row, refuses unknown schema, prevents a repeated test marker, and verifies the appended row by reading it back.
- The production write tool is not registered unless both `ENABLE_PRODUCTION_WRITES=true` and `PRODUCTION_SPREADSHEET_ID` are set in Worker settings. Leave both unset until Aoun explicitly authorizes production use and the test succeeds. The Google service account must also be separately shared to the production file before that tool could write there.
- The Worker never sends emails or messages.

## Required setup

1. Create or select a Google Cloud project and enable the Google Sheets API.
2. Create a service account. Do not grant it project-wide editor/owner roles. Download a JSON key, then keep that key locally and put its full contents directly into Cloudflare's `GOOGLE_SERVICE_ACCOUNT_JSON` secret field. Do not commit it.
3. Share only the **Starlight Automation Test** spreadsheet with the service account's `client_email` as an Editor. Do not share the main tracker yet.
4. In a dedicated Cloudflare Worker named `starlight-prospect-mcp`, set the variable `TEST_SPREADSHEET_ID` to the test spreadsheet ID and add these secrets:
   - `GOOGLE_SERVICE_ACCOUNT_JSON`: full service-account JSON key content.
   - `MCP_BEARER_TOKEN`: a randomly generated secret of at least 32 characters.
5. Deploy this folder as its own Worker. Do not change the existing `starlight` website Worker. From a terminal in this folder, run:

   ```bash
   npm install
   npx wrangler login
   npx wrangler secret put MCP_BEARER_TOKEN
   npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON
   npx wrangler deploy
   ```

   Enter the secret values only into the terminal prompts. Never paste them into chat or code.

## Grok setup

1. Open Grok's custom connectors page and add a custom MCP connector using the deployed URL ending in `/mcp`.
2. Configure Bearer authentication using the same `MCP_BEARER_TOKEN`. If the connector UI does not offer a way to send an Authorization bearer header, stop; do not remove the Worker authentication or expose a no-auth endpoint.
3. Run `write_test_row` once. Confirm the tool reports `added_and_verified` (or an already-present marker that has been read back) and then inspect the `API Test Leads` tab. A repeated call will skip the existing test marker rather than add a duplicate.
4. Keep the Daily Client Finder skill in test-only mode until this exact write/read-back test succeeds.

## Optional production stage — disabled by default

Only after Aoun explicitly authorizes production writing:

1. Share the service account to `Starlight_AI_Prospect_Tracker` as an Editor.
2. Set `PRODUCTION_SPREADSHEET_ID` to the production spreadsheet ID.
3. Set `ENABLE_PRODUCTION_WRITES` to the literal value `true`.
4. Redeploy the Worker. The additional MCP tool `append_verified_prospects` will then appear. It accepts at most five records, requires official website/location/services/source URLs, checks existing business names and domains for duplicates, appends rows based on the existing `Leads` tab headers, and reads back the data for verification.

Do not set the production flag or share the production tracker until the test path is verified and Aoun explicitly approves.

## Local development

`wrangler dev` can run the MCP Worker locally, but Grok cannot reach a localhost URL. A remote deployment is required before creating the Grok custom connector. Keep `.dev.vars` out of Git; the included `.gitignore` excludes it.

## Troubleshooting

- `401 Unauthorized`: confirm the Grok connector sends the configured Bearer header.
- Google authentication failure: confirm `GOOGLE_SERVICE_ACCOUNT_JSON` is valid service-account JSON, the key is active, and the Sheets API is enabled.
- `403` from Sheets: confirm the test spreadsheet is shared to the service account's exact `client_email` as Editor.
- Header/schema refusal: no row is written. Compare the `API Test Leads` header row against the test writer's supported labels before changing anything.
- Never disable authentication to make the connector work; fix the connector authentication settings instead.

## References

- [Cloudflare remote MCP server guide](https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/)
- [Grok custom MCP connectors](https://docs.x.ai/grok/connectors)
- [Google Sheets values.append](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append)