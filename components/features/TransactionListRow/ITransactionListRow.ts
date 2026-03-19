import type { Transaction } from '@/types';

export interface TransactionListRowProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
