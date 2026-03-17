import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Income: Story = { args: { variant: 'income', children: 'Income', dot: true } };
export const Expense: Story = { args: { variant: 'expense', children: 'Expense', dot: true } };
export const Transfer: Story = { args: { variant: 'transfer', children: 'Transfer', dot: true } };
export const Neutral: Story = { args: { variant: 'neutral', children: 'Pending' } };
export const Small: Story = {
  args: { variant: 'income', children: 'Income', size: 'sm', dot: true },
};
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="income" dot>
        Income
      </Badge>
      <Badge variant="expense" dot>
        Expense
      </Badge>
      <Badge variant="transfer" dot>
        Transfer
      </Badge>
      <Badge variant="neutral">Pending</Badge>
    </div>
  ),
};
