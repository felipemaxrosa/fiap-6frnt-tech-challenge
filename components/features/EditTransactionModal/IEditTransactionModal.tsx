import { Transaction } from '@/types';
import { TransactionFormValues } from '../TransactionForm';

export interface EditTransactionModalProps {
  transaction: Transaction | null;
  onConfirm: (data: TransactionFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
