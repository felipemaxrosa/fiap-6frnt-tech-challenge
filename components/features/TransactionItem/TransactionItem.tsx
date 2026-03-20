'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/classes';
import {
  AMOUNT_COLOR_MAP,
  AMOUNT_PREFIX_MAP,
  BADGE_LABEL_MAP,
  BADGE_VARIANT_MAP,
} from '@/shared/constants/transaction';
import { formatCurrency, formatDate } from '@/lib/format';
import type { TransactionItemProps } from './ITransactionItem';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
  className,
}: TransactionItemProps) {
  const { id, type, description, amount, date } = transaction;

  return (
    <li
      className={cn(
        'flex flex-col items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="w-full justify-between flex gap-3 min-w-0 flex-1">
        <Badge variant={BADGE_VARIANT_MAP[type]} size="lg">
          {BADGE_LABEL_MAP[type]}
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
        <span className={`text-sm font-semibold ${AMOUNT_COLOR_MAP[type]}`}>
          {AMOUNT_PREFIX_MAP[type]} {formatCurrency(amount, true)}
        </span>
      </div>
    </li>
  );
}
