'use client';

import { useState } from 'react';
import { TransactionsTable } from '@/components/features/TransactionsTable';
import { TransactionFilters, DEFAULT_FILTERS } from '@/components/features/TransactionFilters';
import type { TransactionFiltersValue } from '@/components/features/TransactionFilters';
import { useTransactions } from '@/context/TransactionsContext';

export default function TransacoesPage() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const [filters, setFilters] = useState<TransactionFiltersValue>(DEFAULT_FILTERS);

  const filtered = transactions
    .filter((t) => filters.type === 'all' || t.type === filters.type)
    .filter((t) => !filters.dateFrom || t.date.slice(0, 10) >= filters.dateFrom)
    .filter((t) => !filters.dateTo || t.date.slice(0, 10) <= filters.dateTo)
    .sort((a, b) => {
      const dir = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'amount') return (a.amount - b.amount) * dir;
      return (a.date < b.date ? -1 : 1) * dir;
    });

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="heading-default text-content-primary text-xl">Transações</h1>

      <TransactionFilters value={filters} onChange={setFilters} />

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
