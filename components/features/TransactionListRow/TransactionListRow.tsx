'use client';

import { Pencil, Trash2 } from 'lucide-react';
import {
  AMOUNT_COLOR_MAP,
  AMOUNT_PREFIX_MAP,
  BADGE_LABEL_MAP,
  BADGE_VARIANT_MAP,
} from '@/shared/constants/transaction';
import { formatCurrency, formatDate } from '@/lib/format';
import type { TransactionListRowProps } from './ITransactionListRow';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function TransactionListRow({ transaction, onEdit, onDelete }: TransactionListRowProps) {
  const { id, type, description, amount, date } = transaction;

  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
      {/* Left: Badge + Description + Date */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Badge variant={BADGE_VARIANT_MAP[type]} size="md" className="min-w-28 flex justify-center">
          {BADGE_LABEL_MAP[type]}
        </Badge>

        <div className="min-w-0">
          <p className="truncate text-md font-medium text-gray-900">{description}</p>
          <p className="text-xs text-gray-500">{formatDate(date)}</p>
        </div>
      </div>

      {/* Right: Value + Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <span className={`text-lg font-semibold ${AMOUNT_COLOR_MAP[type]}`}>
          {AMOUNT_PREFIX_MAP[type]} {formatCurrency(amount, true)}
        </span>

        <Button
          variant="ghost"
          size="sm"
          aria-label={`Editar transação: ${description}`}
          onClick={() => onEdit(id)}
          leftIcon={<Pencil size={16} />}
        />

        <Button
          variant="ghost"
          size="sm"
          aria-label={`Excluir transação: ${description}`}
          onClick={() => onDelete(id)}
          leftIcon={<Trash2 size={16} />}
        />
      </div>
    </li>
  );
}
