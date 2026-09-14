import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const variants = {
  primary:   'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm shadow-brand-500/20',
  secondary: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm shadow-accent-500/20',
  outline:   'border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 text-slate-700 dark:text-slate-300',
  ghost:     'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 text-slate-700 dark:text-slate-300',
  danger:    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm shadow-red-500/20',
};

const sizes = {
  sm:   'h-8 px-3 text-xs rounded-xl',
  md:   'h-10 px-4 text-sm rounded-xl',
  lg:   'h-12 px-6 text-base rounded-2xl',
  icon: 'h-10 w-10 justify-center rounded-xl',
};

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  icon: Icon,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
        'disabled:opacity-50 disabled:pointer-events-none',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : Icon && <Icon className="w-4 h-4 shrink-0" />
      }
      {children}
    </button>
  );
}
