import { useEffect, useRef, useState } from 'react'
import { motion, useAnimate, useReducedMotion } from 'motion/react'
import { HERO_VIDEO } from '../content.js'
import { SPRING_POP, SPRING_WOBBLE, pressable } from '../springs.js'

// --color-accent (#C6F432) as RGB: motion can't animate CSS variables inside box-shadow.
const ACCENT_RGB = '198, 244, 50'

function SoundIcon({ on }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      {on ? (
        <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
      ) : (
        <path d="M22 9l-6 6M16 9l6 6" />
      )}
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

/**
 * Hero video that:
 *  1. springs into a wobble with a green glow the first time it's on screen,
 *  2. starts playing muted, with a "Tap for sound" button,
 *  3. follows the visitor as a small corner player if they scroll away mid-video.
 * Scrolling is never blocked.
 */
export default function HeroVideo() {
  const hasVideo = Boolean(HERO_VIDEO.src)
  const reduceMotion = useReducedMotion()
  const slotRef = useRef(null)
  const videoRef = useRef(null)
  const seen = useRef(false)
  const [frame, animate] = useAnimate()

  const [inView, setInView] = useState(false)
  const [mini, setMini] = useState(false)
  const [muted, setMuted] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)

  // "In view" = at least half of the video's spot on the page is visible.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5] },
    )
    io.observe(slotRef.current)
    return () => io.disconnect()
  }, [])

  // First time it's on screen: shake + glow, then autoplay (muted).
  useEffect(() => {
    if (!inView || seen.current) return
    const timer = setTimeout(() => {
      seen.current = true
      if (!reduceMotion) attentionShake()
      if (hasVideo && !reduceMotion) videoRef.current?.play().catch(() => {})
    }, 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  // Scrolled away while it's playing: shrink into the corner player. Back in view: return.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView) setMini(false)
    else if (!v.paused && !v.ended && !dismissed) setMini(true)
  }, [inView, dismissed])

  // Spring the corner player in; snap back to normal when it returns to the page.
  useEffect(() => {
    if (!frame.current) return
    if (mini) {
      // Drops in from above, since the player sits at the top of the screen.
      animate(frame.current, { opacity: [0, 1], y: [-48, 0], scale: [0.7, 1] }, SPRING_POP)
    } else {
      animate(frame.current, { opacity: 1, y: 0, scale: 1 }, { duration: 0 })
    }
  }, [mini, animate, frame])

  async function attentionShake() {
    const el = frame.current
    animate(
      el,
      {
        boxShadow: [
          `0 0 0 0 rgba(${ACCENT_RGB}, 0)`,
          `0 0 0 8px rgba(${ACCENT_RGB}, 0.35)`,
          `0 0 56px 8px rgba(${ACCENT_RGB}, 0)`,
        ],
      },
      { duration: 1.4, ease: 'easeOut' },
    )
    // A quick knock, then a loose spring lets it wobble back like a real object.
    await animate(el, { x: -18, rotate: -2.5 }, { duration: 0.07 })
    await animate(el, { x: 0, rotate: 0 }, SPRING_WOBBLE)
  }

  function unmute() {
    const v = videoRef.current
    v.muted = false
    if (v.paused || v.ended) v.play().catch(() => {})
  }

  function togglePlay() {
    const v = videoRef.current
    if (v.paused || v.ended) v.play().catch(() => {})
    else v.pause()
  }

  function toggleSound() {
    const v = videoRef.current
    v.muted = !v.muted
  }

  function closeMini() {
    videoRef.current.pause()
    setDismissed(true)
    setMini(false)
  }

  function backToVideo() {
    slotRef.current.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
  }

  const frameClass = mini
    ? 'fixed top-3 right-3 z-50 aspect-[9/16] w-28 sm:top-4 sm:right-4 sm:w-40 md:w-52 rounded-2xl shadow-2xl shadow-black/60'
    : 'absolute inset-0 rounded-[20px]'

  return (
    <div ref={slotRef} className="relative aspect-[9/12] max-h-[600px] min-w-0 flex-[1_1_460px]">
      <motion.div ref={frame} className={`overflow-hidden border border-line bg-surface ${frameClass}`}>
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              src={HERO_VIDEO.src}
              poster={HERO_VIDEO.poster || undefined}
              muted
              playsInline
              preload="metadata"
              onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
              onPlay={() => {
                setPlaying(true)
                setEnded(false)
              }}
              onPause={() => setPlaying(false)}
              onEnded={() => {
                setEnded(true)
                setMini(false)
              }}
              className="size-full bg-ink object-cover"
            />

            {/* Our own controls instead of the browser's: tap anywhere to play/pause */}
            {!mini && (
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Pause video' : ended ? 'Replay video' : 'Play video'}
                className="absolute inset-0 grid place-items-center"
              >
                {!playing && (
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={SPRING_POP}
                    className="grid size-24 place-items-center rounded-full bg-ink/70 text-accent backdrop-blur sm:size-28"
                  >
                    {ended ? <ReplayIcon /> : <PlayIcon />}
                  </motion.span>
                )}
              </button>
            )}

            {!muted && !mini && (
              <button
                type="button"
                onClick={toggleSound}
                aria-label="Turn sound off"
                className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full bg-ink/70 text-fg backdrop-blur"
              >
                <SoundIcon on />
              </button>
            )}

            {muted && !mini && (
              <div className="absolute inset-x-0 bottom-5 flex justify-center">
                <motion.button
                  type="button"
                  onClick={unmute}
                  {...pressable}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/80 px-5 py-2.5 font-semibold text-fg backdrop-blur"
                >
                  <SoundIcon on={false} /> Tap for sound
                </motion.button>
              </div>
            )}

            {mini && (
              <>
                <button
                  type="button"
                  onClick={backToVideo}
                  aria-label="Go back to the video"
                  className="absolute inset-0"
                />
                <div className="absolute right-1.5 top-1.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={toggleSound}
                    aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
                    className="grid size-10 place-items-center rounded-full bg-ink/80 text-fg backdrop-blur"
                  >
                    <SoundIcon on={!muted} />
                  </button>
                  <button
                    type="button"
                    onClick={closeMini}
                    aria-label="Close video"
                    className="grid size-10 place-items-center rounded-full bg-ink/80 text-fg backdrop-blur"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center text-subtle">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M10 8l6 4-6 4z" />
            </svg>
            <div className="font-semibold text-fg">[YOUR MARKETING VIDEO]</div>
            <div className="text-sm">Set HERO_VIDEO.src in src/content.js</div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
