'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

const MODAL_TITLE = 'Confirmar transação';
const MODAL_MESSAGE = 'Deseja confirmar a adição desta transação?';
const CANCEL_BUTTON_LABEL = 'Cancelar';
const CONFIRM_BUTTON_LABEL = 'Confirmar';
const SUBMITTING_BUTTON_LABEL = 'Confirmando...';

export interface ConfirmTransactionModalRef {
  open: () => void;
  close: () => void;
}

export interface ConfirmTransactionModalProps {
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const ConfirmTransactionModal = forwardRef<
  ConfirmTransactionModalRef,
  ConfirmTransactionModalProps
>(({ onConfirm, isSubmitting = false }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    []
  );

  const handleClose = (): void => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={MODAL_TITLE} showCloseButton={false}>
      <p className="body-default text-content-secondary mb-lg">{MODAL_MESSAGE}</p>
      <div className="flex justify-end gap-sm">
        <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          {CANCEL_BUTTON_LABEL}
        </Button>

        <Button type="button" onClick={onConfirm} disabled={isSubmitting} loading={isSubmitting}>
          {isSubmitting ? SUBMITTING_BUTTON_LABEL : CONFIRM_BUTTON_LABEL}
        </Button>
      </div>
    </Modal>
  );
});

ConfirmTransactionModal.displayName = 'ConfirmTransactionModal';
