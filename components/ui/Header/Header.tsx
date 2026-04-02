'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, UserCircle } from 'lucide-react';
import { Sidebar } from '@/components/ui/Sidebar';
import type { HeaderProps } from './IHeader';

export function Header({ userName = 'Joana da Silva Oliveira' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-brand-dark">
        <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-lg">
          {/* Logo */}
          <Link href="/" aria-label="Bytebank — página inicial">
            <Image src="/logo.svg" alt="Bytebank" width={120} height={32} priority />
          </Link>

          {/* User info — tablet and above */}
          <div className="hidden sm:flex items-center gap-sm text-content-inverse">
            <span className="label-default">{userName}</span>
            <UserCircle size={32} aria-hidden="true" />
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="sm:hidden rounded-default p-sm text-content-inverse cursor-pointer"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-16 z-30 bg-brand-dark sm:hidden h-fit"
          role="dialog"
          aria-label="Menu de navegação"
        >
          <Sidebar onLinkClick={() => setMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
