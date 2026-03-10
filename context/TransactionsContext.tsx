'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Transaction, NewTransaction, UpdateTransaction } from '@/types';
import { calculateBalance, getRecent, getAll } from '@/lib/transactions';
import { TransactionService } from '@/services';

interface TransactionsContextValue {
  transactions: Transaction[];
  balance: number;
  recentTransactions: Transaction[];
  isLoading: boolean;
  addTransaction: (data: NewTransaction) => Promise<void>;
  updateTransaction: (id: string, data: UpdateTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTransactions() {
    try {
      const data = await TransactionService.getAll();
      setTransactions(data);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (data: NewTransaction) => {
    const created = await TransactionService.create(data);
    setTransactions((prev) => [...prev, created]);
  };

  const updateTransaction = async (id: string, data: UpdateTransaction) => {
    const updated = await TransactionService.update(id, data);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTransaction = async (id: string) => {
    await TransactionService.remove(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions: getAll(transactions),
        balance: calculateBalance(transactions),
        recentTransactions: getRecent(transactions),
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions must be used inside <TransactionsProvider>');
  return ctx;
}
