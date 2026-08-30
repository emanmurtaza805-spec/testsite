import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} maxWidth="max-w-sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-blush-100 dark:bg-blush-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-blush-500" />
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-sm text-secondary mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="btn-secondary">{cancelLabel}</button>
          <button onClick={onConfirm} className="btn-primary bg-blush-500 hover:bg-blush-400">{confirmLabel}</button>
        </div>
      </div>
    </Modal>
  );
}
