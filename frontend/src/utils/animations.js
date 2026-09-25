/**
 * Centralized, contextual animation variants for FoodCycle AI.
 * Creates different transition feelings based on page purpose.
 */

// 1. DASHBOARD: Soft zoom & reveal (command center feeling)
export const pageZoomReveal = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 1.02, filter: 'blur(4px)', transition: { duration: 0.3, ease: 'easeIn' } }
};

// 2. PREDICTION / VISION: Forward intelligence transition (slide left, revealing logic)
export const pageForwardSlide = {
  initial: { opacity: 0, x: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 } },
  exit:    { opacity: 0, x: -20, filter: 'blur(4px)', transition: { duration: 0.3, ease: 'easeIn' } }
};

// 3. RECOVERY: Flow/cycle transition (coming from bottom, floating up)
export const pageFloatUp = {
  initial: { opacity: 0, y: 30, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.3, ease: 'easeIn' } }
};

// 4. ANALYTICS / HISTORY: Data transition (opacity + slight scale down to reveal density)
export const pageDataReveal = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } }
};

// Generic Fade
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } }
};

// Fade + translate up (for cards)
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

// Scale + fade (modals, dropdowns)
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

// Slide down (dropdowns)
export const slideDown = {
  initial: { opacity: 0, height: 0, y: -5 },
  animate: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, height: 0, y: -5, transition: { duration: 0.2 } }
};

// Stagger wrappers
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

// AI processing pulse (Vision)
export const aiPulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.6, 1, 0.6],
    filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

// Modal
export const modalOverlay = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: { opacity: 1, backdropFilter: 'blur(8px)', transition: { duration: 0.3 } },
  exit:    { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.2 } }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1,    y: 0,  transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit:    { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }
};

// Result reveal
export const resultReveal = {
  initial: { opacity: 0, x: 20, filter: 'blur(4px)' },
  animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};
export const cardHover = { scale: 1.02, transition: { duration: 0.2 } };