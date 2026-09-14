import React from 'react';
import { motion } from 'framer-motion';

/**
 * FoodCycle AI Logo
 * 
 * Concept: A stylized leaf flowing around a central AI node,
 * representing the circular food economy — Food → AI → Recovery → Sustainability.
 *
 * Works at all sizes via `className`. Default: w-8 h-8
 * Set `animated={true}` for the full animated version (hero, landing).
 * Set `animated={false}` for static (sidebar, favicon, loading skeleton).
 */
export default function Logo({ className = "w-8 h-8", animated = false }) {
  if (animated) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ animation: 'leaf-glow 3s ease-in-out infinite' }}
      >
        {/* Outer orbit ring - slow clockwise rotation */}
        <g style={{ transformOrigin: '50px 50px', animation: 'orbit-slow 18s linear infinite' }}>
          <circle cx="50" cy="50" r="43" stroke="url(#ringGrad)" strokeWidth="1.5" strokeDasharray="12 6" strokeLinecap="round" opacity="0.5" />
          {/* Orbit node: leaf tip traveling the ring */}
          <circle cx="93" cy="50" r="3.5" fill="#10b981" opacity="0.9" />
        </g>

        {/* Inner orbit ring - slower counter-clockwise */}
        <g style={{ transformOrigin: '50px 50px', animation: 'orbit-reverse 28s linear infinite' }}>
          <circle cx="50" cy="50" r="30" stroke="url(#innerRingGrad)" strokeWidth="1" strokeDasharray="6 10" strokeLinecap="round" opacity="0.3" />
        </g>

        {/* Central AI node */}
        <circle cx="50" cy="50" r="10" fill="url(#nodeFill)" />
        <circle cx="50" cy="50" r="10" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
        {/* Node internal cross — AI network hint */}
        <line x1="50" y1="43" x2="50" y2="57" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <line x1="43" y1="50" x2="57" y2="50" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <circle cx="50" cy="50" r="2.5" fill="white" opacity="0.9" />

        {/* Leaf — sweeping from 10 o'clock to 4 o'clock around the central node */}
        <path
          d="M32 28 C20 28 14 40 18 52 C22 64 36 68 48 62 C52 60 54 56 52 52 C50 44 42 38 38 32 C36 30 34 28 32 28 Z"
          fill="url(#leafFill)"
          opacity="0.92"
        />
        {/* Leaf midrib */}
        <path
          d="M32 28 C38 38 46 50 50 60"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Small leaf veins */}
        <path d="M34 36 C38 34 42 36 44 38" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
        <path d="M38 44 C42 42 46 44 47 46" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />

        {/* Recovery arc — cyan arc from the leaf tip toward bottom-right */}
        <path
          d="M50 62 C58 68 70 64 74 56 C78 48 72 38 64 36"
          stroke="#06b6d4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 3"
          opacity="0.7"
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="innerRingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
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
      </svg>
    );
  }

  // Static version (sidebar, topnav, etc.)
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="43" stroke="currentColor" strokeWidth="2" strokeDasharray="12 6" strokeLinecap="round" opacity="0.3" />
      
      {/* Central node */}
      <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="50" cy="50" r="2.5" fill="currentColor" />
      <line x1="50" y1="43" x2="50" y2="57" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="43" y1="50" x2="57" y2="50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

      {/* Leaf */}
      <path
        d="M32 28 C20 28 14 40 18 52 C22 64 36 68 48 62 C52 60 54 56 52 52 C50 44 42 38 38 32 C36 30 34 28 32 28 Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M32 28 C38 38 46 50 50 60" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      
      {/* Recovery arc */}
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
