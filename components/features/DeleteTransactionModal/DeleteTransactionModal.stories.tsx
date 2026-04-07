import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { Transaction } from '@/types';
import { DeleteTransactionModal } from './DeleteTransactionModal';

const DEPOSIT: Transaction = {
  id: '1',
  type: 'deposit',
  description: 'Salário mensal',
  amount: 5000,
  date: '2025-03-01',
};

const WITHDRAWAL: Transaction = {
  id: '2',
  type: 'withdrawal',
  description: 'Aluguel',
  amount: 1500,
  date: '2025-03-05',
};

const TRANSFER: Transaction = {
  id: '3',
  type: 'transfer',
  description: 'Transferência para conta poupança',
  amount: 800,
  date: '2025-03-10',
};

const LONG_DESCRIPTION: Transaction = {
  id: '4',
  type: 'withdrawal',
  description: 'Pagamento de fatura do cartão de crédito referente ao mês de fevereiro de 2025',
  amount: 3200,
  date: '2025-03-15',
};

const meta: Meta<typeof DeleteTransactionModal> = {
  title: 'Features/DeleteTransactionModal',
  component: DeleteTransactionModal,
  tags: ['autodocs'],
  args: {
    onConfirm: fn(),
    onCancel: fn(),
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
          'Confirmation modal before deleting a transaction. Shows transaction details so the user can verify before acting.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DeleteTransactionModal>;

export const Deposit: Story = {
  name: 'Depósito',
  args: { transaction: DEPOSIT },
  parameters: {
    docs: { description: { story: 'Confirming deletion of a deposit transaction.' } },
  },
};

export const Withdrawal: Story = {
  name: 'Saque',
  args: { transaction: WITHDRAWAL },
  parameters: {
    docs: { description: { story: 'Confirming deletion of a withdrawal transaction.' } },
  },
};

export const Transfer: Story = {
  name: 'Transferência',
  args: { transaction: TRANSFER },
  parameters: {
    docs: { description: { story: 'Confirming deletion of a transfer transaction.' } },
  },
};

export const LongDescription: Story = {
  name: 'Descrição longa',
  args: { transaction: LONG_DESCRIPTION },
  parameters: {
    docs: {
      description: { story: 'Long description is truncated with ellipsis to preserve layout.' },
    },
  },
};

export const Closed: Story = {
  name: 'Fechado',
  args: { transaction: null },
  parameters: {
    docs: { description: { story: 'Modal in closed state — nothing is rendered.' } },
  },
};

export const AccessibilityKeyboardFocus: Story = {
  name: 'Accessibility: Keyboard / Escape',
  args: {
    transaction: DEPOSIT,
    onConfirm: fn(),
    onCancel: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'A11y check: with modal open, Escape closes the dialog through the cancel callback.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    expect(canvas.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(args.onCancel).toHaveBeenCalled();
  },
};
