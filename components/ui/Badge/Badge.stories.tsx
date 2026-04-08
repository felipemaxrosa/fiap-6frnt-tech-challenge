import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Income: Story = { args: { variant: 'income', children: 'Income' } };
export const Expense: Story = { args: { variant: 'expense', children: 'Expense' } };
export const Transfer: Story = { args: { variant: 'transfer', children: 'Transfer' } };
export const Small: Story = {
  args: { variant: 'income', children: 'Income', size: 'sm' },
};
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="income">Income</Badge>
      <Badge variant="expense">Expense</Badge>
      <Badge variant="transfer">Transfer</Badge>
    </div>
  ),
};
