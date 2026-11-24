// Shared spring presets (motion's physics springs). Lower damping = more bounce.

/** Snappy press/hover for buttons */
export const SPRING_PRESS = { type: 'spring', stiffness: 500, damping: 15, mass: 0.6 }

/** Card entering the page */
export const SPRING_ENTER = { type: 'spring', stiffness: 260, damping: 20 }

/** Bouncy pop for the success screen and the card on submit/pay */
export const SPRING_POP = { type: 'spring', stiffness: 400, damping: 11 }

/** Loose, wobbly spring used to shake the card back into place on errors */
export const SPRING_WOBBLE = { type: 'spring', stiffness: 700, damping: 9 }

/** Attention hop: a bounce every 3 seconds (0.7s hop + 2.3s rest) */
export const HOP = { y: [0, -12, 0, -5, 0] }
export const HOP_TRANSITION = {
  duration: 0.7,
  times: [0, 0.3, 0.55, 0.75, 1],
  ease: 'easeOut',
  repeat: Infinity,
  repeatDelay: 2.3,
  delay: 1,
}

/** Spread onto any motion.a / motion.button to make it springy */
export const pressable = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.94 },
  transition: SPRING_PRESS,
}
