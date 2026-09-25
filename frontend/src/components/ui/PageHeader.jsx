import React from 'react';
import { cn } from './Button';

export default function PageHeader({ title, description, children, className }) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{title}</h1>
        {description && (
          <p className="text-[var(--text-muted)] mt-1.5 max-w-2xl text-sm md:text-base">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
