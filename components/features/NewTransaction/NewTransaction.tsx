'use client';

import { useState } from 'react';
import { TRANSACTION_TYPE_OPTIONS } from '@/shared/constants/transaction';
import type { NewTransactionData, NewTransactionProps } from './INewTransaction';

export function NewTransaction({ onSubmit, loading = false }: NewTransactionProps) {
  const [type, setType] = useState<NewTransactionData['type'] | ''>('');
  const [amount, setAmount] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!type || !parsed || parsed <= 0) return;
    await onSubmit({ type: type as NewTransactionData['type'], amount: parsed });
    setType('');
    setAmount('');
  }

  const isDisabled = !type || !amount || parseFloat(amount.replace(',', '.')) <= 0 || loading;

  return (
    // TODO: replace outer div with <Card padding="lg" /> from components/ui/Card
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Nova transação</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* TODO: replace with <Select /> from components/ui/Select */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-tx-type" className="text-sm font-medium text-gray-700">
            Tipo de transação
          </label>
          <select
            id="new-tx-type"
            value={type}
            onChange={(e) => setType(e.target.value as NewTransactionData['type'])}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-600/50 focus:border-teal-600"
          >
            <option value="" disabled>
              Selecione o tipo de transação
            </option>
            {TRANSACTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* TODO: replace with <CurrencyInput /> from components/ui/CurrencyInput */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-tx-amount" className="text-sm font-medium text-gray-700">
            Valor
          </label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-teal-600/50 focus-within:border-teal-600">
            <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500 border-r border-gray-300">
              R$
            </span>
            <input
              id="new-tx-amount"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-3 py-2 text-sm text-gray-900 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* TODO: replace with <Button type="submit" fullWidth loading={loading} /> from components/ui/Button */}
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-600/50 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? 'Salvando…' : 'Concluir transação'}
        </button>
      </form>
    </div>
  );
}
