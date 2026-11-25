import SignupForm from './components/SignupForm.jsx'
import { Footer } from './components/ui.jsx'
import { startPayment } from './payments.js'

export function PageShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Pinned to the top, same as the landing page header */}
      <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-gutter sm:h-20">
        <a href="/" className="whitespace-nowrap font-display text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] font-bold text-fg no-underline">
          XantSpace <span className="font-medium text-subtle max-sm:hidden">/ Build With AI</span>
        </a>
        <a href="/" className="inline-flex min-h-11 items-center whitespace-nowrap text-sm text-subtle no-underline hover:text-fg">
          ← Back<span className="max-sm:hidden">&nbsp;to class page</span>
        </a>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-gutter pb-12 pt-6 sm:items-center sm:pb-16 sm:pt-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default function SignupPage() {
  return (
    <PageShell>
      <SignupForm onSubmit={startPayment} />
    </PageShell>
  )
}
