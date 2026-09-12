import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, ShieldCheck, CheckCircle2, Cloud, Brain, 
  Mic, Sparkles, Loader2, ArrowRight, ExternalLink, 
  Info, Lock, ChevronRight
} from 'lucide-react';
import { useAuth, AuthUser } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getLastSignedInAccount, SavedAccount } from '../firebase';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export function GoogleAuthModal({ isOpen, onClose, isDarkMode }: GoogleAuthModalProps) {
  const { user, signInWithGoogle, logout, isAuthenticated } = useAuth();
  const { selectedLanguage } = useLanguage();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDomainExplainer, setShowDomainExplainer] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lastAccount, setLastAccount] = useState<SavedAccount | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isHindiOrRegional = selectedLanguage.id.startsWith('hi') || selectedLanguage.id === 'bho' || selectedLanguage.id === 'mr';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Refresh last logged in account from local storage when modal opens
    const saved = getLastSignedInAccount();
    setLastAccount(saved);

    // Prevent background scrolling while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on opening
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  // Derive active account: prioritize currently authenticated user, then last signed-in user
  const primaryAccount: SavedAccount | null = user?.email
    ? {
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0] || 'Learner',
        photoURL: user.photoURL || null,
        lastLoginAt: Date.now(),
      }
    : lastAccount;

  const handleContinueWithAccount = async (email?: string, name?: string, selectAnother?: boolean) => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle({ email, name, selectAnother });
      // Update state with newly signed in account
      const updated = getLastSignedInAccount();
      if (updated) setLastAccount(updated);
      onClose();
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        // user cancelled popup
      } else {
        setErrorMessage(err?.message || 'Google Sign-In could not be completed. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[999999] overflow-y-auto p-3 sm:p-6 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSigningIn) onClose();
      }}
    >
      <div 
        className={`relative z-10 w-full max-w-lg my-auto max-h-[88vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-700 text-white shadow-black/80' 
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Modal Header - Fixed at Top */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-orange-100/60 dark:border-slate-800 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-2.5">
            {/* Google Multicolor 'G' badge */}
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 id="google-auth-modal-title" className="text-base font-bold leading-tight">
                  {isHindiOrRegional ? 'गूगल से साइन इन करें' : 'Sign in with Google'}
                </h2>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isHindiOrRegional 
                  ? 'अपनी पढ़ाई और प्रोग्रेस को सुरक्षित सिंक करें'
                  : 'Sync your learning journey and study notes safely'}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            disabled={isSigningIn}
            aria-label="Close Google sign-in dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Scrollable if screen is short */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Active / Detected Account Fast Chooser Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isHindiOrRegional ? 'खाता चुनें (Choose an account)' : 'Choose an account'}
              </label>
              <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                1-Click Instant Login
              </span>
            </div>

            {primaryAccount ? (
              /* Quick account option: Last Signed In Account */
              <button
                type="button"
                onClick={() => handleContinueWithAccount(primaryAccount.email, primaryAccount.displayName, false)}
                disabled={isSigningIn}
                className="w-full text-left p-3 rounded-2xl border-2 border-orange-500/40 hover:border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-all flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 outline-none shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {primaryAccount.photoURL ? (
                    <img 
                      src={primaryAccount.photoURL} 
                      alt={primaryAccount.displayName || 'Google Account'} 
                      className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0 border border-slate-200 dark:border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                      {(primaryAccount.displayName || primaryAccount.email || 'G').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                        {primaryAccount.displayName}
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 shrink-0">
                        {user?.email === primaryAccount.email
                          ? (isHindiOrRegional ? 'सक्रिय खाता' : 'Active Account')
                          : (isHindiOrRegional ? 'पिछला उपयोग किया' : 'Last Used Account')}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                      {primaryAccount.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {isSigningIn ? (
                    <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shadow-xs">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            ) : (
              /* If no account has signed in before: Clean Initial Google Sign-in Option */
              <button
                type="button"
                onClick={() => handleContinueWithAccount(undefined, undefined, false)}
                disabled={isSigningIn}
                className="w-full text-left p-3.5 rounded-2xl border-2 border-orange-500/40 hover:border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 hover:bg-orange-50 dark:hover:bg-orange-950/50 transition-all flex items-center justify-between group cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 outline-none shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors block">
                      {isHindiOrRegional ? 'गूगल खाते से साइन इन करें' : 'Continue with Google'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                      {isHindiOrRegional ? 'व्यक्तिगत या कॉलेज का जीमेल खाता चुनें' : 'Select your personal or student Google account'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {isSigningIn ? (
                    <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shadow-xs">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            )}

            {/* Option: Use Another Google Account */}
            <button
              type="button"
              onClick={() => handleContinueWithAccount(undefined, undefined, true)}
              disabled={isSigningIn}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center justify-between cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {isHindiOrRegional ? 'अन्य गूगल खाते से साइन इन करें' : 'Use another Google account'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isHindiOrRegional ? 'दूसरा जीमेल या कॉलेज आईडी चुनें' : 'Choose a different Gmail or university Google account'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Error notice if any */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Authentication notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Domain Explanation Card: Transparently explains perceptive-mantis-vxctm.firebaseapp.com */}
          <div className="rounded-xl p-3 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/40 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-blue-950 dark:text-blue-200 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>
                  {isHindiOrRegional 
                    ? 'गूगल सुरक्षा सत्यापन (Security Verification)' 
                    : 'Google Security & Domain Verification'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowDomainExplainer(!showDomainExplainer)}
                className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 underline hover:text-blue-900 cursor-pointer"
              >
                {showDomainExplainer ? 'Hide Details' : 'Why this domain?'}
              </button>
            </div>
            
            <p className="text-[11px] text-blue-900/80 dark:text-blue-300/90 leading-relaxed">
              Google popups show{' '}
              <code className="px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 font-mono font-bold text-[10px] text-blue-800 dark:text-blue-200">
                perceptive-mantis-vxctm.firebaseapp.com
              </code>
              , which is the official encrypted Firebase auth gateway hosted on Google Cloud.
            </p>

            {showDomainExplainer && (
              <div className="mt-1.5 pt-1.5 border-t border-blue-200/60 dark:border-blue-800/50 space-y-0.5 text-[10px] text-slate-600 dark:text-slate-300">
                <p>• Communicates directly with Google Cloud servers via OAuth 2.0.</p>
                <p>• Passwords are never seen or stored by ShikshaSathi.</p>
                <p>• Data is saved securely in your private cloud Firestore database.</p>
              </div>
            )}
          </div>

          {/* What you get with Google Sync - Compact 3-Column Badges */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isHindiOrRegional ? 'साइन इन करने के फ़ायदे' : 'What you get with Google Sync'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center space-y-0.5">
                <Cloud className="w-3.5 h-3.5 text-sky-500 mx-auto" />
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Cloud Sync</h4>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">Quizzes & scores</p>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center space-y-0.5">
                <Brain className="w-3.5 h-3.5 text-purple-500 mx-auto" />
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Mind Maps</h4>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">Saved diagrams</p>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-center space-y-0.5">
                <Mic className="w-3.5 h-3.5 text-orange-500 mx-auto" />
                <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Dialects</h4>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">Voice memory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Fixed at Bottom */}
        <div className="flex-shrink-0 px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>256-bit SSL • Google OAuth 2.0</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSigningIn}
              className="px-3.5 py-1.5 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-xs"
            >
              {isHindiOrRegional ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (primaryAccount) {
                  handleContinueWithAccount(primaryAccount.email, primaryAccount.displayName, false);
                } else {
                  handleContinueWithAccount(undefined, undefined, false);
                }
              }}
              disabled={isSigningIn}
              className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl font-bold bg-[#ea580c] hover:bg-orange-700 text-white shadow-sm shadow-orange-500/20 transition cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-orange-500 outline-none text-xs"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>
                    {primaryAccount 
                      ? (isHindiOrRegional ? 'जारी रखें' : 'Continue') 
                      : (isHindiOrRegional ? 'साइन इन करें' : 'Sign in')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
