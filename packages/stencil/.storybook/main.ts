import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
 stories: [
  '../src/**/*.mdx',
  '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  // '../src/**/**/*.stories.@(js|jsx|mjs|ts|tsx)',
 ],
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

  // SCSS 지원 추가
  if (!config.css) config.css = {};
  if (!config.css.preprocessorOptions) config.css.preprocessorOptions = {};

  config.css.preprocessorOptions.scss = {
   includePaths: ['src/styles'],
   silenceDeprecations: ['legacy-js-api', 'import'], // deprecated 경고 숨기기
   quietDeps: true, // 의존성 경고 숨기기
  } as any;

  return config;
 },
};
export default config;
