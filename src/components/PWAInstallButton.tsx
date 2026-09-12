import React, { useState, useRef, useEffect } from 'react';
import { Download, Smartphone, Check, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const iosBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showIOSModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowIOSModal(false);
        iosBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIOSModal]);

  // Do not render anything if already installed as standalone PWA
  if (isInstalled) {
    return null;
  }

  // Chromium, Edge, Android native install flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        type="button"
        onClick={install}
        title="Install ShikshaSathi AI App for offline learning"
        aria-label="Install ShikshaSathi App"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm hover:shadow transition cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow (manual Add to Home Screen instructions)
  if (isIOS) {
    return (
      <>
        <button
          ref={iosBtnRef}
          id="pwa-ios-install-btn"
          type="button"
          onClick={() => setShowIOSModal(true)}
          aria-haspopup="dialog"
          aria-expanded={showIOSModal}
          title="Install on iPhone / iPad for offline study"
          aria-label="Install on iOS"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-bold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
        >
          <Smartphone className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden sm:inline">Install on iOS</span>
        </button>

        {showIOSModal && (
          <div 
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-pwa-title"
            onClick={() => {
              setShowIOSModal(false);
              iosBtnRef.current?.focus();
            }}
          >
            <div 
              className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 id="ios-pwa-title" className="font-bold text-sm text-slate-900 dark:text-white">
                    Install ShikshaSathi on iPhone/iPad
                  </h3>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setShowIOSModal(false);
                    iosBtnRef.current?.focus();
                  }}
                  aria-label="Close dialog"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-orange-500 outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <p>To use ShikshaSathi completely offline on iOS Safari:</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 font-medium text-slate-700 dark:text-slate-200">
                  <li>Tap the <strong>Share</strong> button (box with upward arrow) at the bottom of Safari.</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top-right corner.</li>
                </ol>
                <p className="text-[11px] text-slate-400 pt-1">
                  Once installed, you can launch ShikshaSathi anytime from your home screen even with zero internet!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowIOSModal(false);
                  iosBtnRef.current?.focus();
                }}
                className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 outline-none"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
