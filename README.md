# Stencil Test - Web Components Library

Stencil을 사용한 웹 컴포넌트 라이브러리와 React/Vue 래퍼를 제공하는 Monorepo 프로젝트입니다.

## 📁 프로젝트 구조

```
design-system/
├── packages/
│   ├── stencil/          # Stencil 웹 컴포넌트 (코어)
│   ├── react/            # React 래퍼 (자동 생성)
│   └── vue/              # Vue 래퍼 (자동 생성)
└── playground/
    ├── react-dev/        # React 테스트 앱
    └── vue-dev/          # Vue 테스트 앱
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 빌드

```bash
# 전체 빌드 (stencil → react → vue 순서)
npm run build

# 개별 빌드
npm run build:stencil
npm run build:react
npm run build:vue
```

### 3. 개발 모드

```bash
# Stencil 개발 서버
cd packages/stencil
npm start

# React Playground
cd playground/react-dev
npm run dev

# Vue Playground
cd playground/vue-dev
npm run dev
```

## 📦 패키지 설명

### @design-system/stencil

Stencil로 작성된 웹 컴포넌트 라이브러리입니다.
- React/Vue 래퍼를 자동으로 생성합니다
- `stencil.config.ts`에서 output target 설정

### @design-system/react

React용 컴포넌트 래퍼입니다.
- Stencil 빌드 시 자동 생성됩니다 (`packages/react/lib/components/`)
- TypeScript로 타입 정의 포함

### @design-system/vue

Vue 3용 컴포넌트 래퍼입니다.
- Stencil 빌드 시 자동 생성됩니다 (`packages/vue/lib/components.ts`)
- Vue 플러그인 제공

## 🔧 사용 방법

### React에서 사용

```tsx
import { defineCustomElements } from '@design-system/react';
import { SdButton, SdInput } from '@design-system/react';

// 앱 초기화 시 한 번만 호출
defineCustomElements();

function App() {
  return (
    <div>
      <SdButton label="Click Me" />
      <SdInput placeholder="Enter text" />
    </div>
  );
}
```

### Vue에서 사용

```typescript
// main.ts
import { createApp } from 'vue';
import { StencilTestVuePlugin } from '@design-system/vue';
import App from './App.vue';

createApp(App)
  .use(StencilTestVuePlugin)
  .mount('#app');
```

```vue
<!-- Component.vue -->
<template>
  <div>
    <SdButton label="Click Me" />
    <SdInput placeholder="Enter text" />
  </div>
</template>

<script setup lang="ts">
import { SdButton, SdInput } from '@design-system/vue';
</script>
```

## 📝 새 컴포넌트 추가하기

1. Stencil 컴포넌트 생성:
   ```bash
   cd packages/stencil
   npm run generate
   ```

2. 전체 빌드:
   ```bash
   npm run build
   ```

3. React/Vue 래퍼가 자동으로 생성됩니다

## 🛠️ 기술 스택

- **Stencil** - 웹 컴포넌트 프레임워크
- **React 19** - React 래퍼 및 테스트
- **Vue 3** - Vue 래퍼 및 테스트
- **TypeScript** - 타입 안전성
- **Lerna** - Monorepo 관리
- **Vite** - 빌드 도구 (playground)

## 📄 라이선스

MIT
