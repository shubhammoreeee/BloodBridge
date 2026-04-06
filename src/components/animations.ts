export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as any }},
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25 }}
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.1 }}
}

export const cardVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as any }}
}

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

export const slideFromRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 }},
  exit:    { x: '100%', opacity: 0, transition: { duration: 0.25 }}
}

export const scaleIn = {
  initial: { scale: 0.90, opacity: 0 },
  animate: { scale: 1,    opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 25 }},
  exit:    { scale: 0.95, opacity: 0, transition: { duration: 0.2 }}
}

export const listItem = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 }}
}
