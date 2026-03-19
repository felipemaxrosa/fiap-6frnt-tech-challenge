import { ReceiptText } from 'lucide-react';
import { TransactionListRow } from '@/components/features/TransactionListRow';
import { SkeletonList } from '@/components/ui/Skeleton';
import type { TransactionListProps } from './ITransactionList';

export function TransactionList({
  transactions,
  isLoading = false,
  onEdit,
  onDelete,
  emptyMessage = 'No transactions found.',
}: TransactionListProps) {
  if (isLoading) {
    return <SkeletonList lines={5} />;
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white py-16 text-gray-400">
        <ReceiptText size={32} />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ul className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <TransactionListRow
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
