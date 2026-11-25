import { motion } from 'motion/react'
import { PageShell } from './SignupPage.jsx'
import { Button, Eyebrow } from './components/ui.jsx'
import { PRICE, SIGNUP_HREF, bonus } from './content.js'
import { SPRING_ENTER } from './springs.js'

function BonusCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...SPRING_ENTER, delay: (index % 2) * 0.06 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-card-sm transition-colors hover:border-accent/60"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-accent">
          {item.tag}
        </span>
        <span className="font-display text-sm font-bold text-subtle">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h2 className="m-0 text-xl">{item.title}</h2>
      <p className="m-0 text-muted">{item.body}</p>
      <ul className="m-0 mt-1 flex list-none flex-col gap-2 p-0">
        {item.points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-fg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {p}
          </li>
        ))}
      </ul>
    </motion.article>
  )
}

export default function BonusPage() {
  return (
    <PageShell>
      <div className="w-full max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_ENTER}
          className="mb-8 flex max-w-[720px] flex-col gap-4 sm:mb-12"
        >
          <Eyebrow>Bonus. Included with your seat.</Eyebrow>
          <h1 className="m-0 text-display font-bold leading-[1.05]">
            Build apps that <span className="text-accent">look</span> as good as they work.
          </h1>
          <p className="m-0 text-lead text-muted">
            AI can write the code. Knowing what good design looks like is what makes people pay.
            On top of the shortlet app, you get these design lessons at no extra cost.
          </p>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-3 sm:gap-4">
          {bonus.map((item, i) => (
            <BonusCard key={item.title} item={item} index={i} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border-2 border-accent bg-surface px-card py-[clamp(2rem,7vw,3rem)] text-center sm:mt-14">
          <h2 className="m-0 text-h2">All of this for {PRICE}</h2>
          <p className="m-0 max-w-[520px] text-large text-muted">
            The shortlet app, 5 live sessions and every bonus lesson above.
          </p>
          <Button href={SIGNUP_HREF} size="lg">
            SECURE MY SEAT!!
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
