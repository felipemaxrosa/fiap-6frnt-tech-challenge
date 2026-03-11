import type { Transaction } from '@/types';

export interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
