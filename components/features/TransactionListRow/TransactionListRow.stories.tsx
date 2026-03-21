import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TransactionListRow } from './TransactionListRow';

const meta: Meta<typeof TransactionListRow> = {
  title: 'Features/TransactionListRow',
  component: TransactionListRow,
  tags: ['autodocs'],
  args: {
    onEdit: (id) => console.log('edit', id),
    onDelete: (id) => console.log('delete', id),
  },
  parameters: {
    docs: {
      description: {
        component:
          'A single transaction row with badge, description, date, amount, and action buttons.',
      },
    },
  },
  argTypes: {
    onEdit: { control: false },
    onDelete: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionListRow>;

export const Deposit: Story = {
  name: 'Deposit',
  args: {
    transaction: {
      id: '1',
      type: 'deposit',
      description: 'Salário mensal',
      amount: 5000,
      date: '2025-03-01',
    },
  },
  parameters: {
    docs: { description: { story: 'Deposit transaction with green amount.' } },
  },
};

export const Withdrawal: Story = {
  name: 'Withdrawal',
  args: {
    transaction: {
      id: '2',
      type: 'withdrawal',
      description: 'Aluguel',
      amount: 1500,
      date: '2025-03-05',
    },
  },
  parameters: {
    docs: { description: { story: 'Withdrawal transaction with red amount.' } },
  },
};

export const Transfer: Story = {
  name: 'Transfer',
  args: {
    transaction: {
      id: '3',
      type: 'transfer',
      description: 'Transferência para conta poupança',
      amount: 800,
      date: '2025-03-10',
    },
  },
  parameters: {
    docs: { description: { story: 'Transfer transaction with amber amount.' } },
  },
};

export const LongDescription: Story = {
  name: 'Long Description',
  args: {
    transaction: {
      id: '4',
      type: 'deposit',
      description:
        'Pagamento referente ao projeto de desenvolvimento de software para cliente externo',
      amount: 12000,
      date: '2025-03-15',
    },
  },
  parameters: {
    docs: { description: { story: 'Long description truncates with ellipsis.' } },
  },
};
