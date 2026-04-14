import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta = {
  title: 'Foundations/Shadows',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Shadow token documentation using Tailwind utility classes generated from design tokens.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const shadowTokens = [
  { name: 'Card', token: '--shadow-card', utilityClass: 'shadow-card' },
  {
    name: 'Card Hover',
    token: '--shadow-card-hover',
    utilityClass: 'shadow-card-hover',
  },
  { name: 'Tooltip', token: '--shadow-tooltip', utilityClass: 'shadow-tooltip' },
];

export const Reference: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Shadow Scale</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {shadowTokens.map((item) => (
            <div
              key={item.token}
              className="rounded-default border overflow-hidden border-border bg-surface flex flex-col justify-between items-stretch"
            >
              <div className="p-4 flex justify-center">
                <div className="w-full rounded-default p-lg">
                  <div className={`h-20 rounded-lg bg-surface ${item.utilityClass}`} />
                </div>
              </div>
              <div className="p-4 border-t border-border flex flex-col gap-1 items-start">
                <p className="text-sm font-semibold text-content-primary">{item.name}</p>
                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  {item.token}
                </code>
                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  {item.utilityClass}
                </code>
                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  <span className="text-neutral-400/70">&lt;</span>
                  <span className="text-pink-700">div</span>
                  <span className="text-cyan-800"> className</span>=
                  <span className="text-amber-700/90">&quot;{item.utilityClass} ...&quot;</span>
                  <span className="text-neutral-400/70">&gt;</span>
                  <span>shadow preview</span>
                  <span className="text-neutral-400/70">&lt;/</span>
                  <span className="text-pink-700">div</span>
                  <span className="text-neutral-400/70">&gt;</span>
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
