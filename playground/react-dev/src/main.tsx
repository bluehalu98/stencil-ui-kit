import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { defineCustomElements } from '@stencil-test/react';

defineCustomElements();
console.log('React component loaded');

// createRoot(document.getElementById("root")!).render(
//  <StrictMode>
//   <App />
//  </StrictMode>
// );

createRoot(document.body).render(
 <StrictMode>
  <App />
 </StrictMode>
);
