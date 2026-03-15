import { cn } from '@/lib/classes';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-md py-16 text-center',
        className
      )}
    >
      {icon && <div className="text-content-secondary">{icon}</div>}
      <div className="flex flex-col gap-xs">
        <p className="body-semibold text-content-primary">{title}</p>
        {description && <p className="label-default text-content-secondary">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
