import type { Transaction, NewTransaction, UpdateTransaction } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const TransactionService = {
  async getAll(): Promise<Transaction[]> {
    const res = await fetch(`${API_URL}/transactions`);
    return res.json();
  },

  async getById(id: string): Promise<Transaction> {
    const res = await fetch(`${API_URL}/transactions/${id}`);
    return res.json();
  },

  async create(data: NewTransaction): Promise<Transaction> {
    const res = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async update(id: string, data: UpdateTransaction): Promise<Transaction> {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async remove(id: string): Promise<void> {
    await fetch(`${API_URL}/transactions/${id}`, { method: 'DELETE' });
  },
};
