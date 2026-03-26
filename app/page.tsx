'use client';
import { BalanceCard } from '@/components/features/BalanceCard';
import { NewTransaction } from '@/components/features/NewTransaction';
import { TransactionList } from '@/components/features/TransactionList';
import { Button } from '@/components/ui/Button/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTransactions } from '@/context/TransactionsContext';
import Link from 'next/link';
import { useMemo } from 'react';

export default function Home() {
  const { transactions, balance, isLoading } = useTransactions();
  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <div className="flex flex-col gap-lg lg:flex-row lg:items-start">
      <div className="flex flex-col gap-lg lg:flex-1">
        {isLoading ? (
          <Skeleton className=" h-134.5 md:h-91 w-full rounded-xl" />
        ) : (
          <BalanceCard balance={balance} owner="Joana" />
        )}

        <NewTransaction />
      </div>

      <div className="lg:w-80 lg:shrink-0 flex flex-col gap-lg w-full">
        <TransactionList
          transactions={recentTransactions}
          onEdit={(id) => console.log(id)}
          onDelete={(id) => console.log(id)}
          title="Transações recentes"
          showActions={false}
          tooltipPosition="left"
          isLoading={isLoading}
        />

        <Link href="/transactions">
          <Button className="w-full" disabled={isLoading}>
            Todas as transações
          </Button>
        </Link>
      </div>
    </div>
  );
}
