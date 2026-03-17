import { cn } from '@/lib/utils';
import { BadgeProps } from './types';

const variantStyles = {
  income: 'bg-income-bg   text-income   border-green-200',
  expense: 'bg-expense-bg  text-expense  border-red-200',
  transfer: 'bg-transfer-bg text-transfer border-yellow-200',
  neutral: 'bg-gray-100    text-gray-600  border-gray-200',
};

const dotColors = {
  income: 'bg-income',
  expense: 'bg-expense',
  transfer: 'bg-transfer',
  neutral: 'bg-gray-400',
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  const isSmall = () => {
    let relativeSize = '';
    switch (size) {
      case 'sm':
        relativeSize = 'px-2 py-0.5 text-xs';
        break;
      case 'md':
        relativeSize = 'px-2.5 py-1 text-sm';
        break;
      case 'lg':
        relativeSize = 'px-4 py-2 text-md';
        break;
      case 'xl':
        relativeSize = 'px-6 py-3 text-lg';
    }

    return relativeSize;
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        variantStyles[variant],
        isSmall(),
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}
