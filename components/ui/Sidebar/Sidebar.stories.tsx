import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const TabletHorizontal: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
};

export const DesktopVertical: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};
