import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton, SkeletonList } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Single: Story = {
  render: () => (
    <div className="flex flex-col gap-sm w-64">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
};

export const TransactionList: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <SkeletonList lines={4} />
    </div>
  ),
};

export const BalanceCardSkeleton: Story = {
  render: () => (
    <div className="w-72 rounded-default border border-border bg-surface p-lg shadow-card">
      <Skeleton className="h-3 w-24 mb-sm" />
      <Skeleton className="h-8 w-40" />
    </div>
  ),
};
