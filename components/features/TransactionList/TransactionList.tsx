import { ReceiptText } from 'lucide-react';
import { TransactionItem } from '@/components/features/TransactionItem';
import type { TransactionListProps } from './ITransactionList';

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  emptyMessage = 'No transactions found.',
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white py-16 text-gray-400">
        <ReceiptText size={32} />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="lg:w-80 lg:shrink-0">
      <h2 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Extrato
      </h2>

      <ul className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <TransactionItem
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
