import type { Metadata } from 'next';
import { TransactionsProvider } from '@/context/TransactionsContext';
import { Header } from '@/components/ui/Header';
import { Sidebar } from '@/components/ui/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bytebank',
  description: 'Seu banco digital',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning>
        <TransactionsProvider>
          <Header />

          {/* Tablet: horizontal nav (full width, above content) */}
          <div className="hidden sm:block lg:hidden bg-background border-b border-border">
            <div className="mx-auto max-w-[1200px]">
              <Sidebar />
            </div>
          </div>

          {/* Desktop + content area */}
          <div className="mx-auto flex max-w-[1200px] px-lg gap-lg">
            {/* Desktop: vertical sidebar */}
            <div className="hidden lg:block w-48 shrink-0">
              <Sidebar />
            </div>

            <main className="flex-1 py-lg">{children}</main>
          </div>
        </TransactionsProvider>
      </body>
    </html>
  );
}
