import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
const source=fs.readFileSync('src/index.ts','utf8');
const start=source.indexOf('export class OAuthConsentFormStore');
const end=source.indexOf('\n\nfunction oauthErrorPage',start);
const js=ts.transpileModule(source.slice(start,end).replace('export class','class')+'\nglobalThis.Store=OAuthConsentFormStore;', {compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
const context=vm.createContext({Request,Response,URL,Date,jsonResponse:(body,status=200)=>new Response(JSON.stringify(body),{status})});
vm.runInContext(js,context);
function store(){
 const data=new Map();let queue=Promise.resolve();
 const storage={get:async k=>data.get(k),put:async(k,v)=>data.set(k,v),delete:async k=>data.delete(k),setAlarm:async()=>{},deleteAlarm:async()=>{},deleteAll:async()=>data.clear(),transaction:fn=>{const next=queue.then(()=>fn(storage));queue=next.catch(()=>{});return next;}};
 return {instance:new context.Store({storage},{}),data};
}
const req=(route,body)=>new Request('https://consent-form-store/'+route,{method:'POST',...(body?{body:JSON.stringify(body)}:{})});
let s=store();await s.instance.fetch(req('put',{request:{},createdAt:Date.now()-600001}));assert.equal((await s.instance.fetch(req('consume'))).status,404);console.log('PASS actual stored consent expiry');
s=store();await s.instance.fetch(req('put',{request:{},createdAt:Date.now()}));assert.equal((await s.instance.fetch(req('consume'))).status,200);assert.equal((await s.instance.fetch(req('consume'))).status,404);console.log('PASS actual one-time consume');
s=store();assert.equal((await s.instance.fetch(req('put',{request:{},createdAt:'invalid'}))).status,400);console.log('PASS invalid record');
s=store();await s.instance.fetch(req('put',{request:{},createdAt:Date.now()}));await s.instance.alarm();assert.equal((await s.instance.fetch(req('consume'))).status,404);console.log('PASS expiry alarm cleanup');

const authStart=source.indexOf('async function handleOAuthAuthorization');
const authEnd=source.indexOf('\nconst oauthApiHandler',authStart);
const authJs=ts.transpileModule(source.slice(authStart,authEnd)+'\nglobalThis.authorize=handleOAuthAuthorization;', {compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
vm.runInContext(authJs,context);
for(const env of [{},{MCP_OAUTH_APPROVAL_SECRET:'short'},{MCP_OAUTH_APPROVAL_SECRET:'x'.repeat(40)},{MCP_OAUTH_APPROVAL_SECRET:'x'.repeat(40),OAUTH_KV:{}},{MCP_OAUTH_APPROVAL_SECRET:'x'.repeat(40),OAUTH_KV:{},CONSENT_FORM_STORE:{}}]) {
 assert.equal((await context.authorize(new Request('https://local/authorize'),env,()=>{})).status,503);
}
console.log('PASS five missing/invalid configuration cases');
