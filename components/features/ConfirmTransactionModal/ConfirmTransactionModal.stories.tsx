'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ConfirmTransactionModal } from './ConfirmTransactionModal';

const meta: Meta<typeof ConfirmTransactionModal> = {
  component: ConfirmTransactionModal,
  title: 'Features/ConfirmTransactionModal',
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    transaction: { control: 'object' },
    isSubmitting: { control: 'boolean' },
    onConfirm: { control: false },
    onCancel: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Modal that asks users to confirm a transaction before submission, showing the transaction summary and loading state.',
      },
    },
  },
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
    onConfirm: fn(),
    onCancel: fn(),
    isSubmitting: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default confirmation flow with transaction summary and active confirm/cancel actions.',
      },
    },
  },
};

export const Submitting: Story = {
  args: {
    isOpen: true,
    transaction: mockTransaction,
    onConfirm: fn(),
    onCancel: fn(),
    isSubmitting: true,
  },
};

export const AccessibilityKeyboardFocus: Story = {
  name: 'Accessibility: Keyboard / Escape',
  args: {
    isOpen: true,
    transaction: mockTransaction,
    onConfirm: fn(),
    onCancel: fn(),
    isSubmitting: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'A11y check: dialog is announced correctly and Escape closes via onCancel callback.',
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
