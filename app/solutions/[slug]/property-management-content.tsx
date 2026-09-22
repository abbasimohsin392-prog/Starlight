'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Gauge, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import * as THREE from 'three'
import { Navbar } from '@/components/navbar'
import type { Niche } from '@/lib/niches'

const CALENDLY = 'https://calendly.com/starlightai306/30min?utm_source=solutions&utm_medium=property_management&utm_campaign=enquiry_audit'
const AUDIT_EMAIL = 'mailto:hello@starlightai.site?subject=Property%20management%20enquiry%20audit&body=Hi%20Starlight%2C%0A%0AI%27d%20like%20a%20free%203-point%20enquiry%20audit.%0A%0ATeam%2Fportfolio%20context%3A%0A%0A'

const stages = [
  { id: 'capture', n: '01', label: 'Capture', title: 'Acknowledge the enquiry', copy: 'The first response lands while the prospect is still comparing options—not hours later in an inbox.', color: '#5ee7ff' },
  { id: 'qualify', n: '02', label: 'Qualify', title: 'Ask the useful questions', copy: 'Property, move-in window, budget, portfolio type, and urgency are gathered in plain language.', color: '#a78bfa' },
  { id: 'route', n: '03', label: 'Route', title: 'Send the right next step', copy: 'Viewing requests, landlord leads, resident issues, and edge cases take different paths.', color: '#f0abfc' },
  { id: 'handoff', n: '04', label: 'Handoff', title: 'Give the team a clean brief', copy: 'A structured summary makes the human follow-up faster and keeps context from getting lost.', color: '#7dd3fc' },
]

const examples = [
  { tag: 'PROSPECTIVE RENTER', title: '“Is the two-bed still available?”', copy: 'Confirm approved listing details, ask when they want to move, then offer a viewing route—without pretending to know what has not been connected.', tone: 'cyan' },
  { tag: 'LANDLORD ENQUIRY', title: '“Can you manage my portfolio?”', copy: 'Capture property count, location, service needs, and timing so a portfolio conversation arrives with useful context.', tone: 'purple' },
  { tag: 'RESIDENT QUESTION', title: '“How do I report a repair?”', copy: 'Point residents to the approved process, collect the essentials, and flag urgent or sensitive matters for the team.', tone: 'blue' },
]

const faqs = [
  ['Is this a live property-management integration?', 'No. This page describes a proposed workflow and the interactive journey is a labelled simulation. It does not claim a live property feed, inbox, CRM, calendar, or maintenance system connection.'],
  ['What does the free 3-point enquiry audit include?', 'We review three moments where property enquiries can lose momentum: first response, qualification, and handoff. You receive practical observations and a suggested pilot scope—without a commitment to build.'],
  ['Can the workflow use our approved property information?', 'Yes, in a scoped implementation. We would first agree the source of truth, escalation rules, tone, and information that must never be guessed.'],
  ['Will it replace property managers or letting teams?', 'No. The aim is to reduce repetitive admin and make handoffs clearer. Your team keeps control of exceptions, sensitive issues, decisions, and relationship-led conversations.'],
  ['How does pricing work?', 'Pricing depends on the enquiry paths, channels, knowledge sources, and handoff requirements. The audit is the right starting point; the pricing page explains the broader engagement model.'],
]

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={{ opacity: 0, y: reduce ? 0 : 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ duration: reduce ? 0.01 : 0.65, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function SystemScene({ active }: { active: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const reduced = useReducedMotion()
  const [fallback, setFallback] = useState(false)
  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const small = window.matchMedia('(max-width:760px)').matches
    const low = window.matchMedia('(prefers-reduced-motion: reduce)').matches || reduced
    if (small || low || !window.WebGLRenderingContext) { setFallback(true); return }

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2('#080a12', 0.065)
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 1.5, 9)
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const group = new THREE.Group()
    scene.add(group)
    scene.add(new THREE.AmbientLight('#b9d4ff', 1.2))
    const cyanLight = new THREE.PointLight('#4ee9ff', 11, 14)
    cyanLight.position.set(-4, 2, 3)
    scene.add(cyanLight)
    const purpleLight = new THREE.PointLight('#9d6cff', 9, 13)
    purpleLight.position.set(4, -1, 3)
    scene.add(purpleLight)

    const nodes: THREE.Mesh[] = []
    const nodeGeo = new THREE.SphereGeometry(0.22, 24, 24)
    const ringGeo = new THREE.TorusGeometry(0.39, 0.012, 8, 32)
    stages.forEach((stage, index) => {
      const node = new THREE.Mesh(nodeGeo, new THREE.MeshStandardMaterial({ color: stage.color, emissive: stage.color, emissiveIntensity: 1.8, roughness: 0.26, metalness: 0.35 }))
      node.position.set((index - 1.5) * 1.75, Math.sin(index * 1.2) * 0.42, index % 2 ? -0.35 : 0.25)
      group.add(node)
      nodes.push(node)
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: stage.color, transparent: true, opacity: 0.6 }))
      ring.rotation.x = Math.PI / 2
      ring.position.copy(node.position)
      group.add(ring)
    })

    const lineGeo = new THREE.BufferGeometry().setFromPoints(nodes.map((node) => node.position.clone()))
    const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: '#5c6d96', transparent: true, opacity: 0.62 }))
    group.add(line)
    const particleGeo = new THREE.SphereGeometry(0.055, 10, 10)
    const particles = Array.from({ length: 18 }, (_, index) => {
      const particle = new THREE.Mesh(particleGeo, new THREE.MeshBasicMaterial({ color: index % 2 ? '#a78bfa' : '#5ee7ff' }))
      group.add(particle)
      return particle
    })

    let frame = 0
    let scrollProgress = 0
    const onScroll = () => { scrollProgress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight))) }
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false)
      camera.aspect = rect.width / Math.max(1, rect.height)
      camera.updateProjectionMatrix()
    }
    let lastRender = 0
    let hidden = document.visibilityState === 'hidden'
    let visible = true
    const onVisibility = () => { hidden = document.visibilityState === 'hidden' }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0.01 })
    observer.observe(canvas)
    const render = (time: number) => {
      if (hidden || !visible) { frame = window.requestAnimationFrame(render); return }
      if (time - lastRender < 33) { frame = window.requestAnimationFrame(render); return }
      lastRender = time
      const tick = time * 0.00055
      group.rotation.y = Math.sin(tick * 0.8) * 0.12 + (scrollProgress - 0.5) * 0.34
      group.rotation.x = Math.cos(tick * 0.55) * 0.045 + scrollProgress * 0.12
      camera.position.y += (1.45 + scrollProgress * 0.9 - camera.position.y) * 0.035
      nodes.forEach((node, index) => node.scale.setScalar(index === activeRef.current ? 1 + Math.sin(tick * 7) * 0.16 : 1))
      particles.forEach((particle, index) => {
        const progress = (tick * (0.28 + (index % 3) * 0.06) + index / particles.length) % 1
        const fromIndex = Math.min(3, Math.floor(progress * 4))
        const from = nodes[fromIndex].position
        const to = nodes[Math.min(3, fromIndex + 1)]?.position || from
        particle.position.lerpVectors(from, to, (progress * 4) % 1)
        particle.position.y += Math.sin(tick * 6 + index) * 0.05
      })
      renderer.render(scene, camera)
      frame = window.requestAnimationFrame(render)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', resize)
    resize()
    onScroll()
    frame = window.requestAnimationFrame(render)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      renderer.dispose()
      nodeGeo.dispose()
      ringGeo.dispose()
      particleGeo.dispose()
      lineGeo.dispose()
      ;(line.material as THREE.Material).dispose()
      nodes.forEach((node) => (node.material as THREE.Material).dispose())
      group.clear()
    }
  }, [reduced])

  return <div role="img" aria-label="Illustration of an enquiry moving from capture through qualification and routing to a team handoff" className={'pm-scene ' + (fallback ? 'pm-scene-fallback' : '')}>
    <canvas ref={ref} aria-hidden="true" />
    {fallback && <div className="pm-fallback" aria-hidden="true"><i /><i /><i /><i /></div>}
    <div className="pm-scene-caption"><span className="pm-live-dot" />{fallback ? 'Accessible journey map' : 'Scroll-linked journey simulation'}<span className="pm-scene-note">Example only</span></div>
  </div>
}

function ButtonPair() {
  return <div className="pm-actions"><a className="pm-btn pm-primary" href={AUDIT_EMAIL}>Get a free 3-point enquiry audit <ArrowUpRight size={16} /></a><a className="pm-btn pm-quiet" href={CALENDLY} target="_blank" rel="noreferrer">See if it fits your workflow <ArrowUpRight size={16} /></a></div>
}

export function PropertyManagementContent(_props: { niche: Niche; otherNiches: Niche[] }) {
  const [active, setActive] = useState(0)
  const current = stages[active]

  return <div className="pm-page"><Navbar /><main>
    <section className="pm-hero" aria-labelledby="pm-hero-title"><div className="pm-grid" aria-hidden="true" /><Reveal className="pm-hero-copy"><div className="pm-kicker"><span />PROPERTY MANAGEMENT / ENQUIRY OPERATIONS</div><h1 id="pm-hero-title">Respond to property enquiries <em>before the opportunity goes cold.</em></h1><p className="pm-lede">Help your team answer routine questions, capture viewing and landlord enquiries, qualify next steps, and route serious prospects—without adding another admin queue.</p><ButtonPair /><p className="pm-micro"><ShieldCheck size={14} /> No invented integrations. No pressure. A practical review of your current enquiry path.</p></Reveal><div className="pm-hero-visual"><SystemScene active={active} /></div><a className="pm-scroll" href="#problem">Scroll to see the handoff <ArrowDownRight size={15} /></a></section>

    <section id="problem" className="pm-section pm-problem" aria-labelledby="problem-title"><Reveal className="pm-intro"><p className="pm-overline">THE MOMENT THAT MATTERS</p><h2 id="problem-title">A missed reply is rarely just a missed reply.</h2></Reveal><Reveal className="pm-problem-copy" delay={0.08}><p>It can be a viewing that never gets booked, a landlord who never hears back, or a resident question that becomes a repeated interruption.</p><p className="pm-muted">The opportunity is not to automate every conversation. It is to make the first useful response dependable—and make the human handoff clear.</p></Reveal><div className="pm-signal-grid">{[[Gauge, 'Reply while intent is fresh', 'Give routine questions a fast, approved answer and create a clear next step.'], [Sparkles, 'Ask before you route', 'Collect only the details the next person needs to act—not a longer form for its own sake.'], [CircleHelp, 'Keep context attached', 'Turn a loose message into a useful summary your team can pick up with confidence.']].map(([Icon, title, copy], index) => { const SignalIcon = Icon as typeof Gauge; return <Reveal key={title as string} delay={index * 0.06}><div className="pm-signal"><span className="pm-signal-index">0{index + 1} / {['FIRST RESPONSE', 'QUALIFICATION', 'HANDOFF'][index]}</span><SignalIcon size={22} /><h3>{title as string}</h3><p>{copy as string}</p></div></Reveal> })}</div></section>

    <section className="pm-section pm-workflow" aria-labelledby="workflow-title"><Reveal className="pm-intro"><p className="pm-overline">THE OPERATING MODEL</p><h2 id="workflow-title">A calmer path from message to next step.</h2><p className="pm-muted pm-width">Designed around your approved answers, escalation rules, and the moments where property teams need judgement.</p></Reveal><div className="pm-workflow-list">{stages.map((stage, index) => <Reveal key={stage.id} delay={index * 0.05}><button className={'pm-workflow-row ' + (active === index ? 'is-active' : '')} onClick={() => setActive(index)} aria-pressed={active === index}><span className="pm-stage-index">{stage.n}</span><span className="pm-stage-label">{stage.label}</span><span className="pm-stage-copy"><strong>{stage.title}</strong><span>{stage.copy}</span></span><ArrowUpRight size={18} /></button></Reveal>)}</div></section>

    <section className="pm-section pm-journey" aria-labelledby="journey-title"><div className="pm-journey-head"><Reveal><p className="pm-overline">INTERACTIVE ENQUIRY JOURNEY</p><h2 id="journey-title">Watch the handoff take shape.</h2></Reveal><Reveal><p className="pm-journey-description">Select a stage or scroll. The spatial scene is a visual simulation of how an enquiry can move through a defined workflow.</p></Reveal></div><div className="pm-journey-layout"><div className="pm-journey-tabs" role="tablist" aria-label="Enquiry journey stages">{stages.map((stage, index) => <button key={stage.id} role="tab" aria-selected={active === index} className={'pm-journey-tab ' + (active === index ? 'is-active' : '')} onClick={() => setActive(index)}><span>{stage.n}</span><strong>{stage.label}</strong><small>{stage.title}</small><i style={{ background: active === index ? stage.color : undefined }} /></button>)}</div><div className="pm-detail" aria-live="polite"><span style={{ color: current.color }}>{current.label} / {current.n}</span><h3>{current.title}</h3><p>{current.copy}</p><small>SIMULATION • NOT A LIVE INTEGRATION</small></div><SystemScene active={active} /></div></section>

    <section className="pm-section pm-examples" aria-labelledby="examples-title"><Reveal className="pm-intro"><p className="pm-overline">PROPERTY-SPECIFIC EXAMPLES</p><h2 id="examples-title">Useful beats impressive.</h2><p className="pm-muted pm-width">Three familiar enquiry patterns. Each is an example of a possible workflow, not a promised production result.</p></Reveal><div className="pm-example-grid">{examples.map((example, index) => <Reveal key={example.tag} delay={index * 0.07}><article className={'pm-example ' + example.tone}><span>{example.tag}</span><h3>{example.title}</h3><p>{example.copy}</p><footer>Example path <ArrowUpRight size={15} /></footer></article></Reveal>)}</div></section>

    <section className="pm-pilot" aria-labelledby="pilot-title"><div className="pm-pilot-glow" /><Reveal><p className="pm-overline">THE FIRST STEP</p><h2 id="pilot-title">Start with one enquiry path. Learn before you scale.</h2><p>We map one high-value route—often prospective renter, landlord, or resident triage—then define the content, rules, and human handoff needed for a responsible pilot.</p><a className="pm-btn pm-primary" href={AUDIT_EMAIL}>Request the free audit <Mail size={16} /></a></Reveal><Reveal><div className="pm-pilot-list"><div><Check size={16} />One focused enquiry path</div><div><Check size={16} />Three practical friction points</div><div><Check size={16} />Clear next-step recommendation</div><small>Scope is agreed before any build or integration work.</small></div></Reveal></section>

    <section className="pm-section pm-pricing" aria-labelledby="pricing-title"><Reveal><p className="pm-overline">A CLEARER COMMERCIAL PATH</p><h2 id="pricing-title">Understand the workflow first. Price the right build second.</h2><p className="pm-muted pm-pricing-copy">Property teams have different portfolios, channels, and escalation needs. The audit helps us avoid selling a generic package before we know what the work actually involves.</p><Link className="pm-link" href="/pricing">Explore the engagement model <ArrowUpRight size={16} /></Link></Reveal><div className="pm-price-note"><span>STARTING POINT</span><strong>Free 3-point enquiry audit</strong><p>Editable email request or a Calendly conversation—your choice.</p><a href={CALENDLY} target="_blank" rel="noreferrer">Book a conversation <ArrowUpRight size={15} /></a></div></section>

    <section className="pm-section pm-faq" aria-labelledby="faq-title"><Reveal className="pm-intro"><p className="pm-overline">QUESTIONS, ANSWERED</p><h2 id="faq-title">Responsible by design.</h2></Reveal><div className="pm-faq-list">{faqs.map(([question, answer]) => <Reveal key={question}><details><summary>{question}<ChevronDown size={17} /></summary><p>{answer}</p></details></Reveal>)}</div></section>

    <section className="pm-final" aria-labelledby="final-title"><Reveal><p className="pm-overline">MAKE THE NEXT ENQUIRY EASIER</p><h2 id="final-title">Give good prospects a better first response.</h2><p>Bring one enquiry path. We’ll help you see where momentum is lost and what a practical pilot could look like.</p><ButtonPair /></Reveal></section>
    <footer className="pm-footer"><Link href="/"><img src="/starlight-logo.png" alt="Starlight AI" /></Link><span>© 2026 Starlight AI</span><div><Link href="/solutions">Solutions</Link><Link href="/pricing">Pricing</Link><Link href="/privacy">Privacy</Link><a href="mailto:hello@starlightai.site">Email</a></div></footer>
  </main>
  <style jsx>{`
    .pm-page{--bg:#080a12;--panel:#101321;--line:rgba(189,207,255,.14);--muted:#8e96aa;--cyan:#5ee7ff;--purple:#a78bfa;min-height:100vh;color:#eef2ff;background:radial-gradient(circle at 75% 4%,rgba(64,54,133,.18),transparent 30rem),var(--bg);overflow:hidden}.pm-kicker,.pm-overline,.pm-signal-index,.pm-example>span,.pm-price-note>span{font:10px/1.2 var(--font-mono);letter-spacing:.16em;color:#8994ad}.pm-hero{position:relative;min-height:calc(100svh - 1px);display:grid;grid-template-columns:minmax(0,1.06fr) minmax(360px,.94fr);align-items:center;gap:clamp(32px,6vw,110px);padding:150px max(24px,7vw) 72px;border-bottom:1px solid var(--line)}.pm-grid{position:absolute;inset:0;opacity:.32;pointer-events:none;background-image:linear-gradient(rgba(129,150,215,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(129,150,215,.08) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,black,transparent 82%)}.pm-hero-copy,.pm-hero-visual{position:relative;z-index:1}.pm-kicker{display:flex;gap:10px;align-items:center;margin-bottom:28px}.pm-kicker span,.pm-live-dot{width:7px;height:7px;border-radius:50%;background:var(--cyan);box-shadow:0 0 16px var(--cyan)}.pm-hero h1{max-width:820px;margin:0;font-size:clamp(3.5rem,7.7vw,8.5rem);font-weight:450;letter-spacing:-.09em;line-height:.88}.pm-hero h1 em{color:var(--cyan);font-style:normal}.pm-lede{max-width:570px;margin:30px 0 0;color:#b5bdd1;font-size:clamp(1rem,1.5vw,1.24rem);line-height:1.58}.pm-actions{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:32px}.pm-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:48px;border:1px solid transparent;border-radius:999px;padding:13px 19px;font-size:13px;font-weight:650;transition:transform .25s ease,border-color .25s ease,background .25s ease}.pm-btn:hover{transform:translateY(-2px)}.pm-btn:focus-visible,.pm-workflow-row:focus-visible,.pm-journey-tab:focus-visible,.pm-faq details summary:focus-visible,.pm-link:focus-visible{outline:2px solid var(--cyan);outline-offset:4px}.pm-primary{color:#041017;background:linear-gradient(110deg,#75efff,#b9a6ff);box-shadow:0 14px 44px rgba(80,211,255,.16)}.pm-quiet{color:#e6e9f5;border-color:var(--line);background:rgba(255,255,255,.035)}.pm-quiet:hover{background:rgba(255,255,255,.08)}.pm-micro{display:flex;align-items:center;gap:8px;margin-top:17px;color:#788298;font-size:11px}.pm-scroll{position:absolute;bottom:26px;left:max(24px,7vw);display:inline-flex;align-items:center;gap:8px;color:#7f8aa3;font:10px var(--font-mono);letter-spacing:.08em}.pm-scene{position:relative;min-height:450px;height:clamp(450px,58vw,650px);border:1px solid var(--line);border-radius:28px;overflow:hidden;background:radial-gradient(circle at 50% 45%,rgba(64,97,178,.2),transparent 55%),linear-gradient(145deg,rgba(22,28,51,.9),rgba(8,10,18,.4));box-shadow:inset 0 0 80px rgba(110,122,255,.08),0 30px 100px rgba(0,0,0,.25)}.pm-scene canvas{width:100%;height:100%;display:block}.pm-scene:before,.pm-scene:after{position:absolute;inset:12%;border:1px solid rgba(138,161,222,.12);border-radius:50%;transform:rotate(-22deg) scaleY(.42);content:'';pointer-events:none}.pm-scene:after{inset:20%;transform:rotate(26deg) scaleY(.3);opacity:.7}.pm-scene-caption{position:absolute;left:20px;right:20px;bottom:18px;display:flex;gap:9px;align-items:center;color:#9ea9c0;font:10px var(--font-mono);letter-spacing:.08em}.pm-scene-note{margin-left:auto;color:#69738a}.pm-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:clamp(22px,5vw,48px)}.pm-fallback:before{position:absolute;width:74%;height:32%;border:1px solid rgba(94,231,255,.28);border-radius:50%;transform:rotate(-14deg);content:''}.pm-fallback i{width:16px;height:16px;border-radius:50%;background:var(--cyan);box-shadow:0 0 24px currentColor}.pm-fallback i:nth-child(2){background:#a78bfa}.pm-fallback i:nth-child(3){background:#f0abfc}.pm-fallback i:nth-child(4){background:#7dd3fc}.pm-section{max-width:1240px;margin:auto;padding:clamp(100px,13vw,180px) max(24px,6vw)}.pm-intro{display:flex;justify-content:space-between;gap:48px;align-items:end}.pm-section h2,.pm-pilot h2,.pm-final h2{max-width:800px;margin:18px 0 0;font-size:clamp(2.8rem,6vw,6.8rem);font-weight:450;letter-spacing:-.085em;line-height:.9}.pm-muted{color:var(--muted);line-height:1.65}.pm-width{max-width:320px}.pm-problem{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(260px,.92fr);gap:0 7vw}.pm-problem-copy{align-self:end;color:#ccd3e5;font-size:18px;line-height:1.55}.pm-problem-copy p{margin:0 0 18px}.pm-problem-copy .pm-muted{font-size:14px}.pm-signal-grid{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:76px}.pm-signal,.pm-example{min-height:220px;border:1px solid var(--line);border-radius:18px;padding:24px;background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.015))}.pm-signal svg{margin-top:48px;color:var(--cyan)}.pm-signal h3{margin:16px 0 8px;font-size:21px;font-weight:500;letter-spacing:-.04em}.pm-signal p,.pm-example p{color:var(--muted);font-size:14px;line-height:1.6}.pm-workflow{border-top:1px solid var(--line)}.pm-workflow-list{margin-top:72px;border-top:1px solid var(--line)}.pm-workflow-row{width:100%;display:grid;grid-template-columns:50px 130px 1fr 20px;align-items:center;gap:16px;text-align:left;padding:24px 0;color:inherit;border:0;border-bottom:1px solid var(--line);background:transparent;cursor:pointer;transition:padding .3s ease,background .3s ease}.pm-workflow-row:hover,.pm-workflow-row.is-active{padding-left:14px;padding-right:14px;background:rgba(255,255,255,.035)}.pm-stage-index,.pm-stage-label{color:#66718a;font:10px var(--font-mono);letter-spacing:.12em}.pm-stage-copy{display:flex;flex-direction:column;gap:7px}.pm-stage-copy strong{font-size:22px;font-weight:500;letter-spacing:-.04em}.pm-stage-copy span{color:var(--muted);font-size:14px;line-height:1.5}.pm-workflow-row svg{color:var(--cyan)}.pm-journey{max-width:none;background:linear-gradient(145deg,rgba(59,44,114,.15),rgba(8,10,18,0) 55%)}.pm-journey-head,.pm-journey-layout{max-width:1120px;margin:0 auto}.pm-journey-head{display:flex;justify-content:space-between;gap:60px;align-items:end}.pm-journey-description{max-width:340px;margin:0;color:var(--muted);line-height:1.6;font-size:14px}.pm-journey-layout{display:grid;grid-template-columns:190px minmax(190px,.7fr) minmax(360px,1.3fr);gap:24px;align-items:stretch;margin-top:72px}.pm-journey-tabs{display:flex;flex-direction:column;gap:4px}.pm-journey-tab{position:relative;display:flex;gap:12px;align-items:flex-start;width:100%;border:1px solid transparent;border-radius:10px;padding:14px 10px;text-align:left;color:#758098;background:transparent;cursor:pointer}.pm-journey-tab:hover,.pm-journey-tab.is-active{border-color:var(--line);background:rgba(255,255,255,.045);color:#e9ecf7}.pm-journey-tab strong,.pm-journey-tab small{display:block}.pm-journey-tab strong{font-size:13px}.pm-journey-tab small{margin-top:5px;color:#77839b;font-size:11px;line-height:1.4}.pm-journey-tab>span{font:10px var(--font-mono);color:#69748b}.pm-journey-tab i{position:absolute;top:8px;right:8px;width:3px;height:calc(100% - 16px);border-radius:4px}.pm-detail{align-self:center;padding:20px 6px}.pm-detail>span{font:10px var(--font-mono);letter-spacing:.15em}.pm-detail h3{margin:18px 0 12px;font-size:clamp(1.8rem,3vw,3rem);font-weight:500;letter-spacing:-.06em}.pm-detail p{max-width:320px;color:var(--muted);font-size:14px;line-height:1.65}.pm-detail small{display:inline-block;margin-top:28px;color:#68738b;font:10px var(--font-mono);letter-spacing:.16em}.pm-journey-layout>.pm-scene{min-height:410px;height:100%}.pm-examples{border-top:1px solid var(--line)}.pm-example-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:72px}.pm-example{position:relative;min-height:300px;overflow:hidden}.pm-example:before{position:absolute;top:0;left:24px;width:42px;height:2px;content:'';background:var(--cyan);box-shadow:0 0 25px currentColor}.pm-example.purple:before{background:var(--purple)}.pm-example.blue:before{background:#7dd3fc}.pm-example h3{margin:58px 0 12px;font-size:23px;font-weight:500;letter-spacing:-.05em}.pm-example footer{position:absolute;right:24px;bottom:22px;left:24px;display:flex;justify-content:space-between;color:#6f7a91;font:10px var(--font-mono);letter-spacing:.1em}.pm-pilot{position:relative;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(240px,.85fr);gap:50px;align-items:end;padding:clamp(90px,11vw,150px) max(24px,12vw);overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:#12152a}.pm-pilot-glow{position:absolute;top:-50%;left:35%;width:70vw;height:70vw;pointer-events:none;background:radial-gradient(circle,rgba(100,79,215,.27),transparent 65%)}.pm-pilot>div,.pm-pilot>h2,.pm-pilot>p{position:relative;z-index:1}.pm-pilot p:not(.pm-overline){max-width:650px;color:#b9c1d5;line-height:1.65}.pm-pilot-list{display:grid;gap:15px;padding:22px 0 0 23px;border-left:1px solid rgba(167,139,250,.45)}.pm-pilot-list div{display:flex;align-items:center;gap:10px;font-size:14px}.pm-pilot-list svg{color:var(--cyan)}.pm-pilot-list small{margin-top:20px;color:#758099;font-size:11px;line-height:1.5}.pm-pricing{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(250px,.75fr);gap:8vw;align-items:end;border-bottom:1px solid var(--line)}.pm-pricing-copy{max-width:490px;margin-top:28px}.pm-link{display:inline-flex;align-items:center;gap:8px;margin-top:28px;color:var(--cyan);font-size:14px}.pm-price-note{border:1px solid var(--line);border-radius:18px;padding:24px;background:rgba(255,255,255,.035)}.pm-price-note strong{display:block;margin-top:16px;font-size:21px;letter-spacing:-.04em}.pm-price-note p{color:var(--muted);font-size:13px;line-height:1.5}.pm-price-note a{display:inline-flex;gap:8px;align-items:center;color:var(--cyan);font-size:13px}.pm-faq{display:grid;grid-template-columns:minmax(250px,.8fr) minmax(0,1.2fr);gap:8vw}.pm-faq-list{border-top:1px solid var(--line)}.pm-faq details{border-bottom:1px solid var(--line)}.pm-faq summary{display:flex;justify-content:space-between;align-items:center;gap:24px;padding:23px 0;cursor:pointer;list-style:none;font-size:16px;font-weight:500}.pm-faq summary::-webkit-details-marker{display:none}.pm-faq details[open] summary svg{transform:rotate(180deg)}.pm-faq summary svg{color:var(--cyan);transition:transform .2s}.pm-faq details p{max-width:620px;margin:0 35px 23px 0;color:var(--muted);font-size:14px;line-height:1.65}.pm-final{position:relative;padding:clamp(100px,14vw,190px) max(24px,7vw);text-align:center;overflow:hidden;background:radial-gradient(circle at 50% 80%,rgba(34,108,166,.25),transparent 48%),linear-gradient(155deg,#15132b,#091a24)}.pm-final h2{max-width:800px;margin-left:auto;margin-right:auto}.pm-final>div>p:not(.pm-overline){max-width:490px;margin:25px auto 0;color:#b9c3d5;line-height:1.6}.pm-final .pm-actions{justify-content:center}.pm-footer{display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap;padding:30px max(24px,6vw);color:#778298;font:10px var(--font-mono);letter-spacing:.07em}.pm-footer img{width:auto;height:24px}.pm-footer div{display:flex;flex-wrap:wrap;gap:18px}.pm-footer a:hover{color:#edf0fa}
    @media(max-width:900px){.pm-hero{grid-template-columns:1fr;padding-top:140px}.pm-hero-visual{max-width:650px;width:100%;margin:0 auto}.pm-scene{min-height:390px;height:55vw}.pm-journey-layout{grid-template-columns:160px 1fr}.pm-journey-layout>.pm-scene{grid-column:1/-1;min-height:360px;height:420px}.pm-intro{align-items:start;flex-direction:column;gap:24px}.pm-problem,.pm-pricing,.pm-faq{grid-template-columns:1fr;gap:42px}.pm-pilot{grid-template-columns:1fr;gap:38px}}
    @media(max-width:620px){.pm-hero{min-height:auto;padding:130px 20px 80px}.pm-hero h1{font-size:clamp(3.2rem,15vw,5.3rem)}.pm-lede{font-size:15px}.pm-actions{align-items:stretch;flex-direction:column}.pm-btn{width:100%}.pm-scroll{display:none}.pm-scene{min-height:310px;height:75vw;border-radius:19px}.pm-section{padding:90px 20px}.pm-section h2,.pm-pilot h2,.pm-final h2{font-size:clamp(2.8rem,14vw,4.3rem)}.pm-signal-grid,.pm-example-grid{grid-template-columns:1fr;margin-top:48px}.pm-signal{min-height:190px}.pm-signal svg{margin-top:32px}.pm-workflow-list{margin-top:48px}.pm-workflow-row{grid-template-columns:38px 1fr 18px;gap:9px}.pm-stage-label{display:none}.pm-stage-copy strong{font-size:18px}.pm-stage-copy span{font-size:13px}.pm-journey-head,.pm-journey-layout{display:block}.pm-journey-description{margin-top:24px}.pm-journey-layout{margin-top:45px}.pm-journey-tabs{display:grid;grid-template-columns:1fr 1fr;margin-bottom:28px}.pm-journey-tab{padding:11px 8px}.pm-detail{padding:20px 0 35px}.pm-journey-layout>.pm-scene{height:310px;min-height:310px}.pm-example{min-height:260px}.pm-example h3{margin-top:45px;font-size:21px}.pm-faq summary{font-size:15px}.pm-footer{padding:26px 20px}}
    @media(prefers-reduced-motion:reduce){.pm-btn,.pm-workflow-row,.pm-faq summary{transition:none}.pm-btn:hover{transform:none}}
  `}</style></div>
}
