export interface BadgeProps {
  variant?: 'income' | 'expense' | 'transfer';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}
