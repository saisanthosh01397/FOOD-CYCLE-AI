import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from './Button';

export default function LoadingState({ message = "Loading...", className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]", className)}>
      <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-4" />
      <p className="text-sm font-medium text-[var(--text-muted)]">{message}</p>
    </div>
  );
}
