import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fontsource/opendyslexic/index.css';
import '@fontsource/opendyslexic/700.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for ShikshaSathi offline support in production environments
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
  try {
    const updateSW = registerSW({
      onNeedRefresh() {
        updateSW(true);
      },
      onOfflineReady() {
        console.info('[ShikshaSathi PWA] Platform is offline-ready for rural access.');
      },
      onRegisterError() {
        // Silently handled in sandboxed iframe previews
      },
    });
  } catch {
    // Graceful fallback in environments where Service Worker is restricted
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
