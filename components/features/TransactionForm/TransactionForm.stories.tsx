import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { TransactionForm } from './TransactionForm';

const meta: Meta<typeof TransactionForm> = {
  component: TransactionForm,
  title: 'Features/TransactionForm',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Form used to create or edit transactions, including type, amount, date, description, validation, and submitting state.',
      },
    },
  },
  args: {
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Empty initial state for creating a new transaction.',
      },
    },
  },
};

export const PrefilledDeposit: Story = {
  args: {
    initialValues: {
      type: 'deposit',
      amount: 5000,
      date: '2025-03-05',
      description: 'Depósito inicial',
    },
  },
};

export const PrefilledWithdrawal: Story = {
  args: {
    initialValues: {
      type: 'withdrawal',
      amount: 120.5,
      date: '2025-03-07',
      description: 'Saque para compras',
    },
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};
