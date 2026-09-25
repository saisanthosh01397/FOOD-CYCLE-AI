import React from 'react';
import { motion } from 'framer-motion';

/**
 * Epic FoodCycle AI Logo
 * Cinematic Framer Motion SVG sequence.
 * 
 * Flow: 
 * 1. AI Node illuminates
 * 2. Recovery cycle draws itself
 * 3. Sustainability leaf emerges and scales up
 */
export default function Logo({ className = "w-8 h-8", animated = false }) {
  if (animated) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <radialGradient id="nodeFill" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          <linearGradient id="leafFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="70%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Outer Orbit (Cycle) */}
        <motion.circle 
          cx="50" cy="50" r="43" 
          stroke="url(#ringGrad)" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0, rotate: -90 }}
          animate={{ pathLength: 1, opacity: 0.5, rotate: 0 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
          style={{ transformOrigin: "50px 50px" }}
        />
        
        {/* Orbit Node */}
        <motion.circle 
          cx="93" cy="50" r="3.5" 
          fill="#10b981"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 0.5, delay: 2.2, type: "spring" }}
        />

        {/* AI Network Node (Center) */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          style={{ transformOrigin: "50px 50px" }}
        >
          <circle cx="50" cy="50" r="10" fill="url(#nodeFill)" />
          <motion.circle 
            cx="50" cy="50" r="10" 
            stroke="#10b981" 
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.6, scale: 1.5 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
          <line x1="50" y1="43" x2="50" y2="57" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <line x1="43" y1="50" x2="57" y2="50" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <circle cx="50" cy="50" r="2.5" fill="white" opacity="0.9" />
        </motion.g>

        {/* Leaf Emergence */}
        <motion.g
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 1, type: "spring", bounce: 0.3 }}
          style={{ transformOrigin: "32px 52px" }}
        >
          <path
            d="M32 28 C20 28 14 40 18 52 C22 64 36 68 48 62 C52 60 54 56 52 52 C50 44 42 38 38 32 C36 30 34 28 32 28 Z"
            fill="url(#leafFill)"
            opacity="0.92"
          />
          <path d="M32 28 C38 38 46 50 50 60" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M34 36 C38 34 42 36 44 38" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
          <path d="M38 44 C42 42 46 44 47 46" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        </motion.g>

        {/* Continuous slow rotation wrapper for the entire orbit after draw */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 3 }}
          style={{ transformOrigin: "50px 50px" }}
        >
          {/* Recovery Arc */}
          <motion.path
            d="M50 62 C58 68 70 64 74 56 C78 48 72 38 64 36"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
          />
        </motion.g>
      </svg>
    );
  }

  // Static version
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="43" stroke="currentColor" strokeWidth="2" strokeDasharray="12 6" strokeLinecap="round" opacity="0.3" />
      <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="50" cy="50" r="2.5" fill="currentColor" />
      <line x1="50" y1="43" x2="50" y2="57" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="43" y1="50" x2="57" y2="50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path
        d="M32 28 C20 28 14 40 18 52 C22 64 36 68 48 62 C52 60 54 56 52 52 C50 44 42 38 38 32 C36 30 34 28 32 28 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M32 28 C38 38 46 50 50 60" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path
        d="M50 62 C58 68 70 64 74 56 C78 48 72 38 64 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 3"
        opacity="0.45"
      />
    </svg>
  );
}
