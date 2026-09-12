import React, { useState } from 'react';
import { BookOpen, Eye, Sparkles, Volume2, Sliders, Type, Contrast, Crosshair } from 'lucide-react';
import { AccessibilitySettings } from '../types';
import { formatBionicReading, speakText } from '../utils/bionic';
import { useLanguage } from '../context/LanguageContext';

interface AccessibilityPreviewSectionProps {
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export function AccessibilityPreviewSection({
  accessibility,
  setAccessibility
}: AccessibilityPreviewSectionProps) {
  const { selectedLanguage } = useLanguage();
  const [customTestInput, setCustomTestInput] = useState(
    "Quantum mechanics kya hai, saral bhasha mein batao? Yeh test hai saral bhasha mein. Bionic reading mode helps students focus without visual crowding."
  );

  const toggleDyslexic = () => {
    setAccessibility(prev => ({ ...prev, openDyslexic: !prev.openDyslexic }));
  };

  const toggleBionic = () => {
    setAccessibility(prev => ({ ...prev, bionicReading: !prev.bionicReading }));
  };

  const toggleHighContrast = () => {
    setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleCustomCursor = () => {
    setAccessibility(prev => ({ ...prev, customCursor: prev.customCursor === false ? true : false }));
  };

  const sampleCardText = "Quantum mechanics kya hai, saral bhasha mein batao? Yeh test hai saral bhasha mein. Bionic reading and OpenDyslexic prevent letters from flipping or crowding in neurodivergent learners.";

  return (
    <section id="accessibility" className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      accessibility.highContrast ? 'bg-black text-yellow-300' : 'bg-[#0b1118]'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Section Heading matching Column 3 */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
            accessibility.highContrast
              ? 'bg-yellow-400/20 border-2 border-yellow-400 text-yellow-300'
              : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
          }`}>
            <Sliders className="w-3.5 h-3.5" />
            <span>Inclusive Design Suite</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            accessibility.highContrast ? 'text-yellow-300' : 'text-slate-100'
          }`}>
            Accessibility & Neurodivergent Tools
          </h2>
          <div className={`w-16 h-1 mx-auto mt-3 rounded-full ${
            accessibility.highContrast ? 'bg-yellow-400' : 'bg-gradient-to-r from-amber-400 to-cyan-500'
          }`} />
          <p className={`mt-3 text-sm sm:text-base max-w-xl mx-auto ${
            accessibility.highContrast ? 'text-yellow-200' : 'text-slate-400'
          }`}>
            Experience real-time reading ergonomics designed specifically for students with Dyslexia, ADHD, and Low-Vision constraints.
          </p>
        </div>

        {/* Top Toggles Bar - Matching Reference Image */}
        <div className={`p-4 sm:p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 shadow-lg ${
          accessibility.highContrast
            ? 'bg-black border-2 border-yellow-400'
            : 'bg-[#111a24] border border-[#203447]'
        }`}>
          {/* OpenDyslexic Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>OpenDyslexic Font</span>
            </span>
            <button
              id="toggle-dyslexic-main"
              onClick={toggleDyslexic}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                accessibility.openDyslexic ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  accessibility.openDyslexic ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-mono text-amber-300">
              {accessibility.openDyslexic ? 'ACTIVE' : 'OFF'}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Bionic Reading Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Bionic Reading</span>
            </span>
            <button
              id="toggle-bionic-main"
              onClick={toggleBionic}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                accessibility.bionicReading ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  accessibility.bionicReading ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-mono text-cyan-300">
              {accessibility.bionicReading ? 'ACTIVE' : 'OFF'}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* High-Contrast Mode Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Contrast className="w-4 h-4 text-yellow-400" />
              <span>High-Contrast Mode</span>
            </span>
            <button
              id="toggle-high-contrast-main"
              onClick={toggleHighContrast}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                accessibility.highContrast ? 'bg-yellow-400' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  accessibility.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-mono text-yellow-300 font-bold">
              {accessibility.highContrast ? 'ACTIVE' : 'OFF'}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden lg:block" />

          {/* Fluid AI Cursor Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-orange-400" />
              <span>Fluid AI Cursor</span>
            </span>
            <button
              id="toggle-custom-cursor-main"
              onClick={toggleCustomCursor}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                accessibility.customCursor !== false ? 'bg-[#ea580c]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  accessibility.customCursor !== false ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-mono text-orange-300 font-bold">
              {accessibility.customCursor !== false ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Comparison Cards - 3-column layout showcasing all three accessibility features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: OpenDyslexic Demonstration */}
          <div className={`p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all ${
            accessibility.highContrast
              ? 'bg-black border-2 border-yellow-400'
              : 'bg-[#111a24] border border-[#203447]'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${accessibility.highContrast ? 'text-yellow-300' : 'text-slate-100'}`}>OpenDyslexic Typography</h4>
                    <p className={`text-[11px] ${accessibility.highContrast ? 'text-yellow-200' : 'text-slate-400'}`}>Gravity-weighted letter baselines</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  accessibility.openDyslexic ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {accessibility.openDyslexic ? 'Enabled' : 'Preview'}
                </span>
              </div>

              <div className={`p-5 rounded-xl min-h-[170px] ${
                accessibility.highContrast
                  ? 'bg-black border border-yellow-400/80'
                  : 'bg-[#091119] border border-slate-800/80'
              }`}>
                <p className={`text-base leading-relaxed ${
                  accessibility.highContrast ? 'text-yellow-300' : 'text-slate-200'
                } ${accessibility.openDyslexic ? 'font-dyslexic' : ''}`}>
                  {accessibility.openDyslexic ? (
                    sampleCardText
                  ) : (
                    <span className="font-sans">
                      Quantum mechanics kya hai, saral bhasha mein batao? Yeh test hai saral bhasha mein. Heavy bottom letter weights indicate orientation so letters like b, d, p, and q don't flip in the mind.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
              accessibility.highContrast ? 'border-yellow-400/50 text-yellow-200' : 'border-slate-800/60 text-slate-400'
            }`}>
              <span>Prevents letter rotation</span>
              <button
                onClick={() => speakText(sampleCardText, selectedLanguage.code || 'hi-IN', accessibility.speechSpeed)}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear</span>
              </button>
            </div>
          </div>

          {/* Card 2: Bionic Reading Mode Demonstration */}
          <div className={`p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all ${
            accessibility.highContrast
              ? 'bg-black border-2 border-yellow-400'
              : 'bg-[#111a24] border border-[#203447]'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${accessibility.highContrast ? 'text-yellow-300' : 'text-slate-100'}`}>Bionic Reading</h4>
                    <p className={`text-[11px] ${accessibility.highContrast ? 'text-yellow-200' : 'text-slate-400'}`}>Artificial visual fixation points</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  accessibility.bionicReading ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {accessibility.bionicReading ? 'Enabled' : 'Live Sample'}
                </span>
              </div>

              <div className={`p-5 rounded-xl min-h-[170px] ${
                accessibility.highContrast
                  ? 'bg-black border border-yellow-400/80'
                  : 'bg-[#091119] border border-slate-800/80'
              }`}>
                <p className={`text-base leading-relaxed ${
                  accessibility.highContrast ? 'text-yellow-300' : 'text-slate-200'
                } ${accessibility.openDyslexic ? 'font-dyslexic' : ''}`}>
                  {formatBionicReading("Bionic reading accelerates comprehension by guiding eyes through text with artificial fixation points. Students read smoothly without eye-wandering fatigue.")}
                </p>
              </div>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
              accessibility.highContrast ? 'border-yellow-400/50 text-yellow-200' : 'border-slate-800/60 text-slate-400'
            }`}>
              <span>Reduces saccadic eye skips</span>
              <button
                onClick={() => speakText("Bionic reading accelerates reading comprehension by guiding eyes through text.", selectedLanguage.code || 'en-US', accessibility.speechSpeed)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear</span>
              </button>
            </div>
          </div>

          {/* Card 3: High-Contrast Mode Demonstration */}
          <div className={`p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all ${
            accessibility.highContrast
              ? 'bg-black border-2 border-yellow-400 ring-2 ring-yellow-400/30'
              : 'bg-[#111a24] border border-[#203447]'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                    <Contrast className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${accessibility.highContrast ? 'text-yellow-300' : 'text-slate-100'}`}>High-Contrast Mode</h4>
                    <p className={`text-[11px] ${accessibility.highContrast ? 'text-yellow-200' : 'text-slate-400'}`}>Pure Black & High-Luminance Yellow</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  accessibility.highContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {accessibility.highContrast ? 'ACTIVE (7:1+ AAA)' : 'WCAG AAA'}
                </span>
              </div>

              <div className="p-5 rounded-xl bg-black border-2 border-yellow-400 min-h-[170px]">
                <p className={`text-base leading-relaxed text-[#ffff00] font-bold ${accessibility.openDyslexic ? 'font-dyslexic' : ''}`}>
                  {accessibility.bionicReading 
                    ? formatBionicReading("High-contrast mode eliminates ocular glare and delivers pure #FFFF00 yellow text on a true #000000 black canvas for visually impaired learners.")
                    : "High-contrast mode eliminates ocular glare and delivers pure #FFFF00 yellow text on a true #000000 black canvas for visually impaired learners."
                  }
                </p>
              </div>
            </div>

            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
              accessibility.highContrast ? 'border-yellow-400/50 text-yellow-200' : 'border-slate-800/60 text-slate-400'
            }`}>
              <span>Ideal for low-vision & photophobia</span>
              <button
                onClick={() => speakText("High contrast mode active. Yellow text on pure black canvas.", selectedLanguage.code || 'en-US', accessibility.speechSpeed)}
                className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 font-bold cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Sandbox Box */}
        <div className={`mt-8 p-5 sm:p-6 rounded-2xl transition-all ${
          accessibility.highContrast
            ? 'bg-black border-2 border-yellow-400'
            : 'bg-[#111a24] border border-[#203447]'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              accessibility.highContrast ? 'text-yellow-300' : 'text-amber-300'
            }`}>
              <Type className="w-4 h-4" />
              <span>Interactive Accessibility Sandbox (Type your own sentence)</span>
            </span>
            <span className={`text-[11px] ${accessibility.highContrast ? 'text-yellow-300 font-semibold' : 'text-slate-400'}`}>
              Live preview active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`text-xs mb-1 block ${accessibility.highContrast ? 'text-yellow-200' : 'text-slate-400'}`}>
                Input Text:
              </label>
              <textarea
                value={customTestInput}
                onChange={(e) => setCustomTestInput(e.target.value)}
                rows={3}
                className={`w-full rounded-xl p-3 text-xs sm:text-sm focus:outline-none resize-none transition-all ${
                  accessibility.highContrast
                    ? 'bg-black border-2 border-yellow-400 text-yellow-300 focus:border-yellow-300 font-bold placeholder-yellow-600'
                    : 'bg-[#091119] border border-slate-800 text-slate-200 focus:border-amber-400'
                }`}
                placeholder="Type or paste any student note or dialect sentence..."
              />
            </div>

            <div>
              <label className={`text-xs mb-1 block ${accessibility.highContrast ? 'text-yellow-200' : 'text-slate-400'}`}>
                Resulting View ({accessibility.highContrast ? 'High-Contrast + ' : ''}Dyslexic + Bionic applied):
              </label>
              <div className={`w-full rounded-xl p-3 text-xs sm:text-sm min-h-[85px] leading-relaxed overflow-y-auto ${
                accessibility.highContrast
                  ? 'bg-black border-2 border-yellow-400 text-[#ffff00] font-bold'
                  : 'bg-[#091119] border border-slate-800 text-slate-200'
              } ${accessibility.openDyslexic ? 'font-dyslexic' : ''}`}>
                {accessibility.bionicReading ? formatBionicReading(customTestInput) : customTestInput}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
