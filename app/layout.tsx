import type { Metadata } from 'next';
import { TransactionsProvider } from '@/context/TransactionsContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinTrack',
  description: 'Personal financial management app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <TransactionsProvider>{children}</TransactionsProvider>
      </body>
    </html>
  );
}
