import React from 'react';
import { RotateCw, Volume2, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Flashcard, AccessibilitySettings } from '../types';
import { formatBionicReading } from '../utils/bionic';

interface InteractiveFlashcardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  labels?: {
    cardFrontLabel?: string;
    cardBackLabel?: string;
    flipCardPrompt?: string;
  };
  accessibility?: AccessibilitySettings;
  onSpeak?: (text: string) => void;
  cardIndex?: number;
  totalCards?: number;
  variant?: 'light' | 'dark';
}

export const InteractiveFlashcard: React.FC<InteractiveFlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  labels = {
    cardFrontLabel: 'Question Side',
    cardBackLabel: 'Answer Side',
    flipCardPrompt: 'Click or tap card to flip'
  },
  accessibility,
  onSpeak,
  cardIndex,
  totalCards,
  variant = 'light'
}) => {
  const frontText = card?.frontQuestion || '';
  const backText = card?.backAnswer || '';
  const dialectText = card?.dialectTranslation || '';
  const keyTakeaway = card?.keyTakeaway || '';
  const topic = card?.topic || 'Key Concept';
  const isDark = variant === 'dark';

  // Dynamic responsive font sizing based on length to guarantee text fits cleanly
  const getQuestionSizeClass = (len: number) => {
    if (len > 160) return 'text-sm sm:text-base font-semibold leading-relaxed';
    if (len > 90) return 'text-base sm:text-lg font-bold leading-relaxed';
    if (len > 45) return 'text-lg sm:text-xl font-bold leading-snug';
    return 'text-xl sm:text-2xl font-bold leading-snug';
  };

  const getAnswerSizeClass = (len: number) => {
    if (len > 220) return 'text-xs sm:text-sm font-normal leading-relaxed';
    if (len > 130) return 'text-sm sm:text-base font-medium leading-relaxed';
    if (len > 70) return 'text-base sm:text-lg font-medium leading-relaxed';
    return 'text-base sm:text-lg font-semibold leading-relaxed';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${isFlipped ? labels.cardBackLabel : labels.cardFrontLabel}. ${labels.flipCardPrompt}`}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      className="perspective-1000 w-full max-w-2xl mx-auto min-h-[350px] sm:min-h-[380px] focus:outline-none focus:ring-4 focus:ring-orange-400/30 rounded-2xl group select-none cursor-pointer"
    >
      {/* 3D Rotating Inner Box with Hover Scale & Glow */}
      <div
        className={`relative w-full h-full min-h-[350px] sm:min-h-[380px] preserve-3d transition-all duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)] transform group-hover:scale-[1.015] active:scale-[0.99] ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ========================================================= */}
        {/* FRONT FACE (QUESTION) */}
        {/* ========================================================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden
                     backdrop-blur-xl transition-all duration-300 ${
                       isDark
                         ? 'bg-gradient-to-br from-[#13202e]/95 via-[#0d1620]/90 to-[#172638]/90 border-2 border-amber-400/30 shadow-[0_8px_30px_rgba(245,158,11,0.12)] group-hover:border-amber-400/80 group-hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]'
                         : 'bg-gradient-to-br from-white/95 via-white/90 to-orange-50/70 border-2 border-orange-200/70 shadow-[0_8px_30px_rgba(234,88,12,0.12)] group-hover:border-orange-400/80 group-hover:shadow-[0_0_35px_rgba(234,88,12,0.32)]'
                     }`}
        >
          {/* Subtle Ambient Decorative Glow Blobs */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-300/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-gradient-to-tr from-rose-400/15 to-orange-300/10 blur-2xl pointer-events-none" />

          {/* Front Header */}
          <div className="relative z-10 flex items-center justify-between gap-2 text-xs font-semibold pb-1 border-b border-orange-100/40 dark:border-slate-800/60">
            <span
              title={topic}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] shadow-sm max-w-[160px] sm:max-w-[280px] truncate ${
                isDark
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                  : 'bg-orange-100/80 text-orange-900 border border-orange-200/60'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-[#ea580c]'}`} />
              <span className="truncate">{topic}</span>
            </span>

            <div className="flex items-center gap-2 shrink-0">
              {totalCards && (
                <span className={`text-[11px] font-mono font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {((cardIndex ?? 0) + 1)} / {totalCards}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                  isDark
                    ? 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                    : 'bg-slate-100/90 text-slate-600 border-slate-200/60'
                }`}
              >
                <HelpCircle className={`w-3 h-3 ${isDark ? 'text-amber-400' : 'text-[#ea580c]'}`} />
                <span>{labels.cardFrontLabel}</span>
              </span>
            </div>
          </div>

          {/* Centered Scrollable Front Content (Question) */}
          <div className="relative z-10 my-auto py-3 w-full max-h-[220px] sm:max-h-[250px] overflow-y-auto flashcard-scrollbar flex flex-col items-center justify-center text-center px-2 sm:px-4">
            <span className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-extrabold mb-2 shrink-0 px-2 py-0.5 rounded-full ${
              isDark ? 'text-amber-400 bg-amber-400/10' : 'text-[#ea580c] bg-orange-100/80'
            }`}>
              Question
            </span>
            <h3
              className={`max-w-xl break-words ${getQuestionSizeClass(frontText.length)} ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              {accessibility?.bionicReading ? formatBionicReading(frontText) : frontText}
            </h3>
          </div>

          {/* Front Footer with Controls */}
          <div
            className={`relative z-10 flex items-center justify-between pt-2 border-t text-xs ${
              isDark ? 'border-slate-800/80 text-slate-400' : 'border-orange-100/80 text-slate-400'
            }`}
          >
            <span className={`flex items-center gap-1.5 font-medium group-hover:underline ${isDark ? 'text-amber-400' : 'text-[#ea580c]'}`}>
              <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
              <span>{labels.flipCardPrompt}</span>
            </span>

            {onSpeak && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(frontText);
                }}
                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                  isDark
                    ? 'text-slate-300 hover:text-amber-300 hover:bg-amber-950/40'
                    : 'text-slate-600 hover:text-[#ea580c] hover:bg-orange-50'
                }`}
                title="Pronounce Question"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK FACE (ANSWER) */}
        {/* ========================================================= */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden
                     backdrop-blur-xl transition-all duration-300 ${
                       isDark
                         ? 'bg-gradient-to-br from-[#0c221e]/95 via-[#091715]/90 to-[#122c26]/90 border-2 border-emerald-400/40 shadow-[0_8px_30px_rgba(16,185,129,0.14)] group-hover:border-emerald-400/80 group-hover:shadow-[0_0_35px_rgba(16,185,129,0.38)]'
                         : 'bg-gradient-to-br from-white/95 via-emerald-50/30 to-teal-50/60 border-2 border-emerald-300/70 shadow-[0_8px_30px_rgba(16,185,129,0.12)] group-hover:border-emerald-500/80 group-hover:shadow-[0_0_35px_rgba(16,185,129,0.32)]'
                     }`}
        >
          {/* Subtle Ambient Decorative Glow Blobs */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-300/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-400/15 to-emerald-300/10 blur-2xl pointer-events-none" />

          {/* Back Header */}
          <div className="relative z-10 flex items-center justify-between gap-2 text-xs font-semibold pb-1 border-b border-emerald-100/40 dark:border-emerald-900/40">
            <span
              title={topic}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] shadow-sm max-w-[160px] sm:max-w-[280px] truncate ${
                isDark
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                  : 'bg-emerald-100/80 text-emerald-900 border border-emerald-200/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{topic}</span>
            </span>

            <div className="flex items-center gap-2 shrink-0">
              {totalCards && (
                <span className={`text-[11px] font-mono font-medium ${isDark ? 'text-emerald-400/70' : 'text-emerald-700/60'}`}>
                  {((cardIndex ?? 0) + 1)} / {totalCards}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                  isDark
                    ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{labels.cardBackLabel}</span>
              </span>
            </div>
          </div>

          {/* Centered Scrollable Back Content (Answer, Dialect Translation & Key Takeaway) */}
          <div className="relative z-10 my-auto py-2.5 w-full max-h-[220px] sm:max-h-[260px] overflow-y-auto flashcard-scrollbar flex flex-col items-center justify-center text-center space-y-2.5 px-2 sm:px-4">
            <span className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-extrabold shrink-0 px-2 py-0.5 rounded-full ${
              isDark ? 'text-emerald-400 bg-emerald-400/10' : 'text-emerald-700 bg-emerald-100/80'
            }`}>
              Explanation
            </span>

            <p
              className={`max-w-xl break-words ${getAnswerSizeClass(backText.length)} ${
                isDark ? 'text-emerald-100' : 'text-emerald-950'
              }`}
            >
              {accessibility?.bionicReading ? formatBionicReading(backText) : backText}
            </p>

            {keyTakeaway && (
              <div
                className={`w-full max-w-lg p-2 rounded-xl text-xs flex items-center justify-center gap-2 text-center border break-words shadow-xs ${
                  isDark
                    ? 'bg-[#0a201a]/90 border-emerald-500/30 text-emerald-200'
                    : 'bg-emerald-50/90 border-emerald-200/80 text-emerald-900'
                }`}
              >
                <span className="font-bold text-amber-500 shrink-0">💡 Note:</span>
                <span className="leading-snug">{keyTakeaway}</span>
              </div>
            )}

            {dialectText && (
              <div
                className={`w-full max-w-lg p-2.5 rounded-xl text-xs sm:text-sm italic shadow-inner border break-words ${
                  isDark
                    ? 'bg-[#061813]/80 border-emerald-500/30 text-emerald-200'
                    : 'bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border-emerald-200/70 text-emerald-900'
                }`}
              >
                "{dialectText}"
              </div>
            )}
          </div>

          {/* Back Footer with Controls */}
          <div
            className={`relative z-10 flex items-center justify-between pt-2 border-t text-xs ${
              isDark ? 'border-slate-800/80 text-slate-400' : 'border-emerald-100/80 text-slate-500'
            }`}
          >
            <span className={`flex items-center gap-1.5 font-medium group-hover:underline ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
              <span>{labels.flipCardPrompt}</span>
            </span>

            {onSpeak && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(dialectText || backText);
                }}
                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                  isDark
                    ? 'text-emerald-300 hover:text-emerald-100 hover:bg-emerald-950/50'
                    : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/60'
                }`}
                title="Pronounce Answer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default InteractiveFlashcard;
