import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { StencilTestVuePlugin } from '@stencil-test/vue'

createApp(App)
  .use(StencilTestVuePlugin)
  .mount('#app')
