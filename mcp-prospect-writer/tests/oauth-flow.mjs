import assert from 'node:assert/strict';
import { randomBytes, createHash } from 'node:crypto';
import { unstable_dev } from 'wrangler';

// Local Miniflare bindings only. No production credentials, remote KV/DO, or Sheets writes.
const secret = randomBytes(48).toString('base64url');
const callback = 'https://grok.com/connectors-oauth-exchange-code/';
const resource = 'https://starlight-prospect-mcp.starlightai306.workers.dev/mcp';
const worker = await unstable_dev('src/index.ts', {
  config: 'wrangler.jsonc', local: true, persist: false,
  vars: { MCP_OAUTH_APPROVAL_SECRET: secret },
  experimental: { disableExperimentalWarning: true }, logLevel: 'error',
});
let count = 0;
const check = (name, fn) => Promise.resolve().then(fn).then(() => { count++; console.log('PASS ' + name); });
const request = (path, init={}) => worker.fetch(path, { ...init, redirect: 'manual' });
const formRequest = (handle, supplied=secret, scopes=['mcp:write','offline_access']) => request('/authorize', {
  method:'POST', body:new URLSearchParams([['handle',handle],['decision','approve'],['approval_secret',supplied],...scopes.map(s=>['scope',s])]),
});
let client;
async function begin(overrides={}) {
  const verifier = randomBytes(48).toString('base64url');
  const params = new URLSearchParams({response_type:'code',client_id:client.client_id,redirect_uri:callback,
    resource,scope:'mcp:write offline_access',state:randomBytes(16).toString('hex'),
    code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:'S256',...overrides});
  const response=await request('/authorize?'+params);
  const html=await response.text();
  return {response,html,handle:/name="handle" value="([^"]+)"/.exec(html)?.[1],verifier,params};
}
async function token(code, verifier, extra={}) {
  return request('/oauth/token',{method:'POST',body:new URLSearchParams({grant_type:'authorization_code',client_id:client.client_id,
    code,redirect_uri:callback,code_verifier:verifier,resource,...extra})});
}
try {
  await check('registered local public test client',async()=>{
    const r=await request('/oauth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
      client_name:'Isolated Starlight OAuth regression',redirect_uris:[callback],grant_types:['authorization_code','refresh_token'],response_types:['code'],token_endpoint_auth_method:'none',scope:'mcp:write offline_access'})});
    assert.equal(r.status,201);client=await r.json();assert.ok(client.client_id);
  });
  await check('valid authorization, CSP callback restriction and nonce click guard',async()=>{
    const a=await begin();assert.equal(a.response.status,200);assert.ok(a.handle);
    const csp=a.response.headers.get('content-security-policy');assert.ok(csp.includes("form-action 'self' https://grok.com https://console.x.ai;"));assert.ok(csp.includes("script-src 'nonce-"));
    assert.ok(a.html.includes('if(submitted)'));assert.ok(a.html.includes('button.disabled=true'));assert.ok(a.html.includes('action="/authorize"'));
  });
  await check('wrong secret fails closed; consumed handle cannot be retried',async()=>{
    const a=await begin();assert.equal((await formRequest(a.handle,randomBytes(48).toString('base64url'))).status,403);
    assert.equal((await formRequest(a.handle)).status,400);
  });
  await check('unknown/expired or already removed handle is rejected',async()=>{
    assert.equal((await formRequest(randomBytes(32).toString('base64url'))).status,400);
  });
  await check('invalid callback and resource are rejected',async()=>{
    const a=await begin({redirect_uri:'https://example.org/callback'});assert.notEqual(a.response.status,200);assert.ok(!a.handle);
    const b=await begin({resource:'https://example.org/mcp'});assert.notEqual(b.response.status,200);assert.ok(!b.handle);
  });
  await check('unsupported requested scope is rejected',async()=>{
    const a=await begin({scope:'mcp:write admin'});assert.notEqual(a.response.status,200);assert.ok(!a.handle);
  });
  await check('successful approval, PKCE token exchange and code replay rejection',async()=>{
    const a=await begin();const r=await formRequest(a.handle);assert.equal(r.status,303);
    const redirect=new URL(r.headers.get('location'));assert.equal(redirect.origin+redirect.pathname,callback);
    assert.equal(redirect.searchParams.get('state'),a.params.get('state'));const code=redirect.searchParams.get('code');assert.ok(code);
    const exchanged=await token(code,a.verifier);assert.equal(exchanged.status,200);const credentials=await exchanged.json();assert.ok(credentials.access_token);
    // The local Wrangler host differs from the canonical OAuth resource URL, so this test
    // verifies OAuth issuance/replay here. The isolated Miniflare browser suite separately
    // rewrites the resource origin locally and verifies authorized MCP initialization.
    assert.notEqual((await token(code,a.verifier)).status,200);assert.equal((await formRequest(a.handle)).status,400);
  });
  await check('concurrent duplicate submissions mint at most one redirect',async()=>{
    const a=await begin();const results=await Promise.all([formRequest(a.handle),formRequest(a.handle)]);
    assert.equal(results.filter(r=>r.status===303).length,1);assert.equal(results.filter(r=>r.status===400).length,1);
  });
  await check('bad PKCE verifier cannot exchange issued authorization code',async()=>{
    const a=await begin();const r=await formRequest(a.handle);assert.equal(r.status,303);
    const code=new URL(r.headers.get('location')).searchParams.get('code');assert.notEqual((await token(code,randomBytes(48).toString('base64url'))).status,200);
  });
  console.log(`${count} integration checks passed. Production and Grok browser flow not tested.`);
} finally { await worker.stop(); }
