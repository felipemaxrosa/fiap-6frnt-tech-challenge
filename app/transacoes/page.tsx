'use client';

import { TransactionsTable } from '@/components/features/TransactionsTable';
import { TransactionFilters } from '@/components/features/TransactionFilters';
import { useTransactions } from '@/context/TransactionsContext';
import { useTransactionFilters } from '@/hooks';

export default function TransacoesPage() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const { filters, setFilters, filtered } = useTransactionFilters(transactions);

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="heading-default text-content-primary text-xl">Transações</h1>

      <TransactionFilters value={filters} onChange={setFilters} />

      <TransactionsTable
        transactions={filtered}
        isLoading={isLoading}
        onEdit={(id) => console.log('edit', id)}
        onDelete={deleteTransaction}
        emptyMessage="Nenhuma transação encontrada para os filtros selecionados."
      />
    </div>
  );
}
