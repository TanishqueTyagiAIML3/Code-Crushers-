import React, { useEffect, useRef } from 'react';
import { 
  Keyboard, X, Mic, Volume2, Layers, Eye, Sparkles, 
  HelpCircle, BookOpen, CheckSquare 
} from 'lucide-react';
import { DialectOption } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getShortcutsTranslation } from '../i18n/shortcutsTranslations';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  selectedLanguage?: DialectOption;
}

interface ShortcutItem {
  keys: string[];
  title: string;
  desc: string;
  badge?: string;
}

interface ShortcutCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcuts: ShortcutItem[];
}

export function KeyboardShortcutsModal({ 
  isOpen, 
  onClose, 
  isDarkMode,
  selectedLanguage: propLanguage
}: KeyboardShortcutsModalProps) {
  const { selectedLanguage: globalLanguage } = useLanguage();
  const activeLanguage = propLanguage || globalLanguage;
  
  // Dynamically resolve translations based on the user's active selected language
  const loc = getShortcutsTranslation(activeLanguage?.id);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open for instant keyboard focus trapping
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
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories: ShortcutCategory[] = [
    {
      title: loc.categories.voiceTitle,
      icon: Mic,
      shortcuts: [
        {
          keys: ['Alt', 'C'],
          title: 'Voice Commands Navigator (आवाज़ नेविगेटर)',
          desc: 'Hands-free voice control: navigate tools, switch languages, or trigger actions',
          badge: 'Web Speech API'
        },
        {
          keys: ['Space'],
          title: loc.shortcuts.voiceToggle.title,
          desc: loc.shortcuts.voiceToggle.desc,
          badge: loc.popularBadge
        },
        {
          keys: ['Alt', 'V'],
          title: loc.shortcuts.voiceForce.title,
          desc: loc.shortcuts.voiceForce.desc
        },
        {
          keys: ['Alt', 'S'],
          title: loc.shortcuts.speechStop.title,
          desc: loc.shortcuts.speechStop.desc
        },
        {
          keys: ['Alt', 'R'],
          title: loc.shortcuts.speechReplay.title,
          desc: loc.shortcuts.speechReplay.desc
        },
        {
          keys: ['Esc'],
          title: loc.shortcuts.esc.title,
          desc: loc.shortcuts.esc.desc
        }
      ]
    },
    {
      title: loc.categories.toolsTitle,
      icon: Layers,
      shortcuts: [
        {
          keys: ['1', 'Alt+1'],
          title: loc.shortcuts.tool1.title,
          desc: loc.shortcuts.tool1.desc
        },
        {
          keys: ['2', 'Alt+2'],
          title: loc.shortcuts.tool2.title,
          desc: loc.shortcuts.tool2.desc
        },
        {
          keys: ['3', 'Alt+3'],
          title: loc.shortcuts.tool3.title,
          desc: loc.shortcuts.tool3.desc
        },
        {
          keys: ['4', 'Alt+4'],
          title: loc.shortcuts.tool4.title,
          desc: loc.shortcuts.tool4.desc
        },
        {
          keys: ['5', 'Alt+5'],
          title: loc.shortcuts.tool5.title,
          desc: loc.shortcuts.tool5.desc
        },
        {
          keys: ['6', 'Alt+6'],
          title: loc.shortcuts.tool6.title,
          desc: loc.shortcuts.tool6.desc
        },
        {
          keys: ['7', 'Alt+7'],
          title: loc.shortcuts.tool7.title,
          desc: loc.shortcuts.tool7.desc
        }
      ]
    },
    {
      title: loc.categories.navTitle,
      icon: Keyboard,
      shortcuts: [
        {
          keys: ['Tab'],
          title: loc.shortcuts.tab.title,
          desc: loc.shortcuts.tab.desc
        },
        {
          keys: ['Shift', 'Tab'],
          title: loc.shortcuts.shiftTab.title,
          desc: loc.shortcuts.shiftTab.desc
        },
        {
          keys: ['Enter'],
          title: loc.shortcuts.enter.title,
          desc: loc.shortcuts.enter.desc
        },
        {
          keys: ['/'],
          title: loc.shortcuts.slash.title,
          desc: loc.shortcuts.slash.desc
        }
      ]
    },
    {
      title: loc.categories.accessTitle,
      icon: Eye,
      shortcuts: [
        {
          keys: ['?'],
          title: loc.shortcuts.question.title,
          desc: loc.shortcuts.question.desc
        },
        {
          keys: ['Alt', 'T'],
          title: loc.shortcuts.theme.title,
          desc: loc.shortcuts.theme.desc
        },
        {
          keys: ['Alt', 'L'],
          title: loc.shortcuts.lang.title,
          desc: loc.shortcuts.lang.desc
        },
        {
          keys: ['Alt', 'A'],
          title: loc.shortcuts.access.title,
          desc: loc.shortcuts.access.desc
        },
        {
          keys: ['Alt', 'F'],
          title: loc.shortcuts.fullscreen.title,
          desc: loc.shortcuts.fullscreen.desc
        },
        {
          keys: ['Alt', 'G'],
          title: 'Google Sign In & Cloud Sync (गूगल खाता)',
          desc: 'Open Google Sign In dialog or manage cloud account sync profile'
        }
      ]
    },
    {
      title: loc.categories.inToolTitle,
      icon: CheckSquare,
      shortcuts: [
        {
          keys: ['A', 'B', 'C', 'D'],
          title: loc.shortcuts.quizKeys.title,
          desc: loc.shortcuts.quizKeys.desc
        },
        {
          keys: ['Space', 'Enter'],
          title: loc.shortcuts.flashcardFlip.title,
          desc: loc.shortcuts.flashcardFlip.desc
        },
        {
          keys: ['←', '→'],
          title: loc.shortcuts.flashcardNav.title,
          desc: loc.shortcuts.flashcardNav.desc
        },
        {
          keys: ['L'],
          title: loc.shortcuts.audioListen.title,
          desc: loc.shortcuts.audioListen.desc
        }
      ]
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-orange-100/60 dark:border-slate-800 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="keyboard-shortcuts-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {loc.title}
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-[#ea580c] dark:bg-orange-950/80 dark:text-orange-300">
                  {loc.badge}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {activeLanguage.name} ({activeLanguage.nativeName})
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {loc.subtitle}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close keyboard shortcuts dialog (Esc)"
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Notice Banner */}
          <div className="rounded-2xl p-3.5 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-800/40 flex items-start gap-3 text-xs">
            <Sparkles className="w-4 h-4 text-[#ea580c] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-orange-900 dark:text-orange-200">
                {loc.noticeTitle}
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {loc.noticeBody}
              </p>
            </div>
          </div>

          {/* Grid of Shortcut Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div 
                  key={idx}
                  className={`rounded-2xl p-4 border space-y-3 ${
                    isDarkMode ? 'bg-slate-800/50 border-slate-700/80' : 'bg-slate-50/70 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
                    <IconComp className="w-4 h-4" />
                    <span>{cat.title}</span>
                  </div>

                  <ul className="space-y-2.5">
                    {cat.shortcuts.map((sc, sIdx) => (
                      <li key={sIdx} className="flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-0.5 flex-1 pr-2">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 flex-wrap">
                            <span>{sc.title}</span>
                            {sc.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                                {sc.badge}
                              </span>
                            )}
                          </div>
                          {sc.desc && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                              {sc.desc}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          {sc.keys.map((k, kIdx) => (
                            <kbd
                              key={kIdx}
                              className="px-2 py-1 text-[11px] font-mono font-bold rounded-lg border bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 shadow-sm"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>{loc.footerEsc}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-semibold bg-[#ea580c] hover:bg-orange-700 text-white shadow-sm transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 outline-none"
          >
            {loc.gotItBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
