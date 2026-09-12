import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  LogIn, LogOut, User as UserIcon, Loader2, Sparkles, 
  ShieldCheck, RefreshCw, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { GoogleAuthModal } from './GoogleAuthModal';

interface GoogleAuthButtonProps {
  isDarkMode?: boolean;
}

export function GoogleAuthButton({ isDarkMode }: GoogleAuthButtonProps) {
  const { user, loading, signInWithGoogle, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        menuBtnRef.current && 
        !menuBtnRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    if (!showDropdown) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowDropdown(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown]);

  const handleOpenAuthModal = () => {
    setAuthError(null);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      menuBtnRef.current?.focus();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleSwitchAccount = () => {
    setShowDropdown(false);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-3 h-8.5 sm:h-9 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-medium">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="hidden md:inline">Checking...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <button
          ref={menuBtnRef}
          id="user-profile-menu-btn"
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-haspopup="menu"
          aria-expanded={showDropdown}
          aria-controls="user-profile-dropdown"
          className="flex items-center gap-2 h-8.5 sm:h-9 px-2 sm:px-2.5 rounded-xl sm:rounded-2xl border border-orange-200 dark:border-orange-800/60 bg-orange-50/90 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
          title={`Signed in with Google as ${user.displayName || user.email}`}
          aria-label={`User account menu for ${user.displayName || user.email}. Press Enter to toggle.`}
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'Learner avatar'}
              className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full object-cover border border-orange-300 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}

          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[90px] truncate leading-tight">
              {user.displayName || user.email?.split('@')[0]}
            </span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t.cloudSync || 'Synced'}
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            id="user-profile-dropdown"
            role="menu"
            aria-label="Google User Account Menu"
            className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3.5 z-50 animate-fade-in space-y-3 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Profile Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Avatar'}
                  className="w-10 h-10 rounded-full object-cover border border-orange-200 dark:border-slate-700 shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user.displayName || 'Learner'}
                  </p>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Cloud Sync Status Card */}
            <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Google Cloud Sync Active</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                All study chats, quiz scores, and mind maps sync automatically to your Firestore database.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={handleSwitchAccount}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 outline-none"
              >
                <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                <span>Switch Google Account</span>
              </button>

              <button
                id="google-sign-out-btn"
                role="menuitem"
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:text-slate-200 dark:hover:text-red-400 text-xs font-bold transition cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 outline-none"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.signOut || 'Sign Out'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal for Account Switching */}
        <GoogleAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  // Not authenticated: Show Google Sign-in trigger button
  return (
    <div className="relative">
      <button
        id="google-sign-in-btn"
        type="button"
        onClick={handleOpenAuthModal}
        disabled={isSigningIn}
        className="flex items-center gap-2 h-8.5 sm:h-9 px-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none group"
        title={t.signInWithGoogle || 'Sign In with Google'}
        aria-label={t.signInWithGoogle || 'Sign In with Google'}
      >
        <svg className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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

        <span className="hidden xl:inline">{t.signInWithGoogle || 'Sign In with Google'}</span>
        <span className="hidden sm:inline xl:hidden">Sign In</span>
      </button>

      {/* Google Authentication Dialog Modal */}
      <GoogleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

