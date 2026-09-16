import React, { useState } from 'react';
import { WifiOff, Wifi, Sparkles, CheckCircle2, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  // If online and was never offline, do not show anything
  if (isOnline && !wasOffline) {
    return null;
  }

  // If user dismissed it while online, hide
  if (isOnline && dismissed) {
    return null;
  }

  return (
    <aside aria-label="Network status banner" className="w-full transition-all duration-300">
      {!isOnline ? (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 max-w-4xl mx-auto flex-1">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
              <WifiOff className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1">
              <span className="font-bold">Offline Learning Mode Active: </span>
              <span className="opacity-95">
                No active internet connection. You can still access all saved lessons, study history, flashcards, and mind maps stored locally!
              </span>
            </div>
          </div>
        </div>
      ) : wasOffline && !dismissed ? (
        <div className="bg-emerald-600 text-white px-4 py-2 shadow-sm flex items-center justify-between text-xs sm:text-sm animate-fade-in">
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>
              <strong>Back Online!</strong> Connectivity restored. Your offline study sessions are synchronized.
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition"
            aria-label="Dismiss connectivity notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}
    </aside>
  );
}
