/**
 * Centralized animation variants for FoodCycle AI.
 * Import from any component: import { fadeUp, staggerContainer } from '../utils/animations';
 */

// Page-level entrance
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

// Fade only
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } }
};

// Fade + translate up (most common card entrance)
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

// Scale + fade (modals, dropdowns)
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
};

// Slide down (dropdowns, accordion)
export const slideDown = {
  initial: { opacity: 0, height: 0, y: -5 },
  animate: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.25 } },
  exit:    { opacity: 0, height: 0, y: -5, transition: { duration: 0.2 } }
};

// Stagger container — wraps staggerItem children
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05
    }
  }
};

// Individual stagger child
export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }
};

// Card hover effect (use as whileHover prop)
export const cardHover = {
  y: -3,
  transition: { duration: 0.2, ease: 'easeOut' }
};

// Button interactions
export const buttonTap = { scale: 0.97 };
export const buttonHover = { scale: 1.02 };

// AI processing pulse (for Vision page loading)
export const aiPulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
  }
};

// Modal
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, scale: 0.95, y: 5,  transition: { duration: 0.2 } }
};

// Sidebar
export const sidebarVariants = {
  expanded: { width: 256, transition: { duration: 0.3, ease: 'easeInOut' } },
  collapsed: { width: 80,  transition: { duration: 0.3, ease: 'easeInOut' } }
};

// Result reveal (for AI results)
export const resultReveal = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};
