'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/classes';

export interface SidebarProps {
  onLinkClick?: () => void;
}

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/transferencias', label: 'Transferências' },
  { href: '/investimentos', label: 'Investimentos' },
  { href: '/outros-servicos', label: 'Outros Serviços' },
];

export function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal">
      {/* Mobile: vertical list (rendered inside Header drawer) */}
      <ul className="flex flex-col gap-xs px-lg py-lg sm:hidden">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                'block rounded-default px-md py-sm label-default',
                pathname === link.href
                  ? 'bg-surface text-content-primary font-semibold'
                  : 'text-content-inverse hover:text-content-inverse/80'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Tablet: horizontal tab bar */}
      <ul className="hidden sm:flex lg:hidden gap-xs px-lg py-sm">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'block rounded-default px-md py-sm label-default',
                pathname === link.href
                  ? 'bg-surface text-content-primary font-semibold shadow-card'
                  : 'text-content-secondary hover:text-content-primary'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop: vertical sidebar */}
      <ul className="hidden lg:flex flex-col gap-xs pt-lg">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'block rounded-default px-md py-sm label-default',
                pathname === link.href
                  ? 'bg-surface text-content-primary font-semibold shadow-card'
                  : 'text-content-secondary hover:text-content-primary'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
