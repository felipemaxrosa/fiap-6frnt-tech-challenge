'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { FeedbackModalProps, FeedbackType } from './IFeedbackModal';

const config: Record<FeedbackType, { icon: React.ReactNode; iconClass: string }> = {
  success: {
    icon: <CheckCircle size={48} aria-hidden="true" />,
    iconClass: 'text-feedback-success',
  },
  error: {
    icon: <XCircle size={48} aria-hidden="true" />,
    iconClass: 'text-feedback-danger',
  },
  info: {
    icon: <Info size={48} aria-hidden="true" />,
    iconClass: 'text-brand-primary',
  },
};

export function FeedbackModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  showCloseButton = true,
}: FeedbackModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const { icon, iconClass } = config[type];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-content-primary/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-[22rem] rounded-default bg-surface p-xl shadow-card flex flex-col items-center gap-sm text-center">
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-sm right-sm rounded-default p-xs text-icon-default hover:bg-background transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className={iconClass}>{icon}</div>

        <h2 id="feedback-modal-title" className="heading text-content-primary">
          {title}
        </h2>

        {message && <p className="body-default text-content-secondary">{message}</p>}

        <button
          onClick={onClose}
          className="mt-sm w-full rounded-default bg-brand-primary py-sm body-semibold text-content-inverse hover:opacity-90 transition-opacity"
        >
          OK
        </button>
      </div>
    </div>,
    document.body
  );
}
