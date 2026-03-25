'use client';

import { Button } from '@/components/ui/Button';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useRef } from 'react';
import {
  ConfirmTransactionModal,
  type ConfirmTransactionModalRef,
} from './ConfirmTransactionModal';

const ConfirmTransactionModalComponent = () => {
  const ref = useRef<ConfirmTransactionModalRef>(null);

  return (
    <div className="space-y-4">
      <Button onClick={() => ref.current?.open()}>Abrir Modal</Button>
      <ConfirmTransactionModal ref={ref} onConfirm={() => alert('Confirmado!')} />
    </div>
  );
};

const meta: Meta<typeof ConfirmTransactionModal> = {
  component: ConfirmTransactionModal,
  title: 'Features/NewTransaction/ConfirmTransactionModal',
  tags: ['autodocs'],
  render: () => <ConfirmTransactionModalComponent />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onConfirm: () => console.log('Confirmado'),
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    onConfirm: () => console.log('Confirmando...'),
    isSubmitting: true,
  },
  render: () => {
    const ref = useRef<ConfirmTransactionModalRef>(null);

    return (
      <div className="space-y-4">
        <Button onClick={() => ref.current?.open()}>Abrir Modal (Submitting)</Button>
        <ConfirmTransactionModal ref={ref} onConfirm={() => {}} isSubmitting={true} />
      </div>
    );
  },
};
