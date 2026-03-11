'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { TRANSACTION_TYPE } from '@/shared/constants/transaction';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Transaction, TransactionType } from '@/types';

export interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

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

const badgeColorMap: Record<TransactionType, string> = {
  [TRANSACTION_TYPE.DEPOSIT]: 'bg-green-100 text-green-700',
  [TRANSACTION_TYPE.WITHDRAWAL]: 'bg-red-100 text-red-700',
  [TRANSACTION_TYPE.TRANSFER]: 'bg-amber-100 text-amber-700',
};

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const { id, type, description, amount, date } = transaction;

  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* TODO: replace with <Badge variant={badgeVariant} dot size="sm" /> from components/ui/Badge */}

        <div className="min-w-0">
          <span
            className={`mb-3 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeColorMap[type]}`}
          >
            {badgeLabelMap[type]}
          </span>
          <p className="truncate text-sm font-medium text-gray-900 max-w-xs md:max-w-40">
            {description}
          </p>
          <p className="text-xs text-gray-500">{formatDate(date)}</p>
        </div>
      </div>

      <div className="flex flex-col h-[-webkit-fill-available] items-end justify-between gap-2 shrink-0">
        <div className="flex">
          {onEdit && (
            // TODO: replace with <Button variant="ghost" size="sm" leftIcon={<Pencil />} /> from components/ui/Button
            <button
              aria-label={`Edit transaction: ${description}`}
              onClick={() => onEdit(id)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <Pencil size={14} />
            </button>
          )}

          {onDelete && (
            // TODO: replace with <Button variant="ghost" size="sm" leftIcon={<Trash2 />} /> from components/ui/Button
            <button
              aria-label={`Delete transaction: ${description}`}
              onClick={() => onDelete(id)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <span className={`text-sm font-semibold ${amountColorMap[type]}`}>
          {amountPrefixMap[type]} {formatCurrency(amount)}
        </span>
      </div>
    </li>
  );
}
