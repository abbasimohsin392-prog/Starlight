import DemoClientPage from './demo-client'

export default function DemoPage() {
  return (
    <main>
      <section className="section" style={{ paddingTop: 150, paddingBottom: 20 }} aria-labelledby="demo-heading">
        <span className="eyebrow">AI RECEPTIONIST DEMO</span>
        <h1 id="demo-heading">Recover missed calls and book more jobs.</h1>
        <p className="section-intro" style={{ maxWidth: 620, marginTop: 16 }}>Use this interactive demo to estimate the cost of missed enquiries and see how an AI receptionist can capture details, qualify a request, and guide a visitor toward the next step.</p>
      </section>
      <DemoClientPage />
    </main>
  )
}
