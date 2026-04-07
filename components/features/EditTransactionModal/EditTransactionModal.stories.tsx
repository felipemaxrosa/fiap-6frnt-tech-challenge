import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { EditTransactionModal } from './EditTransactionModal';
import {
  EDIT_DEPOSIT_TRANSACTION,
  EDIT_LONG_DESCRIPTION_TRANSACTION,
  EDIT_WITHDRAWAL_TRANSACTION,
} from '../../../stories/mocks/transactions';

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
  name: 'Depósito',
  args: { transaction: EDIT_DEPOSIT_TRANSACTION },
};

export const Withdrawal: Story = {
  name: 'Saque',
  args: { transaction: EDIT_WITHDRAWAL_TRANSACTION },
};

export const LongDescription: Story = {
  name: 'Descrição longa',
  args: { transaction: EDIT_LONG_DESCRIPTION_TRANSACTION },
};

export const Submitting: Story = {
  name: 'Atualizando',
  args: {
    transaction: EDIT_DEPOSIT_TRANSACTION,
    isSubmitting: true,
  },
};

export const Closed: Story = {
  name: 'Fechado',
  args: { transaction: null },
};

export const AccessibilityKeyboardFocus: Story = {
  name: 'Accessibility: Keyboard / Escape',
  args: {
    transaction: EDIT_DEPOSIT_TRANSACTION,
    onConfirm: fn(),
    onCancel: fn(),
    isSubmitting: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A11y check: editing dialog supports keyboard interaction and Escape invokes cancel.',
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
