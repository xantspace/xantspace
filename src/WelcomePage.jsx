import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PageShell } from './SignupPage.jsx'
import { Spinner, SuccessCheck } from './components/ui.jsx'
import { checkPayment, joinUrl } from './payments.js'
import { schedule } from './content.js'
import { HOP, HOP_TRANSITION, SPRING_ENTER, SPRING_POP, SPRING_PRESS, pressable } from './springs.js'

// Paystack statuses that mean "not finished yet" rather than "failed".
const STILL_PROCESSING = new Set(['ongoing', 'pending', 'processing', 'queued'])

const buttonClass =
  'mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3 font-semibold text-ink no-underline transition-colors hover:bg-accent-hover'

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 8 19.5L3 21z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.2-2-1-1 .8a4 4 0 0 1-2.3-2.3l.8-1-1-2L9 9.5z" />
    </svg>
  )
}

function Paid({ name, reference }) {
  const first = name.trim().split(/\s+/)[0]
  return (
    <>
      <SuccessCheck />
      <div className="text-sm font-semibold uppercase tracking-[0.08em] text-accent">Payment confirmed</div>
      <h1 className="m-0 text-title font-bold">
        Welcome to the class{first ? `, ${first}` : ''}!
      </h1>
      <p className="m-0 max-w-sm text-muted">
        Your seat is locked in. Join the class WhatsApp group now. That's where everything happens.
      </p>
      <motion.a
        href={joinUrl(reference)}
        {...pressable}
        animate={HOP}
        transition={{ ...SPRING_PRESS, y: HOP_TRANSITION }}
        className={buttonClass}
      >
        <WhatsAppIcon /> JOIN THE WHATSAPP GROUP
      </motion.a>
      <p className="m-0 max-w-sm text-sm text-subtle">{schedule}</p>
    </>
  )
}

export default function WelcomePage({ reference }) {
  const [state, setState] = useState({ status: 'checking' })

  const check = useCallback(async () => {
    setState({ status: 'checking' })
    try {
      const result = await checkPayment(reference)
      if (result.paid) setState({ status: 'paid', name: result.name })
      else setState({ status: STILL_PROCESSING.has(result.status) ? 'processing' : 'unpaid' })
    } catch (err) {
      setState({ status: 'error', message: err.message })
    }
  }, [reference])

  useEffect(() => {
    check()
  }, [check])

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={SPRING_ENTER}
        className="glow-card w-full max-w-[460px] p-card sm:p-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={state.status}
            role="status"
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={SPRING_POP}
            className="flex flex-col items-center gap-4 py-2 text-center sm:py-6"
          >
            {state.status === 'checking' && (
              <>
                <span className="text-accent">
                  <Spinner />
                </span>
                <p className="m-0 text-muted">Confirming your payment with Paystack…</p>
              </>
            )}

            {state.status === 'paid' && <Paid name={state.name} reference={reference} />}

            {state.status === 'processing' && (
              <>
                <h1 className="m-0 text-title font-bold">Your payment is still processing</h1>
                <p className="m-0 max-w-sm text-muted">
                  This can take a minute, especially for bank transfers. Check again shortly.
                </p>
                <motion.button type="button" onClick={check} {...pressable} className={buttonClass}>
                  Check again
                </motion.button>
              </>
            )}

            {state.status === 'unpaid' && (
              <>
                <h1 className="m-0 text-title font-bold">We couldn't confirm a payment</h1>
                <p className="m-0 max-w-sm text-muted">
                  The payment wasn't completed, so you haven't been charged for a seat.
                </p>
                <motion.a href="/#/signup" {...pressable} className={buttonClass}>
                  Try again
                </motion.a>
              </>
            )}

            {state.status === 'error' && (
              <>
                <h1 className="m-0 text-title font-bold">Something went wrong</h1>
                <p className="m-0 max-w-sm text-muted">{state.message}</p>
                <motion.button type="button" onClick={check} {...pressable} className={buttonClass}>
                  Check again
                </motion.button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </PageShell>
  )
}
