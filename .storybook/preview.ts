import '../app/globals.css';
import type { Preview } from '@storybook/nextjs-vite';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'background',
      values: [
        { name: 'background', value: '#FFFFFF' },
        { name: 'surface', value: '#F3F3F3' },
        { name: 'brand-dark', value: '#000B34' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
