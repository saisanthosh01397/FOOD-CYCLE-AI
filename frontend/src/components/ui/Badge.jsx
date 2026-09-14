import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const badgeVariants = {
  default: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  primary: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400",
  secondary: "bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  admin: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function Badge({ className, variant = "default", children, icon: Icon, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </div>
  );
}
