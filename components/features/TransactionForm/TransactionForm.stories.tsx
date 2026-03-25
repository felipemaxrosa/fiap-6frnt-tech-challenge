import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { TransactionFormValues } from './ITransactionForm';
import { TransactionForm } from './TransactionForm';

const meta: Meta<typeof TransactionForm> = {
  component: TransactionForm,
  title: 'Features/TransactionForm',
  tags: ['autodocs'],
  args: {
    onSubmit: (data: TransactionFormValues) => console.log('Form submitted:', data),
    onCancel: () => console.log('Form cancelled'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
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
