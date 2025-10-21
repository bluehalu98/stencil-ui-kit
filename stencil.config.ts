import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
 namespace: 'design-system',
 globalStyle: 'src/styles/global.css',
 plugins: [
  sass({
   includePaths: ['src/styles'],
  }),
 ],
 outputTargets: [
  {
   type: 'dist',
   esmLoaderPath: '../loader',
  },
  {
   type: 'dist-custom-elements',
   customElementsExportBehavior: 'auto-define-custom-elements',
   externalRuntime: false,
  },
  {
   type: 'docs-readme',
  },
  {
   type: 'www',
   serviceWorker: null, // disable service workers
  },
  reactOutputTarget({
   outDir: './packages/react/src/components/',
  }),
  vueOutputTarget({
   proxiesFile: './packages/vue/src/components.ts',
  }),
 ],
 testing: {
  browserHeadless: 'shell',
 },
};
