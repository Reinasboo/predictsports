// Motion animation presets for Framer Motion

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -12,
    transition: { duration: 0.3 },
  },
}

export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
}

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 10px rgba(6, 182, 212, 0.5)',
      '0 0 20px rgba(6, 182, 212, 0.8)',
      '0 0 10px rgba(6, 182, 212, 0.5)',
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: 'loop' as const,
  },
}

export const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}

export const shimmerAnimation = {
  animate: {
    backgroundPosition: ['200% center', '-200% center'],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'linear',
  },
}

export const countUpVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
}

export const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

export const scaleInVariant = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: 'easeOut' },
}

export default {
  containerVariants,
  itemVariants,
  cardVariants,
  pageTransition,
  glowPulse,
  floatingAnimation,
  shimmerAnimation,
  slideInFromLeft,
  slideInFromRight,
  scaleInVariant,
}
