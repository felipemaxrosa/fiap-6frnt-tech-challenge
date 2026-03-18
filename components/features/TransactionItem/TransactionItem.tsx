'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { TRANSACTION_TYPE } from '@/shared/constants/transaction';
import { formatCurrency, formatDate } from '@/lib/format';
import type { TransactionType } from '@/types';
import type { TransactionItemProps } from './ITransactionItem';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const amountColorMap: Record<TransactionType, string> = {
  [TRANSACTION_TYPE.DEPOSIT]: 'text-green-600',
  [TRANSACTION_TYPE.WITHDRAWAL]: 'text-red-600',
  [TRANSACTION_TYPE.TRANSFER]: 'text-amber-600',
};

const amountPrefixMap: Record<TransactionType, string> = {
  [TRANSACTION_TYPE.DEPOSIT]: '+',
  [TRANSACTION_TYPE.WITHDRAWAL]: '-',
  [TRANSACTION_TYPE.TRANSFER]: '↔',
};

const badgeLabelMap: Record<TransactionType, string> = {
  [TRANSACTION_TYPE.DEPOSIT]: 'Depósito',
  [TRANSACTION_TYPE.WITHDRAWAL]: 'Saque',
  [TRANSACTION_TYPE.TRANSFER]: 'Transferência',
};

const badgeVariantMap: Record<TransactionType, 'income' | 'expense' | 'transfer'> = {
  [TRANSACTION_TYPE.DEPOSIT]: 'income',
  [TRANSACTION_TYPE.WITHDRAWAL]: 'expense',
  [TRANSACTION_TYPE.TRANSFER]: 'transfer',
};

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const { id, type, description, amount, date } = transaction;

  return (
    <li className="flex flex-col items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="w-full justify-between flex gap-3 min-w-0 flex-1">
        <Badge variant={badgeVariantMap[type]} size="lg">
          {badgeLabelMap[type]}
        </Badge>

        <div className="mt-5 flex lg:mt-0 lg:ml-2 w-1/3 justify-end">
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Edit transaction: ${description}`}
            onClick={() => onEdit(id)}
            leftIcon={<Pencil size={24} />}
          />

          <Button
            variant="ghost"
            size="sm"
            aria-label={`Delete transaction: ${description}`}
            onClick={() => onDelete(id)}
            leftIcon={<Trash2 size={24} />}
          />
        </div>
      </div>

      <div className="w-full flex justify-between h-[-webkit-fill-available] items-end justify-between gap-2 shrink-0">
        <div className="flex">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 max-w-xs md:max-w-40">
              {description}
            </p>
            <p className="text-xs text-gray-500">{formatDate(date)}</p>
          </div>
        </div>
        <span className={`text-sm font-semibold ${amountColorMap[type]}`}>
          {amountPrefixMap[type]} {formatCurrency(amount, true)}
        </span>
      </div>
    </li>
  );
}
