import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
 stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
 addons: [
  '@chromatic-com/storybook',
  '@storybook/addon-docs',
  '@storybook/addon-a11y',
  '@storybook/addon-vitest',
 ],
 framework: {
  name: '@storybook/web-components-vite',
  options: {},
 },
 core: {
  disableTelemetry: true,
 },
 viteFinal: async config => {
  // Stencil 런타임을 외부화해서 Storybook이 중복 번들링하지 않게 함
  config.optimizeDeps = config.optimizeDeps || {};
  config.optimizeDeps.exclude = ['@stencil/core'];
  return config;
 },
};
export default config;
