'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formatCurrency, formatTodayDate } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { BalanceCardProps } from './IBalanceCard';

export function BalanceCard({ balance, owner, label = 'Conta Corrente' }: BalanceCardProps) {
  const isPositive = balance >= 0;
  const [visible, setVisible] = useState(true);

  return (
    <Card padding="lg" className="relative overflow-hidden mb-sm bg-brand-dark! text-text-on-bg">
      <img
        src="/pixels.png"
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-42 h-auto pointer-events-none select-none"
      />
      <img
        src="/pixels.png"
        aria-hidden="true"
        className="absolute top-0 right-0 w-42 h-auto pointer-events-none select-none rotate-180"
      />

      <div className="relative flex gap-lg flex-1">
        <div className="flex flex-col">
          {owner && <h1 className="text-xl font-semibold mb-sm">Olá, {owner}! :)</h1>}

          <p className="text-sm mb-lg">{formatTodayDate()}</p>

          <img
            src="/piggy-bank.png"
            aria-hidden="true"
            className="pointer-events-none select-none"
            style={{ width: 283, height: 228.17 }}
          />
        </div>

        <div className="flex flex-col items-start mt-sm gap-sm w-fit p-2xl self-start mx-auto">
          <div className="flex items-center gap-sm">
            <span className="text-base">Saldo</span>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={
                visible ? (
                  <Eye size={20} className="text-icon-accent" />
                ) : (
                  <EyeOff size={20} className="text-icon-accent" />
                )
              }
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'Ocultar saldo' : 'Exibir saldo'}
              className="hover:bg-transparent p-xs"
            />
          </div>

          <span className="block h-px w-full bg-icon-accent" />

          <p className="text-base">{label}</p>

          <span className={`text-xl font-bold ${!isPositive ? 'text-feedback-danger' : ''}`}>
            {visible ? formatCurrency(balance, true) : 'R$ ••••••'}
          </span>
        </div>
      </div>
    </Card>
  );
}
