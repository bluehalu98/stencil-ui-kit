import { defineCustomElements } from '@design-system/stencil/loader';
import type { App } from 'vue';

export const StencilTestVuePlugin = {
 install(_app: App) {
  defineCustomElements();
 },
};

export default StencilTestVuePlugin;
