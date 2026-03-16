import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ReceiptText, SearchX } from 'lucide-react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoTransactions: Story = {
  args: {
    icon: <ReceiptText size={48} />,
    title: 'Nenhuma transação encontrada',
    description: 'Adicione sua primeira transação para começar.',
  },
};

export const NoResults: Story = {
  args: {
    icon: <SearchX size={48} />,
    title: 'Nenhum resultado',
    description: 'Tente ajustar os filtros.',
  },
};

export const TitleOnly: Story = {
  args: { title: 'Nada por aqui ainda.' },
};
