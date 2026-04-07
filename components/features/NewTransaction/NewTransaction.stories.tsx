import { FeedbackProvider } from '@/context/FeedbackContext';
import { TransactionsProvider } from '@/context/TransactionsContext';
import type { Meta, StoryObj, Decorator } from '@storybook/nextjs-vite';
import { ReactElement } from 'react';
import { NewTransaction } from './NewTransaction';

const meta: Meta<typeof NewTransaction> = {
  component: NewTransaction,
  title: 'Features/NewTransaction',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Feature section for creating a transaction, combining TransactionForm and confirmation flow with feedback/context providers.',
      },
    },
  },
  decorators: [
    ((Story): ReactElement => (
      <FeedbackProvider>
        <TransactionsProvider>
          <Story />
        </TransactionsProvider>
      </FeedbackProvider>
    )) as Decorator,
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
