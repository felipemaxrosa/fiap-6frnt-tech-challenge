import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import type { Transaction } from '@/types';
import { EditTransactionModal } from './EditTransactionModal';

const DEPOSIT: Transaction = {
  id: '1',
  type: 'deposit',
  description: 'Salario mensal',
  amount: 5000,
  date: '2025-03-01',
};

const WITHDRAWAL: Transaction = {
  id: '2',
  type: 'withdrawal',
  description: 'Aluguel',
  amount: 1800,
  date: '2025-03-05',
};

const LONG_DESCRIPTION: Transaction = {
  id: '3',
  type: 'transfer',
  description: 'Transferencia para reserva de emergencia da conta conjunta',
  amount: 950.75,
  date: '2025-03-10',
};

const meta: Meta<typeof EditTransactionModal> = {
  title: 'Features/EditTransactionModal',
  component: EditTransactionModal,
  tags: ['autodocs'],
  args: {
    onConfirm: fn(),
    onCancel: fn(),
    isSubmitting: false,
  },
  argTypes: {
    onConfirm: { control: false },
    onCancel: { control: false },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Modal for editing an existing transaction. Reuses TransactionForm with prefilled values.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditTransactionModal>;

export const Deposit: Story = {
  name: 'Deposito',
  args: { transaction: DEPOSIT },
};

export const Withdrawal: Story = {
  name: 'Saque',
  args: { transaction: WITHDRAWAL },
};

export const LongDescription: Story = {
  name: 'Descricao longa',
  args: { transaction: LONG_DESCRIPTION },
};

export const Submitting: Story = {
  name: 'Atualizando',
  args: {
    transaction: DEPOSIT,
    isSubmitting: true,
  },
};

export const Closed: Story = {
  name: 'Fechado',
  args: { transaction: null },
};
