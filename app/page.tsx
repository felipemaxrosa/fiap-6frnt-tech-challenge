'use client';
import { BalanceCard } from '@/components/features/BalanceCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { NewTransaction } from '@/components/features/NewTransaction';
import { TransactionList } from '@/components/features/TransactionList';
import { useTransactions } from '@/context/TransactionsContext';

export default function Home() {
  const { transactions, balance, isLoading } = useTransactions();

  return (
    <div className="flex flex-col gap-lg lg:flex-row lg:items-start">
      <div className="flex flex-col gap-lg lg:flex-1">
        {isLoading ? (
          <Skeleton className=" h-134.5 md:h-91 w-full rounded-xl" />
        ) : (
          <BalanceCard balance={balance} owner="Joana" />
        )}

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
        title="Extrato"
        className="lg:w-80 lg:shrink-0"
      />
    </div>
  );
}
