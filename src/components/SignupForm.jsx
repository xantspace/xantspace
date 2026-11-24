import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { Spinner, SuccessCheck } from './ui.jsx'
import { HOP, HOP_TRANSITION, SPRING_ENTER, SPRING_POP, SPRING_PRESS, SPRING_WOBBLE, pressable } from '../springs.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Enter your full name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.'
  const digits = v.phone.replace(/[^\d]/g, '')
  if (digits.length < 10 || digits.length > 14) e.phone = 'Enter your WhatsApp number, e.g. 0803 123 4567.'
  return e
}

// Shown when the label sits inside the empty, unfocused field
const LABEL_RESTING =
  'peer-[:placeholder-shown:not(:focus)]:top-1/2 peer-[:placeholder-shown:not(:focus)]:-translate-y-1/2 peer-[:placeholder-shown:not(:focus)]:text-base'

function Field({ id, label, error, delay, ...inputProps }) {
  const errorId = `${id}-error`
  return (
    <div className="animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative">
        <input
          id={id}
          name={id}
          placeholder=" "
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`peer w-full rounded-xl border bg-ink/60 px-4 pb-2 pt-6 text-fg outline-none transition duration-200 focus:ring-4 ${
            error
              ? 'border-danger focus:ring-danger/15'
              : 'border-line hover:border-line-strong focus:border-accent focus:ring-accent/15'
          }`}
          {...inputProps}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 top-2 text-xs transition-all duration-200 ${
            error ? 'text-danger' : 'text-subtle peer-focus:text-accent'
          } ${LABEL_RESTING}`}
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 animate-fade-up text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function Success({ name, payUrl, paying, onPay }) {
  const first = name.trim().split(/\s+/)[0]
  return (
    <motion.div
      key="success"
      role="status"
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={SPRING_POP}
      className="flex flex-col items-center gap-4 py-2 text-center sm:py-6"
    >
      <SuccessCheck />
      <h2 className="m-0 text-title font-bold">You're in, {first}.</h2>
      <p className="m-0 max-w-sm text-muted">
        You're signed up. Pay to lock in your seat.
      </p>
      <motion.a
        href={payUrl}
        onClick={onPay}
        aria-disabled={paying || undefined}
        {...pressable}
        // Hop every 3 seconds to pull the eye; stops while opening Paystack.
        animate={paying ? { y: 0 } : HOP}
        transition={{ ...SPRING_PRESS, y: paying ? { duration: 0.2 } : HOP_TRANSITION }}
        className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-7 py-3 font-semibold text-ink no-underline transition-colors hover:bg-accent-hover"
      >
        {paying ? (
          <>
            <Spinner /> Opening Paystack…
          </>
        ) : (
          <>LOCK IN NOW!</>
        )}
      </motion.a>
      <p className="m-0 max-w-sm text-sm text-subtle">
        Choose how you want to pay on Paystack. Once it goes through, you'll come straight back
        here to join the class group.
      </p>
      <p className="m-0 mt-2 inline-flex items-center gap-1.5 text-xs text-subtle">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Secured by Paystack
      </p>
    </motion.div>
  )
}

/**
 * Animated signup form.
 * `onSubmit(values)` should return a promise resolving to `{ payUrl }` (the Paystack checkout page).
 * Throw an Error to show its message on the form.
 */
export default function SignupForm({ onSubmit }) {
  const [values, setValues] = useState({ name: '', email: '', phone: '' })
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | done
  const [formError, setFormError] = useState('')
  const [payUrl, setPayUrl] = useState('')
  const [paying, setPaying] = useState(false)
  const [card, animateCard] = useAnimate()

  // Coming back from Paystack with the browser's Back button restores this page from cache.
  useEffect(() => {
    const reset = (e) => e.persisted && setPaying(false)
    window.addEventListener('pageshow', reset)
    return () => window.removeEventListener('pageshow', reset)
  }, [])

  const errors = validate(values)
  const shownError = (key) => (touched[key] ? errors[key] : undefined)

  const update = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  const blur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }))

  // Knock the card sideways, then let a loose spring wobble it back to centre.
  async function wobble() {
    await animateCard(card.current, { x: -16 }, { duration: 0.06 })
    animateCard(card.current, { x: 0 }, SPRING_WOBBLE)
  }

  // Squash the card, then spring it back with a little overshoot.
  async function squish(amount = 0.96) {
    await animateCard(card.current, { scale: amount }, { duration: 0.1 })
    animateCard(card.current, { scale: 1 }, SPRING_POP)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setTouched({ name: true, email: true, phone: true })
    if (Object.keys(errors).length) {
      wobble()
      const first = ['name', 'email', 'phone'].find((k) => errors[k])
      document.getElementById(first)?.focus()
      return
    }
    squish(0.97)
    setStatus('submitting')
    try {
      const result = await onSubmit(values)
      setPayUrl(result.payUrl)
      setStatus('done')
      squish(0.94)
    } catch (err) {
      setFormError(err?.message || 'Something went wrong. Please try again.')
      setStatus('idle')
      wobble()
    }
  }

  function handlePay(e) {
    // Let ctrl/cmd/middle-click open Paystack in a new tab as usual.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (paying) return
    setPaying(true)
    squish(0.93)
    // Give the spring a moment to play before leaving the page.
    setTimeout(() => window.location.assign(payUrl), 450)
  }

  const submitting = status === 'submitting'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={SPRING_ENTER}
      className="w-full max-w-[460px]"
    >
      <div ref={card} className="glow-card p-card sm:p-10">
        <AnimatePresence mode="wait" initial={false}>
          {status === 'done' ? (
            <Success key="success" name={values.name} payUrl={payUrl} paying={paying} onPay={handlePay} />
          ) : (
            <motion.div key="form" exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}>
              <div className="mb-6 flex animate-fade-up flex-col gap-2 sm:mb-8">
                <div className="text-sm font-semibold uppercase tracking-[0.08em] text-accent">
                  Build With AI
                </div>
                <h1 className="m-0 text-title font-bold">Reserve your seat</h1>
                <p className="m-0 text-muted">Add your details, then pay to secure your seat.</p>
              </div>

              <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field id="name" label="Full name" autoComplete="name" value={values.name} onChange={update} onBlur={blur} error={shownError('name')} delay={60} />
                <Field id="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={update} onBlur={blur} error={shownError('email')} delay={120} />
                <Field id="phone" label="WhatsApp number" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={update} onBlur={blur} error={shownError('phone')} delay={180} />

                {formError && (
                  <p role="alert" className="m-0 animate-fade-up rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                    {formError}
                  </p>
                )}

                <div className="mt-2 animate-fade-up" style={{ animationDelay: '240ms' }}>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    {...pressable}
                    className="relative min-h-12 w-full overflow-hidden rounded-xl bg-accent px-6 py-3.5 text-base font-semibold sm:py-4 sm:text-lg text-ink transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-80"
                  >
                    {!submitting && (
                      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/4 animate-shine bg-white/45" />
                    )}
                    <span className="relative inline-flex items-center justify-center gap-2">
                      {submitting ? (
                        <>
                          <Spinner /> Saving your details…
                        </>
                      ) : (
                        'Continue'
                      )}
                    </span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
