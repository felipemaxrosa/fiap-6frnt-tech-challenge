import type { Transaction } from '@/types';

export interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}
