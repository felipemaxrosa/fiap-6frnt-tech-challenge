'use client';

import { Suspense } from 'react';
import { TransactionsTable } from '@/components/features/TransactionsTable';
import { TransactionFilters } from '@/components/features/TransactionFilters';
import { SkeletonList } from '@/components/ui/Skeleton';
import { useTransactions } from '@/context/TransactionsContext';
import { useTransactionFilters } from '@/hooks';

function TransacoesContent() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const { filters, setFilters, clearFilters, filtered } = useTransactionFilters(transactions);

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="heading-default text-content-primary text-xl">Transações</h1>

      <TransactionFilters value={filters} onChange={setFilters} onClear={clearFilters} />

      <TransactionsTable
        transactions={filtered}
        isLoading={isLoading}
        onEdit={(id) => console.log('edit', id)}
        onDelete={deleteTransaction}
        emptyMessage="Nenhuma transação encontrada para os filtros selecionados."
      />
    </div>
  );
}

export default function TransacoesPage() {
  return (
    <Suspense fallback={<SkeletonList lines={5} />}>
      <TransacoesContent />
    </Suspense>
  );
}
