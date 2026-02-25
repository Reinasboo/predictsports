/**
 * Animation Utilities for Predictsports
 * Framer Motion variants and animation constants
 */

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const slideInFromLeftVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const slideInFromRightVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const slideInFromTopVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const slideInFromBottomVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const scaleInVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export const bounceInVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

export const glowVariants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(0, 255, 255, 0.5)',
      '0 0 40px rgba(0, 255, 255, 0.8)',
      '0 0 20px rgba(0, 255, 255, 0.5)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

export const shakeVariants = {
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

export const rotateVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Page transition variants
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Card hover effects
export const cardHoverVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0, 255, 255, 0.2)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
};

// Button click effect
export const buttonClickVariants = {
  rest: { scale: 1 },
  tap: { scale: 0.95 },
};

// Modal backdrop
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0 },
};

// Modal content
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

// Typing animation
export const typingVariants = {
  animate: {
    opacity: [0, 1],
    transition: {
      duration: 0.8,
      repeat: Infinity,
    },
  },
};

// Chart animations
export const chartVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

// Number counter animation
export const numberCounterVariants = {
  animate: (custom: number) => ({
    opacity: 1,
    transition: {
      duration: custom,
    },
  }),
};
