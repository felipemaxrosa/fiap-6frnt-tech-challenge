import { NewTransaction } from '@/components/features/NewTransaction';
import { TransactionList } from '@/components/features/TransactionList';
import { transactions } from '@/data/transactions.json';
import { Transaction } from '@/types/transaction';

export default function Home() {
  return (
    <div className="flex flex-col gap-lg lg:flex-row lg:items-start">
      {/* Left column: balance + new transaction */}
      <div className="flex flex-col gap-lg lg:flex-1">
        {/* Task 2: <BalanceCard /> */}
        <div className="rounded-default border border-border bg-surface p-lg">BalanceCard</div>

        <NewTransaction />
      </div>

      <TransactionList transactions={transactions as Transaction[]} />
    </div>
  );
}
