import type { Transaction } from '@/types';

export interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}
