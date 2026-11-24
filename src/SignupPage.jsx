import SignupForm from './components/SignupForm.jsx'
import { startPayment } from './payments.js'

export function PageShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-gutter py-4 sm:py-6">
        <a href="/" className="whitespace-nowrap font-display text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] font-bold text-fg no-underline">
          XantSpace <span className="font-medium text-subtle max-sm:hidden">/ Build With AI</span>
        </a>
        <a href="/" className="inline-flex min-h-11 items-center whitespace-nowrap text-sm text-subtle no-underline hover:text-fg">
          ← Back<span className="max-sm:hidden">&nbsp;to class page</span>
        </a>
      </header>
      <main className="flex flex-1 items-start justify-center px-gutter pb-12 pt-2 sm:items-center sm:pb-16 sm:pt-4">
        {children}
      </main>
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
