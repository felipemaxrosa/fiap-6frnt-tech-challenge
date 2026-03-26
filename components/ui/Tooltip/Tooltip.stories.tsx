import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tooltip } from './Tooltip';
import { Button } from '@/components/ui/Button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    content: 'Tooltip message',
    position: 'top',
    children: <Button>Hover me</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip message',
    position: 'bottom',
    children: <Button>Hover me</Button>,
  },
};

export const Left: Story = {
  args: {
    content: 'Tooltip message',
    position: 'left',
    children: <Button>Hover me</Button>,
  },
};

export const Right: Story = {
  args: {
    content: 'Tooltip message',
    position: 'right',
    children: <Button>Hover me</Button>,
  },
};
