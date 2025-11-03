import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
 namespace: 'stencil-test',
 globalStyle: 'src/styles/global.scss',
 plugins: [
  sass({
   includePaths: ['src/styles'],
   silenceDeprecations: ['legacy-js-api', 'import'], // deprecated 경고 숨기기
   quietDeps: true, // 의존성 경고 숨기기
  }),
 ],
 outputTargets: [
  {
   type: 'dist',
   esmLoaderPath: '../loader',
  },
  {
   type: 'dist-custom-elements',
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
   stencilPackageName: '@stencil-test/stencil',
   outDir: '../../packages/react/lib/components',
  }),
  vueOutputTarget({
   componentCorePackage: '@stencil-test/stencil',
   proxiesFile: '../../packages/vue/lib/components.ts',
   componentModels: [
    // vue v-model 바인딩 설정
    // element    - 컴포넌트 배열
    // event      - @update:model-value 바인딩 이벤트
    // targetAttr - model-value 바인딩 값
    {
     elements: ['sd-input'],
     event: 'sdInput',
     targetAttr: 'value',
    },
   ],
  }),
 ],
 testing: {
  browserHeadless: 'shell',
 },
};
