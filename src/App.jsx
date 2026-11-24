import { Button, Card, Eyebrow, Section } from './components/ui.jsx'
import HeroVideo from './components/HeroVideo.jsx'
import {
  PRICE,
  SIGNUP_HREF,
  features,
  sessions,
  schedule,
  requirements,
  faqs,
} from './content.js'

// Sizes like text-h2, p-card and px-gutter are fluid: they scale with screen width (see index.css).

function Header() {
  return (
    // Pinned to the top. Its height (h-16 / sm:h-20) is matched by scroll-padding in index.css
    // and by the mini video player's top offset in HeroVideo.jsx; change all three together.
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-gutter sm:h-20">
        <a href="#" className="whitespace-nowrap font-display text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] font-bold text-fg no-underline">
          XantSpace <span className="font-medium text-subtle max-sm:hidden">/ Build With AI</span>
        </a>
        <Button href={SIGNUP_HREF} size="sm" className="shrink-0">
          Pay {PRICE}
        </Button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <Section className="flex flex-wrap items-center gap-8 !pt-6 sm:gap-12 sm:!pt-16">
      <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5 sm:gap-6">
        <Eyebrow>Paid class. 50 seats.</Eyebrow>
        <h1 className="m-0 text-display font-bold leading-[1.05]">This is not a free class.</h1>
        <p className="m-0 max-w-[560px] text-lead text-muted">
          No free webinar that turns into a sales pitch at the end. In 1 week you build a real
          shortlet booking app with AI. Listings, bookings, Paystack payments and dashboards. Live
          on the internet with your own link.
        </p>
        <p className="m-0 text-large">If you're serious, pay and join. If you're not, no wahala.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href={SIGNUP_HREF}>Secure my seat: {PRICE}</Button>
          <Button href="#build" variant="outline">
            See what you'll build
          </Button>
        </div>
      </div>

      <HeroVideo />
    </Section>
  )
}

function WhatYoullBuild() {
  return (
    <Section id="build">
      <h2 className="mb-3 text-h2">What you'll build</h2>
      <p className="mb-6 max-w-[680px] text-large text-muted sm:mb-8">
        A full shortlet booking system. The kind of app you can sell to a shortlet or apartment
        owner when the class ends.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-3 sm:gap-4">
        {features.map((f) => (
          <Card key={f.title} className="p-card-sm">
            <h3 className="mb-2 text-xl">{f.title}</h3>
            <p className="m-0 text-muted">{f.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

function Sessions() {
  return (
    <Section>
      <h2 className="mb-6 text-h2 sm:mb-8">5 live sessions. 1 week.</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-4">
        {sessions.map((s, i) => (
          <div key={s.title} className="flex gap-3 border-t border-line py-4 sm:gap-4 sm:py-5">
            <div className="min-w-9 font-display text-h3 font-bold leading-none text-accent">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div>
              <h3 className="mb-1 text-large">{s.title}</h3>
              <p className="m-0 text-muted">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-subtle">{schedule}</p>
    </Section>
  )
}

function NeedsAndTeacher() {
  return (
    <Section className="flex flex-wrap gap-4 sm:gap-6">
      <Card className="min-w-0 flex-[1_1_360px] p-card">
        <h2 className="mb-4 text-h3">What you need</h2>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-muted">
          {requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Card>
      <Card className="min-w-0 flex-[1_1_360px] p-card">
        <h2 className="mb-4 text-h3">Learn from someone who's done it</h2>
        <p className="mb-3 text-muted">
          I'm <strong className="text-fg">Pleasant Johnson</strong>, a self-taught full-stack developer from
          Abia State. Nobody handed me this. I taught myself, then used AI to build{' '}
          <strong className="text-fg">websites, web apps and management systems</strong> for real
          clients.{' '}
          <strong className="text-fg">And what you'll build in this class is no different.</strong>{' '}
          Not a tutorial project. Not a demo. Real software for a real business.
        </p>
        <p className="mb-3 text-muted">
          I also teach coding to my students, so I know how to make this click, even if you've
          never written a single line of code.
        </p>
        <p className="m-0 text-muted">
          No slides. No theory you'll forget by Monday. You watch me build it live, then you build
          it yourself, right there with me. By session 5, you're not just a student.{' '}
          <strong className="text-fg">You're someone with an app to sell.</strong>
        </p>
      </Card>
    </Section>
  )
}

function Pay() {
  return (
    <Section id="pay">
      <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-accent bg-surface px-card py-[clamp(2rem,7vw,3rem)] text-center">
        <Eyebrow>Course price</Eyebrow>
        <div className="font-display text-price font-bold leading-none">{PRICE}</div>
        <p className="m-0 max-w-[560px] text-large text-muted">
          50 seats. When they're gone, registration closes.
        </p>
        <Button href={SIGNUP_HREF} size="lg">
          SECURE MY SEAT!!
        </Button>
      </div>
    </Section>
  )
}

function Faq() {
  return (
    <Section narrow className="!pb-[clamp(3.5rem,10vw,6rem)]">
      <h2 className="mb-5 text-h2 sm:mb-6">Questions</h2>
      <div className="flex flex-col border-b border-line">
        {faqs.map((f) => (
          <div key={f.q} className="border-t border-line py-4 sm:py-5">
            <h3 className="mb-1.5 text-large">{f.q}</h3>
            <p className="m-0 text-muted">{f.a}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line px-gutter py-8 text-center text-sm text-subtle">
      Build With AI by XantSpace.
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatYoullBuild />
        <Sessions />
        <NeedsAndTeacher />
        <Pay />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
