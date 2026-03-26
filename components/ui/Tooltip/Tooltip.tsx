import { cn } from '@/lib/classes';
import type { TooltipProps } from './ITooltip';

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-xs',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-xs',
  left: 'right-full top-1/2 -translate-y-1/2 mr-xs',
  right: 'left-full top-1/2 -translate-y-1/2 ml-xs',
};

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  return (
    <div className="relative inline-flex group">
      {children}
      <div
        role="tooltip"
        className={cn(
          'absolute z-50 whitespace-nowrap px-md py-sm',
          'label-default text-content-inverse',
          'bg-brand-dark rounded-default',
          'opacity-0 pointer-events-none',
          'group-hover:opacity-100 transition-opacity duration-150',
          positionStyles[position]
        )}
      >
        {content}
      </div>
    </div>
  );
}
