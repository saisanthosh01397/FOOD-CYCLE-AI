import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AtmosphericBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--background)]">
      {/* 1. Large ambient glow (follows theme) */}
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-normal dark:mix-blend-lighten opacity-[0.08] dark:opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, var(--color-brand-500) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.1, 0.9, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-normal dark:mix-blend-lighten opacity-[0.08] dark:opacity-20 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, var(--color-accent-500) 0%, transparent 70%)'
        }}
        animate={{
          scale: [0.9, 1.2, 1, 0.9],
          opacity: [0.15, 0.2, 0.1],
          x: [0, -40, 10, 0],
          y: [0, 30, -10, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* 2. Abstract "FoodCycle" orbital rings (subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1500px] max-h-[1500px] opacity-[0.03] dark:opacity-[0.05]">
        <motion.div 
          className="absolute inset-0 rounded-full border border-brand-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
        >
           {/* Node on orbit */}
           <div className="absolute top-[10%] left-[20%] w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_var(--color-brand-500)]" />
        </motion.div>
        
        <motion.div 
          className="absolute inset-[10%] rounded-full border border-accent-500/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
        >
           {/* Node on inner orbit */}
           <div className="absolute bottom-[20%] right-[15%] w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_10px_var(--color-accent-500)]" />
        </motion.div>
      </div>

      {/* 3. Subtle grid for structural/AI feel */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-slate-500) 1px, transparent 1px), linear-gradient(to bottom, var(--color-slate-500) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 100%)'
        }}
      />
    </div>
  );
}
