import { useState } from 'react';
import type { Transaction } from '@/types';
import { DEFAULT_FILTERS } from '@/components/features/TransactionFilters';
import type { TransactionFiltersValue } from '@/components/features/TransactionFilters';

export function useTransactionFilters(transactions: Transaction[]) {
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

  return { filters, setFilters, filtered };
}
