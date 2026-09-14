import React from 'react';
import { cn } from './Button';
import { AlertCircle } from 'lucide-react';

export default function EmptyState({ 
  title = "No data found", 
  description = "There are currently no records to display in this view.", 
  icon: Icon = AlertCircle, 
  action, 
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]", className)}>
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-2">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
