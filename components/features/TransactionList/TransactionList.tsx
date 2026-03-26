import { ReceiptText } from 'lucide-react';
import { cn } from '@/lib/classes';
import { TransactionItem } from '@/components/features/TransactionItem';
import { SkeletonList } from '@/components/ui/Skeleton';
import type { TransactionListProps } from './ITransactionList';

export function TransactionList({
  transactions,
  isLoading = false,
  onEdit,
  onDelete,
  emptyMessage = 'No transactions found.',
  title,
  className,
  showActions = true,
  tooltipPosition,
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
    <div className={cn('@container', className)}>
      {title && (
        <h2 className="text-xl font-bold text-content-primary sm:truncate sm:tracking-tight mb-4">
          {title}
        </h2>
      )}

      <ul className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={showActions}
            tooltipPosition={tooltipPosition}
          />
        ))}
      </ul>
    </div>
  );
}
