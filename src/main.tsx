import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for ShikshaSathi offline support
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[ShikshaSathi PWA] New version available. Updating service worker...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[ShikshaSathi PWA] Platform is offline-ready! Students in rural areas can access saved lessons and tools without connectivity.');
  },
  onRegisterError(error) {
    console.warn('[ShikshaSathi PWA] Service worker registration notice:', error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
