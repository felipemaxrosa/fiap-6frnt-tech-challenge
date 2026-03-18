'use client';
import { NewTransaction } from '@/components/features/NewTransaction';
import { TransactionList } from '@/components/features/TransactionList';
import { useTransactions } from '@/context/TransactionsContext';

export default function Home() {
  const { transactions } = useTransactions();

  return (
    <div className="flex flex-col gap-lg lg:flex-row lg:items-start">
      {/* Left column: balance + new transaction */}
      <div className="flex flex-col gap-lg lg:flex-1">
        {/* Task 2: <BalanceCard /> */}
        <div className="rounded-default border border-border bg-surface p-lg">BalanceCard</div>

        <NewTransaction
          onSubmit={(response) => {
            console.log(response);
          }}
        />
      </div>

      <TransactionList
        transactions={transactions}
        onEdit={(id) => console.log(id)}
        onDelete={(id) => console.log(id)}
      />
    </div>
  );
}
