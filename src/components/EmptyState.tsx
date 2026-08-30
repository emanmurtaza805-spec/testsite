import { type ReactNode } from 'react';
import { Leaf } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export default function EmptyState({ title, message, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-secondary-surface flex items-center justify-center mb-5">
        {icon || <Leaf size={32} className="text-sage-400" />}
      </div>
      <h3 className="text-lg font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm text-secondary mb-5 max-w-xs">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">{actionLabel}</button>
      )}
    </div>
  );
}
