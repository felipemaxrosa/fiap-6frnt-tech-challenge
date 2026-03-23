'use client';

import { Suspense } from 'react';
import { TransactionList } from '@/components/features/TransactionList';
import { TransactionFilters } from '@/components/features/TransactionFilters';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useTransactions } from '@/context/TransactionsContext';
import { useTransactionFilters } from '@/hooks';

function TransactionsContent() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const { filters, setFilters, clearFilters, filtered } = useTransactionFilters(transactions);

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="heading-default text-content-primary text-xl">Transações</h1>

      <TransactionFilters value={filters} onChange={setFilters} onClear={clearFilters} />

      <TransactionList
        transactions={filtered}
        isLoading={isLoading}
        onEdit={(id) => console.log('edit', id)}
        onDelete={deleteTransaction}
        emptyMessage="Nenhuma transação encontrada para os filtros selecionados."
        className="w-full overflow-y-auto max-h-[calc(100vh-300px)]"
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<SkeletonList lines={5} />}>
      <TransactionsContent />
    </Suspense>
  );
}
