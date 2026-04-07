import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DollarSign } from 'lucide-react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Text input field with label, helper text, validation state, addons, and clear interaction support.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { label: 'Description', placeholder: 'e.g. Salary' } };
export const WithError: Story = {
  args: { label: 'Amount', error: true, helperText: 'This field is required', placeholder: '0.00' },
};
export const WithSuccess: Story = {
  args: { label: 'Email', success: true, helperText: 'Valid email', value: 'user@email.com' },
};
export const Disabled: Story = { args: { label: 'ID', disabled: true, value: '00123' } };
export const TypeDate: Story = { args: { label: 'Date', type: 'date' } };
export const TypeNumber: Story = { args: { label: 'Amount', type: 'number', placeholder: '0' } };
export const WithLeftAddon: Story = {
  args: {
    label: 'Amount',
    leftAddon: <DollarSign size={16} />,
    placeholder: '0.00',
    type: 'number',
  },
};
