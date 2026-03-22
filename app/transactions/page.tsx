'use client';

import { Suspense, useState } from 'react';
import { TransactionList } from '@/components/features/TransactionList';
import { TransactionFilters } from '@/components/features/TransactionFilters';
import { SkeletonList } from '@/components/ui/Skeleton';
import { DeleteTransactionModal } from '@/components/features/DeleteTransactionModal';
import { useTransactions } from '@/context/TransactionsContext';
import { useTransactionFilters } from '@/hooks';
import type { Transaction } from '@/types';

function TransactionsContent() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const { filters, setFilters, clearFilters, filtered } = useTransactionFilters(transactions);

  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(null);

  function handleDeleteRequest(id: string) {
    const transaction = transactions.find((t) => t.id === id) ?? null;
    setPendingDelete(transaction);
  }

  function handleDeleteConfirm() {
    if (pendingDelete) deleteTransaction(pendingDelete.id);
    setPendingDelete(null);
  }

  function handleDeleteCancel() {
    setPendingDelete(null);
  }

  return (
    <>
      <div className="flex flex-col gap-lg">
        <h1 className="heading-default text-content-primary text-xl">Transações</h1>

        <TransactionFilters value={filters} onChange={setFilters} onClear={clearFilters} />
        <TransactionList
          transactions={filtered}
          isLoading={isLoading}
          onEdit={(id) => console.log('edit', id)}
          onDelete={handleDeleteRequest}
          emptyMessage="Nenhuma transação encontrada para os filtros selecionados."
          className="w-full overflow-y-auto max-h-[calc(100vh-300px)]"
        />
      </div>
      <DeleteTransactionModal
        transaction={pendingDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
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
