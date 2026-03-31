'use client';

import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { FeedbackModalProps, FeedbackType } from './IFeedbackModal';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const closeLabel: Record<FeedbackType, string> = {
  success: 'Fechar',
  error: 'Entendido',
  info: 'OK',
};

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
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = focusable[0];
      if (first) first.focus();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
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
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-[22rem] rounded-default bg-surface p-xl shadow-card flex flex-col items-center gap-sm text-center"
      >
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
          {closeLabel[type]}
        </button>
      </div>
    </div>,
    document.body
  );
}
