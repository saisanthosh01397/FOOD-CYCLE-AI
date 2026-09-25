import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './Button';

/**
 * StatusDot
 * An animated status indicator for system health, user status, etc.
 * 
 * status: 'ok' | 'online' | 'offline' | 'error' | 'warning' | 'loading'
 */
export default function StatusDot({ status = 'ok', className, showLabel = true, label }) {
  const statusMap = {
    ok:       { color: 'bg-brand-500',  ring: 'bg-brand-500/30',  text: 'Operational', pulse: true  },
    online:   { color: 'bg-brand-500',  ring: 'bg-brand-500/30',  text: 'Online',       pulse: true  },
    offline:  { color: 'bg-slate-400',  ring: 'bg-slate-400/30',  text: 'Offline',      pulse: false },
    error:    { color: 'bg-red-500',    ring: 'bg-red-500/30',    text: 'Error',        pulse: true  },
    warning:  { color: 'bg-amber-500',  ring: 'bg-amber-500/30',  text: 'Warning',      pulse: false },
    loading:  { color: 'bg-accent-500', ring: 'bg-accent-500/30', text: 'Loading...',   pulse: true  },
  };

  const config = statusMap[status] || statusMap.ok;
  const displayLabel = label || config.text;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {config.pulse && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-60", config.ring)} />
        )}
        <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", config.color)} />
      </span>
      {showLabel && (
        <span className={cn(
          "text-xs font-semibold",
          status === 'ok' || status === 'online' ? 'text-brand-600 dark:text-brand-400' :
          status === 'error' ? 'text-red-600 dark:text-red-400' :
          status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
          'text-[var(--text-muted)]'
        )}>
          {displayLabel}
        </span>
      )}
    </div>
  );
}
