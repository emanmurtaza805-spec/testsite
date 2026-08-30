import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="toast-enter card-surface px-4 py-3 flex items-center gap-3 shadow-float"
        >
          {toast.type === 'success' && <CheckCircle2 size={20} className="text-sage-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle size={20} className="text-blush-500 shrink-0" />}
          {toast.type === 'info' && <Info size={20} className="text-eucalyptus-500 shrink-0" />}
          <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{toast.message}</span>
          <button onClick={() => dismissToast(toast.id)} className="text-muted hover:text-secondary transition-colors">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
