export interface BadgeProps {
  variant?: 'income' | 'expense' | 'transfer' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}
