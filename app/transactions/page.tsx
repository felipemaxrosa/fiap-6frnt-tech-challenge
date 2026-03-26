'use client';

import { Suspense, useState } from 'react';
import { TransactionList } from '@/components/features/TransactionList';
import { TransactionFilters } from '@/components/features/TransactionFilters';
import { SkeletonList } from '@/components/ui/Skeleton';
import { DeleteTransactionModal } from '@/components/features/DeleteTransactionModal';
import { useTransactions } from '@/context/TransactionsContext';
import { useFeedback } from '@/context/FeedbackContext';
import { useTransactionFilters } from '@/hooks';
import type { Transaction } from '@/types';
import { EditTransactionModal } from '@/components/features/EditTransactionModal';
import { TransactionFormValues } from '@/components/features';

function TransactionsContent() {
  const { transactions, isLoading, deleteTransaction, updateTransaction } = useTransactions();
  const { filters, setFilters, clearFilters, filtered } = useTransactionFilters(transactions);

  const { showFeedback } = useFeedback();
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<Transaction | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  function handleDeleteRequest(id: string) {
    const transaction = transactions.find((t) => t.id === id) ?? null;
    setPendingDelete(transaction);
  }

  function handleEditRequest(id: string) {
    const transaction = transactions.find((t) => t.id === id) ?? null;
    setPendingEdit(transaction);
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(pendingDelete.id);
      showFeedback({
        type: 'success',
        title: 'Transação excluída',
        message: 'A transação foi removida com sucesso.',
      });
      setPendingDelete(null);
    } catch {
      showFeedback({
        type: 'error',
        title: 'Erro ao excluir',
        message: 'Não foi possível excluir a transação. Tente novamente.',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleEditConfirm(data: TransactionFormValues) {
    if (!pendingEdit) return;
    setIsUpdating(true);
    try {
      await updateTransaction(pendingEdit.id, data);
      showFeedback({
        type: 'success',
        title: 'Transação atualizada',
        message: 'A transação foi atualizada com sucesso.',
      });
      setPendingEdit(null);
    } catch {
      showFeedback({
        type: 'error',
        title: 'Erro ao atualizar',
        message: 'Não foi possível atualizar a transação. Tente novamente.',
      });
    } finally {
      setIsUpdating(false);
    }
  }

  function handleDeleteCancel() {
    setPendingDelete(null);
  }

  function handleEditCancel() {
    setPendingEdit(null);
  }

  return (
    <>
      <div className="flex flex-col gap-lg">
        <h1 className="heading text-content-primary text-xl">Transações</h1>

        <TransactionFilters value={filters} onChange={setFilters} onClear={clearFilters} />
        <TransactionList
          transactions={filtered}
          isLoading={isLoading}
          onEdit={handleEditRequest}
          onDelete={handleDeleteRequest}
          emptyMessage="Nenhuma transação encontrada para os filtros selecionados."
          className="w-full overflow-y-auto max-h-[calc(100vh-300px)]"
        />
      </div>
      <DeleteTransactionModal
        transaction={pendingDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />
      <EditTransactionModal
        transaction={pendingEdit}
        onConfirm={handleEditConfirm}
        onCancel={handleEditCancel}
        isSubmitting={isUpdating}
      />
    </>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<SkeletonList lines={5} />}>
      <TransactionsContent />
    </Suspense>
  );
}
