import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/format';
import { BADGE_LABEL_MAP, BADGE_VARIANT_MAP } from '@/shared/constants/transaction';
import type { TransactionInfoProps } from './ITransactionInfo';

export function TransactionInfo({ transaction }: TransactionInfoProps) {
  return (
    <div className="flex flex-col gap-sm rounded-default bg-background p-lg mb-xl">
      <div className="flex items-center justify-between gap-sm">
        <span className="body-default text-content-primary truncate min-w-0">
          {transaction.description}
        </span>
        <Badge variant={BADGE_VARIANT_MAP[transaction.type]}>
          {BADGE_LABEL_MAP[transaction.type]}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="label-default text-content-secondary">{formatDate(transaction.date)}</span>
        <span className="body-semibold">{formatCurrency(transaction.amount)}</span>
      </div>
    </div>
  );
}
