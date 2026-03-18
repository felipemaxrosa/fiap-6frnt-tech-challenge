'use client';

import { useState } from 'react';
import { TRANSACTION_TYPE_OPTIONS } from '@/shared/constants/transaction';
import type { NewTransactionData, NewTransactionProps } from './INewTransaction';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';

export function NewTransaction({ onSubmit, loading = false }: NewTransactionProps) {
  const [type, setType] = useState<NewTransactionData['type'] | ''>('');
  const [amount, setAmount] = useState<number>(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type || !amount || amount <= 0) return;
    await onSubmit?.({ type: type as NewTransactionData['type'], amount });
    setType('');
    setAmount(0);
  }

  const isDisabled = !type || !amount || amount <= 0 || loading;

  return (
    <Card padding="lg">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Nova transação</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          placeholder="Selecione o tipo de transação"
          options={TRANSACTION_TYPE_OPTIONS}
          value={type}
          onChange={(value) => setType(value as NewTransactionData['type'] | '')}
        />

        <div className="w-2/3 flex flex-col gap-12">
          <CurrencyInput
            label="Valor"
            value={amount}
            onValueChange={setAmount}
            currency="R$"
            placeholder="0,00"
            disabled={loading}
          />

          <Button type="submit" fullWidth loading={loading} disabled={isDisabled}>
            {loading ? 'Salvando…' : 'Concluir transação'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
