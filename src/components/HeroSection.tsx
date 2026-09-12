import React, { useState } from 'react';
import { Sparkles, Mic, Volume2, ArrowRight, Play, Square } from 'lucide-react';
import { HeroMicrophoneArtwork } from './ArtworkIllustrations';
import { speakText, stopSpeech } from '../utils/bionic';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onOpenDemo: () => void;
}

export function HeroSection({ onOpenDemo }: HeroSectionProps) {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const { selectedLanguage } = useLanguage();

  const samplePrompt = selectedLanguage.sampleQuery;
  const sampleAnswer = selectedLanguage.sampleResponse;

  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      stopSpeech();
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      speakText(sampleAnswer, selectedLanguage.code || 'hi-IN', 0.95, () => setIsPlayingVoice(false));
    }
  };

  return (
    <section id="home" className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-circuit-grid">
      {/* Decorative Traditional Indian Geometric Corners (Ajrakh / Paisley subtle motifs) */}
      <div className="absolute top-0 left-0 w-36 h-36 opacity-30 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500/40 fill-current">
          <path d="M0 0 L100 0 C70 10 50 30 40 60 C30 50 10 70 0 100 Z" />
          <circle cx="25" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="15" cy="50" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-36 h-36 opacity-30 pointer-events-none transform -scale-x-100">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500/40 fill-current">
          <path d="M0 0 L100 0 C70 10 50 30 40 60 C30 50 10 70 0 100 Z" />
          <circle cx="25" cy="25" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Brand Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mb-6 drop-shadow-sm">
          ShikshaSathi AI
        </h1>

        {/* Studio Microphone Artwork with pulsating soundwaves */}
        <div className="my-2 sm:my-6">
          <HeroMicrophoneArtwork isLive={isPlayingVoice} />
        </div>

        {/* Hero Tagline from reference image */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 tracking-tight leading-snug sm:leading-tight max-w-3xl mx-auto">
          The Voice-First, Dialect-Aware Learning Companion for All of India.
        </h2>

        {/* Subtitle from reference image */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Empowering millions of diverse learners with accessible, AI-powered tools.
        </p>

        {/* Action Button: Explore the Demo */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-explore-demo-btn"
            onClick={onOpenDemo}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Explore the Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Quick Voice Play Test */}
          <button
            id="hero-quick-listen-btn"
            onClick={handleToggleVoice}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-amber-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            {isPlayingVoice ? (
              <>
                <Square className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                <span>Pause Dialect Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Hear {selectedLanguage.name} Voice</span>
              </>
            )}
          </button>
        </div>

        {/* Live Mini Voice Interactive Snippet */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-[#111a24]/90 border border-[#21354a] max-w-2xl mx-auto text-left shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Live Dialect Comprehension Preview
              </span>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              {selectedLanguage.name} • {selectedLanguage.region}
            </span>
          </div>

          <div className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <p className="text-slate-300 italic">
                "{samplePrompt}"
              </p>
            </div>

            <div className="flex items-start gap-2.5 bg-[#0b1219] p-3 rounded-xl border border-slate-800/60">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-amber-100/90 leading-relaxed text-xs sm:text-sm">
                  {sampleAnswer}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Gemini Conceptual Reasoning + Native Dialect TTS</span>
                  <button 
                    onClick={handleToggleVoice} 
                    className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isPlayingVoice ? 'Speaking...' : 'Listen'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
