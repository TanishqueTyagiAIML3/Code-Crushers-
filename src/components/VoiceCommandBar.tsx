import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Radio,
  Check,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { VoiceCommandResult, VOICE_COMMAND_EXAMPLES, parseVoiceCommand } from '../utils/voiceCommands';
import { useLanguage } from '../context/LanguageContext';

interface VoiceCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  isHandsFree: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  lastExecutedCommand: VoiceCommandResult | null;
  errorMessage: string | null;
  voiceFeedbackEnabled: boolean;
  currentLanguageName: string;
  onToggleListening: () => void;
  onToggleHandsFree: () => void;
  onToggleVoiceFeedback: () => void;
  onExecuteSampleCommand: (command: VoiceCommandResult) => void;
}

export function VoiceCommandBar({
  isOpen,
  onClose,
  isListening,
  isHandsFree,
  isSupported,
  transcript,
  interimTranscript,
  lastExecutedCommand,
  errorMessage,
  voiceFeedbackEnabled,
  currentLanguageName,
  onToggleListening,
  onToggleHandsFree,
  onToggleVoiceFeedback,
  onExecuteSampleCommand,
}: VoiceCommandBarProps) {
  const { t } = useLanguage();
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  if (!isOpen) return null;

  const currentDisplaySpeech = interimTranscript || transcript;

  return (
    <div
      role="region"
      aria-label="Voice Command Assistant"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-slide-up transition-all duration-300"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-orange-500/40 dark:border-orange-500/50 p-4 text-slate-800 dark:text-slate-100">
        {/* Top bar: Status, Hands-Free toggle, Audio toggle, Close */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                onClick={onToggleListening}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse ring-4 ring-orange-400/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/40'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to start voice listening'}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <Mic className="w-5 h-5 text-white animate-bounce" /> : <MicOff className="w-5 h-5" />}
              </button>
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  {t.voiceCommands || 'Voice Navigator'}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                  {currentLanguageName}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isListening
                  ? isHandsFree
                    ? 'Continuous Hands-Free Mode active. Speak commands freely.'
                    : 'Listening for commands... Speak naturally.'
                  : 'Microphone paused. Click mic or press Alt+C to talk.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Hands-Free continuous toggle */}
            <button
              onClick={onToggleHandsFree}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                isHandsFree
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={isHandsFree ? 'Hands-Free continuous listening ON' : 'Turn on Continuous Hands-Free Mode'}
            >
              <Radio className={`w-3.5 h-3.5 ${isHandsFree ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Hands-Free</span>
            </button>

            {/* Audio Voice Feedback toggle */}
            <button
              onClick={onToggleVoiceFeedback}
              className={`p-1.5 rounded-lg text-xs transition ${
                voiceFeedbackEnabled
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
              title={
                voiceFeedbackEnabled
                  ? 'Audio voice feedback is ON (Reads confirmations out loud)'
                  : 'Audio voice feedback is OFF'
              }
              aria-label="Toggle spoken feedback"
            >
              {voiceFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close voice command bar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live speech feedback & waveform */}
        <div className="mt-3 space-y-2">
          {/* Unsupported notice */}
          {!isSupported && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
              Web Speech API is not supported on this browser. You can click the sample commands below to navigate hands-free!
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Active speech waveform & live text */}
          <div className="min-h-[44px] flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
              {isListening ? (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-1.5 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-5 bg-orange-600 rounded-full animate-pulse delay-75"></span>
                  <span className="w-1.5 h-2.5 bg-orange-400 rounded-full animate-pulse delay-150"></span>
                </div>
              ) : (
                <Zap className="w-4 h-4 text-slate-400 flex-shrink-0" />
              )}

              <div className="truncate text-xs font-medium">
                {currentDisplaySpeech ? (
                  <span className="text-slate-900 dark:text-white font-mono">
                    "{currentDisplaySpeech}"
                  </span>
                ) : (
                  <span className="text-slate-400 italic">
                    {isListening ? 'Speak a command (e.g. "Open Quiz", "Switch to Bhojpuri", "Dark mode")...' : 'Paused. Click mic or speak.'}
                  </span>
                )}
              </div>
            </div>

            {/* Executed feedback badge */}
            {lastExecutedCommand && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-sm animate-fade-in flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
                <span>{lastExecutedCommand.commandLabel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Expandable Cheat Sheet */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            className="w-full flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 transition py-1"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Voice Command Quick Guide & Clickable Examples
            </span>
            {showCheatSheet ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCheatSheet && (
            <div className="mt-2.5 space-y-3 max-h-60 overflow-y-auto pr-1 text-xs animate-fade-in">
              {VOICE_COMMAND_EXAMPLES.map((category, catIdx) => (
                <div key={catIdx} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {category.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {category.actionDescription}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {category.phrases.map((phrase, pIdx) => {
                      const cleanPhrase = phrase.replace(/"/g, '');
                      return (
                        <button
                          key={pIdx}
                          onClick={() => {
                            const parsed = parseVoiceCommand(cleanPhrase);
                            if (parsed) {
                              onExecuteSampleCommand(parsed);
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/60 hover:text-orange-700 dark:hover:text-orange-300 text-slate-700 dark:text-slate-300 text-[11px] font-mono transition text-left cursor-pointer border border-transparent hover:border-orange-300 dark:hover:border-orange-700"
                          title={`Click to run test: "${cleanPhrase}"`}
                        >
                          {phrase}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
