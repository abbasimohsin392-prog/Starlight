import { Nav } from '@/components/site/nav'
import { Hero } from '@/components/site/hero'
import { Marquee } from '@/components/site/marquee'
import { Services } from '@/components/site/services'
import { Process } from '@/components/site/process'
import { Stats } from '@/components/site/stats'
import { Systems } from '@/components/site/systems'
import { About } from '@/components/site/about'
import { Contact } from '@/components/site/contact'
import { Footer } from '@/components/site/footer'

export default function HomePage() {
  return (
    <>
      <a
        href="#services"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <Stats />
        <Systems />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

// Rebuild trigger: original look restored
