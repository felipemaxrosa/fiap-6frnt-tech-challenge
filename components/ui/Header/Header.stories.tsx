import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const CustomUser: Story = {
  args: { userName: 'Felipe Rosa' },
};
