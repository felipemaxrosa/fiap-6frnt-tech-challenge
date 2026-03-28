import type { Metadata } from 'next';
import { TransactionsProvider } from '@/context/TransactionsContext';
import { FeedbackProvider } from '@/context/FeedbackContext';
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
        <FeedbackProvider>
          <TransactionsProvider>
            <div className="flex flex-col h-screen">
              <Header />

              {/* Tablet: horizontal nav (full width, above content) */}
              <div className="hidden sm:block lg:hidden bg-background border-b border-border h-fit">
                <div className="mx-auto max-w-300 h-fit">
                  <Sidebar />
                </div>
              </div>

              {/* Desktop + content area */}
              <div className="mx-auto flex max-w-300 flex-col lg:flex-row p-lg gap-lg h-full w-full overflow-hidden">
                {/* Desktop: vertical sidebar */}
                <div className="hidden lg:block w-48 shrink-0">
                  <Sidebar />
                </div>

                <main className="h-full w-full overflow-auto">{children}</main>
              </div>
            </div>
          </TransactionsProvider>
        </FeedbackProvider>
      </body>
    </html>
  );
}
