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

const desktopDecorator: Story['decorators'] = [
  (Story) => (
    <div className="w-48 bg-background p-lg min-h-screen">
      <Story />
    </div>
  ),
];

const mobileDecorator: Story['decorators'] = [
  (Story) => (
    <div className="bg-brand-dark min-h-screen">
      <Story />
    </div>
  ),
];

// ─── Desktop — active item variants ────────────────────────────────────────

export const DesktopInicio: Story = {
  name: 'Desktop — Início (active)',
  args: { activePath: '/' },
  globals: { viewport: { value: 'desktop' } },
  decorators: desktopDecorator,
};

export const DesktopTransferencias: Story = {
  name: 'Desktop — Transferências (active)',
  args: { activePath: '/transferencias' },
  globals: { viewport: { value: 'desktop' } },
  decorators: desktopDecorator,
};

// ─── Mobile (drawer) ────────────────────────────────────────────────────────

export const MobileInicio: Story = {
  name: 'Mobile — Início (active)',
  args: { activePath: '/' },
  globals: { viewport: { value: 'mobile' } },
  decorators: mobileDecorator,
};

export const MobileTransferencias: Story = {
  name: 'Mobile — Transferências (active)',
  args: { activePath: '/transferencias' },
  globals: { viewport: { value: 'mobile' } },
  decorators: mobileDecorator,
};

// ─── Tablet ─────────────────────────────────────────────────────────────────

export const TabletInicio: Story = {
  name: 'Tablet — Início (active)',
  args: { activePath: '/' },
  globals: { viewport: { value: 'tablet' } },
};

export const TabletTransferencias: Story = {
  name: 'Tablet — Transferências (active)',
  args: { activePath: '/transferencias' },
  globals: { viewport: { value: 'tablet' } },
};
