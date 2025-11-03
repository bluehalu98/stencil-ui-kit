import { defineCustomElements } from "@stencil-test/stencil/loader";
import type { App } from "vue";

export const StencilTestVuePlugin = {
 install(_app: App) {
  defineCustomElements();
 },
};

export default StencilTestVuePlugin;
