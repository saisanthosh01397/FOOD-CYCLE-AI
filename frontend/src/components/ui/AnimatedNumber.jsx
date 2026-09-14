import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

/**
 * AnimatedNumber
 * Smoothly animates from 0 (or previous value) to `value`.
 * 
 * Usage: <AnimatedNumber value={analytics.kpis.total_waste} suffix=" kg" decimals={1} />
 */
export default function AnimatedNumber({ 
  value = 0, 
  decimals = 0, 
  prefix = '', 
  suffix = '',
  duration = 1.2,
  className = ''
}) {
  const [displayed, setDisplayed] = useState(0);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    const numericValue = parseFloat(value) || 0;
    const controls = animate(motionVal, numericValue, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94], // custom easeOut
      onUpdate: (latest) => {
        setDisplayed(latest);
      }
    });
    return controls.stop;
  }, [value, duration]);

  const formatted = decimals > 0 
    ? displayed.toFixed(decimals) 
    : Math.round(displayed).toLocaleString();

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
