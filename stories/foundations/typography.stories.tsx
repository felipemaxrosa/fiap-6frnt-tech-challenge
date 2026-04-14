import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Typography token documentation using Tailwind utility classes generated from the design tokens.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const fontFamilyTokens = [{ name: 'Sans', token: '--font-sans', utilityClass: 'font-sans' }];

const fontSizeTokens = [
  {
    name: 'Small',
    token: '--text-sm',
    value: '0.8125rem (13px)',
    utilityClass: 'text-sm',
  },
  {
    name: 'Base',
    token: '--text-base',
    value: '1rem (16px)',
    utilityClass: 'text-base',
  },
  {
    name: 'Large',
    token: '--text-lg',
    value: '1.25rem (20px)',
    utilityClass: 'text-lg',
  },
  {
    name: 'Extra Large',
    token: '--text-xl',
    value: '1.5625rem (25px)',
    utilityClass: 'text-xl',
  },
];

export const Reference: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Font Family</h3>
        <div className="grid gap-4">
          {fontFamilyTokens.map((item) => (
            <div
              key={item.token}
              className="rounded-default border overflow-hidden border-border bg-surface flex flex-col justify-between items-stretch"
            >
              <div className="p-4 flex justify-center">
                <div className="w-full rounded-default p-lg">
                  <p className={`text-content-primary ${item.utilityClass}`}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
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
                  <span className="text-pink-700">p</span>
                  <span className="text-cyan-800"> className</span>=
                  <span className="text-amber-700/90">&quot;{item.utilityClass}&quot;</span>
                  <span className="text-neutral-400/70">&gt;</span>
                  <span>Sample text</span>
                  <span className="text-neutral-400/70">&lt;/</span>
                  <span className="text-pink-700">p</span>
                  <span className="text-neutral-400/70">&gt;</span>
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Font Sizes</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {fontSizeTokens.map((item) => (
            <div
              key={item.token}
              className="rounded-default border overflow-hidden border-border bg-surface flex flex-col justify-between items-stretch"
            >
              <div className="p-4 flex justify-center">
                <div className="w-full rounded-default p-lg">
                  <p className={`text-content-primary ${item.utilityClass}`}>
                    Token preview sample text
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-border flex flex-col gap-1 items-start">
                <p className="text-sm font-semibold text-content-primary">{item.name}</p>
                <p className="text-xs text-content-secondary">{item.value}</p>
                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  {item.token}
                </code>
                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  {item.utilityClass}
                </code>
                <code className="inline-block rounded-md bg-background/80 px-2 py-1 text-xs text-content-secondary">
                  <span className="text-neutral-400/70">&lt;</span>
                  <span className="text-pink-700">p</span>
                  <span className="text-cyan-800"> className</span>=
                  <span className="text-amber-700/90">&quot;{item.utilityClass}&quot;</span>
                  <span className="text-neutral-400/70">&gt;</span>
                  <span>{item.value}</span>
                  <span className="text-neutral-400/70">&lt;/</span>
                  <span className="text-pink-700">p</span>
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
