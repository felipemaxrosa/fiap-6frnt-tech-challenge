'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency, formatTodayDate } from '@/lib/format';
import type { BalanceCardProps } from './IBalanceCard';

export function BalanceCard({ balance, owner, label = 'Conta Corrente' }: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-default flex flex-col sm:flex-row sm:justify-between bg-brand-dark p-lg text-content-inverse shadow-card">
      {/* Left section: greeting + date (+ illustration on desktop) */}
      <div className="relative z-10 flex flex-col items-center sm:items-start">
        {owner && <h1 className="mb-xs text-xl font-semibold">Olá, {owner}! :)</h1>}
        <p className="mb-lg text-sm opacity-60">{formatTodayDate()}</p>
        {/* Desktop: illustration */}
        <Image
          src="/images/balance-card-illustration.png"
          alt=""
          width={280}
          height={200}
          className="mt-auto hidden sm:block"
          aria-hidden="true"
        />
      </div>

      {/* Right section: balance info */}
      <div className="relative z-10 min-w-44 mx-auto flex flex-col items-start sm:items-end sm:min-w-56 gap-sm sm:justify-center">
        <h2 className="flex items-center gap-sm text-lg font-normal">
          Saldo
          <button
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Esconder saldo' : 'Mostrar saldo'}
            className="rounded p-0.5 transition-opacity hover:opacity-80"
          >
            {visible ? (
              <Eye size={18} className="text-icon-accent" />
            ) : (
              <EyeOff size={18} className="text-icon-accent" />
            )}
          </button>
        </h2>

        {/* Red separator line */}
        <hr className="w-full border-t-2 border-feedback-danger" />

        <p className="text-base font-normal">{label}</p>
        <span className="text-xl font-bold tracking-tight">
          {visible ? formatCurrency(balance, true) : 'R$ ••••••'}
        </span>
      </div>

      {/* Mobile: illustration */}
      <Image
        src="/images/balance-card-illustration.png"
        alt=""
        width={280}
        height={200}
        className="relative z-10 mt-lg self-center sm:hidden"
        aria-hidden="true"
      />
    </div>
  );
}
