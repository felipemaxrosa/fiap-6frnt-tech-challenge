import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta = {
  title: 'Foundations/Spacing',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Spacing token documentation with practical Tailwind usage examples for margin, padding, and width utilities.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const spacingTokens = [
  {
    name: 'XS',
    token: '--spacing-xs',
    value: '0.25rem',
    marginClass: 'm-xs',
    paddingClass: 'p-xs',
    widthClass: 'w-xs',
  },
  {
    name: 'SM',
    token: '--spacing-sm',
    value: '0.5rem',
    marginClass: 'm-sm',
    paddingClass: 'p-sm',
    widthClass: 'w-sm',
  },
  {
    name: 'MD',
    token: '--spacing-md',
    value: '0.75rem',
    marginClass: 'm-md',
    paddingClass: 'p-md',
    widthClass: 'w-md',
  },
  {
    name: 'LG',
    token: '--spacing-lg',
    value: '1rem',
    marginClass: 'm-lg',
    paddingClass: 'p-lg',
    widthClass: 'w-lg',
  },
  {
    name: 'XL',
    token: '--spacing-xl',
    value: '1.5rem',
    marginClass: 'm-xl',
    paddingClass: 'p-xl',
    widthClass: 'w-xl',
  },
  {
    name: '2XL',
    token: '--spacing-2xl',
    value: '2rem',
    marginClass: 'm-2xl',
    paddingClass: 'p-2xl',
    widthClass: 'w-2xl',
  },
];

export const Reference: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Spacing Scale</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {spacingTokens.map((item) => (
            <div key={item.token} className="rounded-lg border border-border bg-surface p-4">
              <p className="text-sm font-semibold text-content-primary">{item.name}</p>
              <p className="text-xs text-content-secondary">{item.token}</p>
              <p className="text-xs text-content-secondary">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Margin Usage</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {spacingTokens.map((item) => (
            <div
              key={item.marginClass}
              className="rounded-default border overflow-hidden border-border bg-surface flex flex-col justify-between items-stretch"
            >
              <div className="p-4 flex justify-center">
                <div className="rounded-default bg-orange-200 bg-size-[8px_8px] text-content-inverse/80 bg-top-left bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)]">
                  <div
                    className={
                      'h-15 w-15 bg-neutral-600 text-xs grid content-center rounded-md text-center ' +
                      item.marginClass
                    }
                  >
                    {item.value}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border flex flex-col gap-1 items-start">
                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  {item.marginClass}
                </code>

                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  <span className="text-neutral-400/70">&lt;</span>
                  <span className="text-pink-700">div</span>
                  <span className="text-cyan-800"> className</span>=
                  <span className="text-amber-700/90">&quot;{item.marginClass} ...&quot;</span>
                  <span className="text-neutral-400/70">&gt;</span>
                  <span>{item.value}</span>
                  <span className="text-neutral-400/70">&lt;/</span>
                  <span className="text-pink-700">div</span>
                  <span className="text-neutral-400/70">&gt;</span>
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Padding Usage</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {spacingTokens.map((item) => (
            <div
              key={item.paddingClass}
              className="rounded-default border overflow-hidden border-border bg-surface flex flex-col justify-between items-stretch"
            >
              <div className="p-4 flex justify-center">
                <div
                  className={`rounded-default bg-neutral-600 bg-size-[8px_8px] text-content-inverse/40 bg-top-left bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] ${item.paddingClass}`}
                >
                  <div className="h-15 w-15 bg-neutral-600 text-content-inverse/80 rounded-md text-xs grid content-center text-center">
                    {item.value}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border flex flex-col gap-1 items-start">
                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  {item.paddingClass}
                </code>

                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  <span className="text-neutral-400/70">&lt;</span>
                  <span className="text-pink-700">div</span>
                  <span className="text-cyan-800"> className</span>=
                  <span className="text-amber-700/90">&quot;{item.paddingClass} ...&quot;</span>
                  <span className="text-neutral-400/70">&gt;</span>
                  <span>{item.value}</span>
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
