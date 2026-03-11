'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';

export interface BalanceCardProps {
  balance: number;
  owner?: string;
  label?: string;
}

function formatTodayDate(): string {
  const now = new Date();
  const weekday = now.toLocaleDateString('pt-BR', { weekday: 'long' });
  const date = now.toLocaleDateString('pt-BR');
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${date}`;
}

export function BalanceCard({ balance, owner, label = 'Current balance' }: BalanceCardProps) {
  const isPositive = balance >= 0;
  const [visible, setVisible] = useState(true);

  return (
    // TODO: replace outer div with <Card padding="lg" /> from components/ui/Card
    <div className="rounded-xl flex justify-between bg-teal-800 p-6 text-white shadow-lg">
      <div className="flex flex-col">
        {owner && <h1 className="mb-1 text-lg font-medium opacity-75">Olá, {owner}! :)</h1>}
        <p className="mb-4 text-sm opacity-60">{formatTodayDate()}</p>
      </div>

      <div className="flex flex-col min-w-56 gap-2 justify-center">
        <h2 className="flex items-center gap-2 text-lg border-b pb-3 mb-3 border-white/20">
          Saldo
          {/* TODO: replace with <Button variant="ghost" size="sm" /> from components/ui/Button */}
          <button
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide balance' : 'Show balance'}
            className="rounded p-0.5 opacity-70 hover:opacity-100 transition-opacity"
          >
            {visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </h2>
        <p className="text-sm font-medium opacity-75">{label}</p>
        <div className="mt-1 flex items-center gap-2">
          {isPositive ? (
            <TrendingUp size={28} className="opacity-80" />
          ) : (
            <TrendingDown size={28} className="opacity-80" />
          )}
          <span
            className={`text-2xl tracking-tight md:text-3xl ${!isPositive ? 'text-red-300' : ''}`}
          >
            {visible
              ? balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : 'R$ ••••••'}
          </span>
        </div>
      </div>
    </div>
  );
}
