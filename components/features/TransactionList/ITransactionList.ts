import type { Transaction } from '@/types';

export interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
  title?: string;
  className?: string;
}
