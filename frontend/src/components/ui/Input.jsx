import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Input = forwardRef(({ className, type, icon: Icon, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border bg-white dark:bg-slate-900/50 px-4 py-2 text-sm text-slate-900 dark:text-white transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50",
          Icon && "pl-10",
          error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 dark:border-slate-800",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export const Select = forwardRef(({ className, icon: Icon, error, children, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <select
        className={cn(
          "flex h-11 w-full rounded-xl border bg-white dark:bg-slate-900/50 px-4 py-2 text-sm text-slate-900 dark:text-white transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          Icon && "pl-10",
          error ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200 dark:border-slate-800",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {/* Custom dropdown arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";
