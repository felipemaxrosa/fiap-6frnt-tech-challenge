import { useState } from 'react';
import type { Transaction } from '@/types';
import { DEFAULT_FILTERS } from '@/components/features/TransactionFilters';
import type { TransactionFiltersValue } from '@/components/features/TransactionFilters';

function matchesType(t: Transaction, type: TransactionFiltersValue['type']) {
  return type === 'all' || t.type === type;
}

function matchesDateFrom(t: Transaction, dateFrom: string) {
  return !dateFrom || t.date.slice(0, 10) >= dateFrom;
}

function matchesDateTo(t: Transaction, dateTo: string) {
  return !dateTo || t.date.slice(0, 10) <= dateTo;
}

function sortTransactions(a: Transaction, b: Transaction, filters: TransactionFiltersValue) {
  const dir = filters.sortOrder === 'asc' ? 1 : -1;
  if (filters.sortBy === 'amount') return (a.amount - b.amount) * dir;
  return (a.date < b.date ? -1 : 1) * dir;
}

export function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFilters] = useState<TransactionFiltersValue>(DEFAULT_FILTERS);

  const filtered = transactions
    .filter((t) => matchesType(t, filters.type))
    .filter((t) => matchesDateFrom(t, filters.dateFrom))
    .filter((t) => matchesDateTo(t, filters.dateTo))
    .sort((a, b) => sortTransactions(a, b, filters));

  return { filters, setFilters, filtered };
}
