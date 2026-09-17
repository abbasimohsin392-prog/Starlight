'use client'

import { useState } from 'react'

const CALENDLY = 'https://calendly.com/starlightai306/30min'
const INVOICE_EMAIL = 'mailto:hello@starlightai.site?subject=Request%20payment%20instructions'

const routes = [
  {
    number: '01',
    title: 'USD bank transfer',
    label: 'For invoices settled from a bank',
    body: 'Starlight AI can receive international payments into its USD bank account. We keep beneficiary and routing details off the public site and provide the confirmed instructions on your latest invoice.',
    note: 'Receiving funds from international banks is subject to originating and correspondent bank rules.',
  },
  {
    number: '02',
    title: 'Secure card link',
    label: 'For a hosted card checkout',
    body: 'Request a secure card payment link for the invoice. The card provider is confirmed per setup and invoice; Starlight never collects card details directly on this website.',
    note: 'A payment link is only issued after the invoice amount and currency are confirmed.',
  },
  {
    number: '03',
    title: 'Crypto invoice',
    label: 'For supported digital assets',
    body: 'Crypto can be arranged by invoice for USDC, USDT, SOL, BTC, and other industry-used assets where agreed. The exact asset and network must be confirmed before you send anything.',
    note: 'Support depends on the confirmed asset, network, and successful reconciliation.',
  },
]

const faqs = [
  ['Can international clients pay by bank transfer?', 'Yes. We can issue an invoice for a USD bank transfer. Your invoice contains the current protected beneficiary instructions; availability and timing depend on originating and correspondent bank rules.'],
  ['How do I pay by card?', 'Request payment instructions and we will confirm the invoice details and, when available for your setup, provide a secure hosted card payment link. Do not send card details by email or enter them on this page.'],
  ['How are crypto payments confirmed or refunded?', 'We confirm the exact asset, network, amount, and payment reference on the invoice. A crypto payment is reconciled after the required network confirmation. Refunds, when appropriate, are reviewed against the invoice and the original asset/network; never send a different asset or network without written confirmation.'],
  ['Will I receive a receipt?', 'Yes. Once the payment is matched to the invoice and reconciled, we can provide a receipt or payment confirmation for your records.'],
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass-card payment-faq-item">
      <button
        type="button"
        className="faq-q"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{question}</span>
        <span aria-hidden="true" style={{ transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && <p className="faq-a">{answer}</p>}
    </div>
  )
}

export default function PaymentPage() {
  return (
    <main className="payment-page">
      <style>{
        '.payment-page { min-height: 100vh; background: radial-gradient(circle at 80% 10%, rgba(168,85,247,.14), transparent 32rem), var(--background); }' +
        '.payment-page .nav { gap: 24px; }' +
        '.payment-page .nav-links { flex-wrap: wrap; justify-content: center; }' +
        '.payment-page .payment-section { max-width: 1200px; margin: 0 auto; padding: 148px max(24px, 5vw) 100px; }' +
        '.payment-kicker { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 24px; color: var(--cyan); font: 10px var(--font-mono); letter-spacing: .16em; }' +
        '.payment-kicker:before { display: block; width: 26px; height: 1px; background: var(--cyan); content: ""; }' +
        '.payment-hero h1 { max-width: 800px; margin: 0; font-size: clamp(3rem, 7vw, 6.8rem); font-weight: 450; letter-spacing: -.08em; line-height: .92; }' +
        '.payment-hero h1 em { color: var(--cyan); font-style: normal; }' +
        '.payment-lede { max-width: 650px; margin: 28px 0 0; color: var(--muted); font-size: 17px; line-height: 1.65; }' +
        '.payment-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 32px; }' +
        '.payment-actions a { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; border-radius: 999px; padding: 13px 22px; font-size: 14px; font-weight: 600; }' +
        '.payment-actions .primary { background: linear-gradient(135deg, var(--purple), var(--cyan)); color: #fff; }' +
        '.payment-actions .secondary { border: 1px solid var(--line); color: var(--foreground); }' +
        '.payment-actions a:focus-visible, .payment-faq-item button:focus-visible { outline: 2px solid var(--cyan); outline-offset: 4px; }' +
        '.invoice-note { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: start; max-width: 790px; margin-top: 56px; padding: 18px 20px; border: 1px solid rgba(6,182,212,.24); border-radius: 16px; background: rgba(6,182,212,.06); color: var(--muted); font-size: 13px; line-height: 1.55; }' +
        '.invoice-note strong { color: var(--foreground); }' +
        '.invoice-note-mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 999px; background: rgba(6,182,212,.16); color: var(--cyan); font-weight: 700; }' +
        '.payment-section-heading { margin: 0 0 28px; font-size: clamp(2.2rem, 4.5vw, 4.2rem); font-weight: 450; letter-spacing: -.07em; line-height: .98; }' +
        '.payment-section-heading em { color: var(--cyan); font-style: normal; }' +
        '.payment-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }' +
        '.payment-card { display: flex; flex-direction: column; min-height: 350px; padding: 28px 24px; }' +
        '.payment-card .payment-number { display: inline-grid; place-items: center; width: 34px; height: 34px; margin-bottom: 36px; border: 1px solid rgba(6,182,212,.35); border-radius: 999px; color: var(--cyan); font: 11px var(--font-mono); }' +
        '.payment-card h3 { margin: 0 0 8px; font-size: 22px; font-weight: 500; letter-spacing: -.04em; }' +
        '.payment-card .payment-label { margin: 0 0 18px; color: var(--cyan); font: 10px var(--font-mono); letter-spacing: .1em; text-transform: uppercase; }' +
        '.payment-card p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.65; }' +
        '.payment-card .payment-note { margin-top: auto; padding-top: 22px; color: #b9b9c1; font-size: 12px; line-height: 1.5; }' +
        '.payment-safety { display: grid; grid-template-columns: .8fr 1.2fr; gap: 50px; align-items: start; padding: 84px 0 0; }' +
        '.payment-safety-copy { color: var(--muted); font-size: 15px; line-height: 1.65; }' +
        '.payment-safety-list { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }' +
        '.payment-safety-list li { display: flex; gap: 12px; align-items: flex-start; padding: 16px 0; border-top: 1px solid var(--line); color: var(--muted); font-size: 14px; line-height: 1.55; }' +
        '.payment-safety-list li:last-child { border-bottom: 1px solid var(--line); }' +
        '.payment-safety-list span { flex: 0 0 auto; color: var(--cyan); font: 11px var(--font-mono); }' +
        '.payment-faq { padding-top: 105px; }' +
        '.payment-faq-list { display: grid; gap: 10px; max-width: 820px; }' +
        '.payment-faq-item { overflow: hidden; }' +
        '.payment-faq-item .faq-q { gap: 20px; padding: 20px 24px; }' +
        '.payment-faq-item .faq-q span:last-child { flex: 0 0 auto; transition: transform .25s ease; }' +
        '.payment-faq-item .faq-a { margin: 0; padding: 0 24px 22px; }' +
        '.payment-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 18px; padding: 26px max(24px, 5vw) 32px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; }' +
        '.payment-footer a { color: var(--foreground); }' +
        '@media (max-width: 820px) { .payment-page .nav { position: absolute; width: calc(100% - 32px); align-items: flex-start; } .payment-page .nav-links { display: none; } .payment-page .payment-section { padding-top: 132px; } .payment-grid, .payment-safety { grid-template-columns: 1fr; } .payment-safety { gap: 26px; padding-top: 70px; } }' +
        '@media (max-width: 520px) { .payment-page .nav { padding: 10px 12px; } .payment-page .nav img { height: 46px !important; } .payment-page .nav > a:last-child { padding: 10px 14px !important; font-size: 12px !important; } .payment-page .payment-section { padding-right: 18px; padding-left: 18px; } .payment-hero h1 { font-size: clamp(2.8rem, 14vw, 4.4rem); } .payment-lede { font-size: 15px; } .payment-actions { flex-direction: column; align-items: stretch; } .payment-actions a { width: 100%; } .payment-card { min-height: 0; } }' +
        '@media (prefers-reduced-motion: reduce) { .payment-page *, .payment-page *:before, .payment-page *:after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }'
      }</style>

      <nav className="nav nav-scrolled" aria-label="Primary navigation">
        <a href="/" className="logo" aria-label="Starlight AI home" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/starlight-logo-256.png" alt="Starlight AI" style={{ height: 60, width: 'auto' }} />
        </a>
        <div className="nav-links">
          {[
            ['Home', '/'], ['Services', '/services'], ['Solutions', '/solutions'], ['Pricing', '/pricing'], ['Payment', '/payment'], ['FAQ', '/#faq'], ['About', '/about'],
          ].map(([label, href]) => <a key={href} href={href} className={label === 'Payment' ? 'active' : ''}>{label}</a>)}
        </div>
        <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="inline-flex primary" style={{ borderRadius: 999, padding: '12px 20px', fontSize: 14 }}>Let&apos;s talk ↗</a>
      </nav>

      <section className="payment-section payment-hero" aria-labelledby="payment-title">
        <span className="payment-kicker">PAYMENT OPTIONS</span>
        <h1 id="payment-title">Choose the payment route that works <em>for your business.</em></h1>
        <p className="payment-lede">We issue an invoice before payment with the exact amount, currency, payment reference, and instructions for the route you choose. Request the latest invoice details before sending funds.</p>
        <div className="payment-actions">
          <a className="primary" href={INVOICE_EMAIL}>Request payment instructions ↗</a>
          <a className="secondary" href={CALENDLY} target="_blank" rel="noopener noreferrer">Prefer a call? Open Calendly ↗</a>
        </div>
        <div className="invoice-note" role="note">
          <span className="invoice-note-mark" aria-hidden="true">i</span>
          <div><strong>Protected details stay on the invoice.</strong> We do not publish bank account numbers, IBANs, SWIFT/BIC details, beneficiary information, or crypto wallet addresses on this page.</div>
        </div>
      </section>

      <section className="payment-section" aria-labelledby="routes-title" style={{ paddingTop: 0 }}>
        <span className="eyebrow">THREE WAYS TO SETTLE</span>
        <h2 id="routes-title" className="payment-section-heading" style={{ marginTop: 18 }}>Clear instructions, <em>before you pay.</em></h2>
        <div className="payment-grid">
          {routes.map((route) => <article key={route.number} className="glass-card payment-card"><span className="payment-number" aria-hidden="true">{route.number}</span><h3>{route.title}</h3><p className="payment-label">{route.label}</p><p>{route.body}</p><p className="payment-note">{route.note}</p></article>)}
        </div>

        <div className="payment-safety" aria-labelledby="safety-title">
          <div><span className="eyebrow">PAYMENT SAFETY</span><h2 id="safety-title" className="payment-section-heading" style={{ marginTop: 18 }}>Pause. Verify. <em>Then send.</em></h2><p className="payment-safety-copy">Payment fraud often starts with an old invoice, a changed address, or an unverified message. Use the latest invoice and contact us directly if anything looks different.</p></div>
          <ul className="payment-safety-list">
            <li><span>01</span><div>Verify beneficiary and payment details against the latest invoice before making a bank transfer.</div></li>
            <li><span>02</span><div>Never send crypto to an old address. Confirm the exact asset and network before sending.</div></li>
            <li><span>03</span><div>Starlight AI will never ask for a seed phrase or private key.</div></li>
          </ul>
        </div>

        <div className="payment-faq" aria-labelledby="faq-title">
          <span className="eyebrow">FAQ</span><h2 id="faq-title" className="payment-section-heading" style={{ marginTop: 18 }}>A few practical <em>answers.</em></h2>
          <div className="payment-faq-list">{faqs.map(([question, answer]) => <FaqItem key={question} question={question} answer={answer} />)}</div>
        </div>
      </section>

      <footer className="payment-footer"><span>© {new Date().getFullYear()} Starlight AI</span><div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}><a href="/payment" aria-current="page">Payment</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href={INVOICE_EMAIL}>hello@starlightai.site</a></div></footer>
    </main>
  )
}
