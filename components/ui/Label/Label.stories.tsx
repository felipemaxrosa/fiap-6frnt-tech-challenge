import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = { args: { children: 'Email' } };
export const Required: Story = { args: { children: 'Email', required: true } };
