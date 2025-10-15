import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import path from 'path';

export const config: Config = {
  namespace: 'stencil-ui-kit',
  plugins: [sass({ injectGlobalPaths: [path.resolve(__dirname, 'src/assets/css/default.scss')] })],
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
  ],
  testing: {
    browserHeadless: 'shell',
  },
};
