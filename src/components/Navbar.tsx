import React from 'react';
import { Mic, Volume2, Sparkles, BookOpen, Eye, Zap } from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface NavbarProps {
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onOpenDemo: () => void;
}

export function Navbar({ accessibility, setAccessibility, onOpenDemo }: NavbarProps) {
  const toggleDyslexic = () => {
    setAccessibility(prev => ({ ...prev, openDyslexic: !prev.openDyslexic }));
  };

  const toggleBionic = () => {
    setAccessibility(prev => ({ ...prev, bionicReading: !prev.bionicReading }));
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b1219]/90 border-b border-[#1e2f42] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tracking-tight text-slate-100 group-hover:text-amber-300 transition-colors">
              ShikshaSathi
            </span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300">
              AI
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#home" className="hover:text-amber-300 transition-colors">Home</a>
          <a href="#vision" className="hover:text-amber-300 transition-colors">Vision</a>
          <a href="#features" className="hover:text-amber-300 transition-colors">Features</a>
          <a href="#languages" className="hover:text-amber-300 transition-colors">Languages</a>
          <a href="#technology" className="hover:text-amber-300 transition-colors">Architecture</a>
          <a href="#impact" className="hover:text-amber-300 transition-colors">Impact</a>
        </nav>

        {/* Accessibility quick toggles & Demo button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* OpenDyslexic quick toggle button */}
          <button
            id="nav-toggle-dyslexic"
            onClick={toggleDyslexic}
            title="Toggle OpenDyslexic Font for reading ease"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              accessibility.openDyslexic
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OpenDyslexic</span>
            <span className={`w-1.5 h-1.5 rounded-full ${accessibility.openDyslexic ? 'bg-amber-400' : 'bg-slate-600'}`} />
          </button>

          {/* Bionic Reading quick toggle */}
          <button
            id="nav-toggle-bionic"
            onClick={toggleBionic}
            title="Toggle Bionic Reading Mode (Bold letter fixations)"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              accessibility.bionicReading
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bionic</span>
            <span className={`w-1.5 h-1.5 rounded-full ${accessibility.bionicReading ? 'bg-cyan-400' : 'bg-slate-600'}`} />
          </button>

          {/* Primary CTA - Explore the Demo */}
          <button
            id="nav-explore-demo-btn"
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore the Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
