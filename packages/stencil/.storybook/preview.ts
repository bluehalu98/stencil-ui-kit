import type { Preview } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../src/styles/global.scss';
// import { defineCustomElements } from '../dist/esm/loader';

// // Stencil 컴포넌트를 웹 컴포넌트로 등록
// defineCustomElements();

const preview: Preview = {
 parameters: {
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
