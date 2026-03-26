'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ConfirmTransactionModal } from './ConfirmTransactionModal';

const meta: Meta<typeof ConfirmTransactionModal> = {
  component: ConfirmTransactionModal,
  title: 'Features/ConfirmTransactionModal',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmTransactionModal>;

const mockTransaction = {
  type: 'deposit' as const,
  amount: 1500,
  date: '2026-03-26',
  description: 'Salário março',
};

export const Default: Story = {
  args: {
    isOpen: true,
    transaction: mockTransaction,
    onConfirm: () => console.log('Confirmado'),
    onCancel: () => console.log('Cancelado'),
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    isOpen: true,
    transaction: mockTransaction,
    onConfirm: () => {},
    onCancel: () => {},
    isSubmitting: true,
  },
};
