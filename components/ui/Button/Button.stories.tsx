import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Plus } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: 'Confirm', variant: 'primary' } };
export const Secondary: Story = { args: { children: 'Cancel', variant: 'secondary' } };
export const Danger: Story = { args: { children: 'Delete', variant: 'danger' } };
export const Ghost: Story = { args: { children: 'View more', variant: 'ghost' } };
export const WithIcon: Story = {
  args: { children: 'New transaction', leftIcon: <Plus size={16} /> },
};
export const Loading: Story = { args: { children: 'Saving...', loading: true } };
export const Disabled: Story = { args: { children: 'Unavailable', disabled: true } };
export const FullWidth: Story = { args: { children: 'Sign in', fullWidth: true } };
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
