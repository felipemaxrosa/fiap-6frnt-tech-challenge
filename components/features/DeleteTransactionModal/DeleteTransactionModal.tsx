'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/format';
import {
  AMOUNT_COLOR_MAP,
  AMOUNT_PREFIX_MAP,
  BADGE_LABEL_MAP,
  BADGE_VARIANT_MAP,
} from '@/shared/constants/transaction';
import type { DeleteTransactionModalProps } from './IDeleteTransactionModal';

export function DeleteTransactionModal({
  transaction,
  onConfirm,
  onCancel,
}: DeleteTransactionModalProps) {
  return (
    <Modal isOpen={transaction !== null} onClose={onCancel} title="Excluir transação">
      <p className="body-default text-content-secondary mb-lg">
        Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
      </p>

      {transaction && (
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
            <span className="label-default text-content-secondary">
              {formatDate(transaction.date)}
            </span>
            <span className={`body-semibold ${AMOUNT_COLOR_MAP[transaction.type]}`}>
              {formatCurrency(transaction.amount)}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-sm">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Excluir
        </Button>
      </div>
    </Modal>
  );
}
