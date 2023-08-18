import type { StorybookConfig } from '@storybook/angular';
const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-actions', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
