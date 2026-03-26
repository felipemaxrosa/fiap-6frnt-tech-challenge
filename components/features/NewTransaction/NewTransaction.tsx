'use client';

import { Card } from '@/components/ui/Card';
import { useFeedback } from '@/context/FeedbackContext';
import { useTransactions } from '@/context/TransactionsContext';
import type { ReactElement } from 'react';
import { useRef, useState } from 'react';
import { TransactionForm, type TransactionFormValues } from '../TransactionForm';
import {
  ConfirmTransactionModal,
  type ConfirmTransactionModalRef,
} from './ConfirmTransactionModal';

const SUCCESS_FEEDBACK = {
  type: 'success' as const,
  title: 'Transação adicionada!',
  message: 'Seu extrato foi atualizado.',
};
const ERROR_FEEDBACK = {
  type: 'error' as const,
  title: 'Erro ao adicionar transação',
  message: 'Tente novamente',
};

export function NewTransaction(): ReactElement {
  const { addTransaction } = useTransactions();
  const { showFeedback } = useFeedback();

  const modalRef = useRef<ConfirmTransactionModalRef>(null);
  const [pendingData, setPendingData] = useState<TransactionFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = (data: TransactionFormValues): void => {
    setPendingData(data);
    modalRef.current?.open();
  };

  const handleConfirm = async (): Promise<void> => {
    if (!pendingData) return;

    setIsSubmitting(true);

    try {
      await addTransaction(pendingData);
      closeModalAndReset();
      showFeedback(SUCCESS_FEEDBACK);
    } catch {
      closeModal();
      showFeedback(ERROR_FEEDBACK);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    closeModal();
  };

  const closeModal = (): void => {
    modalRef.current?.close();
  };

  const closeModalAndReset = (): void => {
    closeModal();
    setPendingData(null);
  };

  return (
    <>
      <Card padding="lg" className="rounded-default bg-surface shadow-card">
        <h2 className="heading text-content-primary mb-lg">Nova transação</h2>

        <TransactionForm
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Card>

      <ConfirmTransactionModal
        ref={modalRef}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
