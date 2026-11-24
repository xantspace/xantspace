import { motion } from 'motion/react'
import { SPRING_POP, pressable } from '../springs.js'

export function Spinner() {
  return (
    <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** Green circle + tick that springs in and draws itself */
export function SuccessCheck() {
  return (
    <motion.svg
      width="72"
      height="72"
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ ...SPRING_POP, delay: 0.1 }}
    >
      <circle className="check-circle" cx="28" cy="28" r="24" stroke="var(--color-accent)" strokeWidth="2.5" />
      <path className="check-mark" d="M18 29l7 7 13-15" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  )
}

const sizes = {
  sm: 'min-h-11 px-4 py-2.5 text-[15px] sm:px-5 sm:py-3 sm:text-base rounded-[10px]',
  md: 'min-h-12 px-5 py-3.5 text-base sm:px-7 sm:py-4 sm:text-lg rounded-xl',
  // Full width on phones so the label never squeezes onto two lines
  lg: 'mt-2 w-full sm:w-auto min-h-12 px-6 py-4 text-lg sm:px-9 sm:text-xl rounded-xl',
}

const variants = {
  primary: 'bg-accent text-ink font-semibold hover:bg-accent-hover',
  outline: 'border border-line-strong text-fg font-medium hover:border-subtle',
}

export function Button({ href, variant = 'primary', size = 'md', className = '', children }) {
  return (
    <motion.a
      href={href}
      {...pressable}
      className={`inline-flex items-center justify-center no-underline transition-colors ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.a>
  )
}

export function Section({ id, narrow = false, className = '', children }) {
  return (
    <section
      id={id}
      className={`mx-auto px-gutter py-section ${narrow ? 'max-w-[860px]' : 'max-w-[1200px]'} ${className}`}
    >
      {children}
    </section>
  )
}

export function Eyebrow({ children }) {
  return (
    <div className="text-sm font-semibold uppercase tracking-[0.08em] text-accent">{children}</div>
  )
}

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface ${className}`}>{children}</div>
  )
}
