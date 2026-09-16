import React, { useState } from 'react';
import { Volume2, Play, Square, Globe, Sparkles, MapPin } from 'lucide-react';
import { INDIAN_LANGUAGES, MAP_REGIONS } from '../data/languages';
import { speakText, stopSpeech } from '../utils/bionic';
import { DialectOption } from '../types';
import { useLanguage } from '../context/LanguageContext';

export function LanguageSelectionSection() {
  const { selectedLanguage: selectedDialect, setSelectedLanguage } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeRegion, setActiveRegion] = useState('north');

  const handlePlayVoice = (dialect: DialectOption) => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(dialect.sampleResponse, dialect.code || 'hi-IN', 0.95, () => setIsPlayingAudio(false));
    }
  };

  return (
    <section id="languages" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0c141d] border-t border-[#1a2b3c]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Bharat Language Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Language & Dialect Selection
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-cyan-500 mx-auto mt-3 rounded-full" />
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Supporting 14+ official Indian languages with fine-grained regional dialect adaptation, colloquial metaphors, and natural spoken cadences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#111a24] p-6 sm:p-8 rounded-3xl border border-[#213548] shadow-2xl">
          {/* Left Column: Dialect details & interactive audio */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap gap-2">
              {INDIAN_LANGUAGES.map((dialect) => (
                <button
                  key={dialect.id}
                  onClick={() => {
                    setSelectedLanguage(dialect);
                    if (isPlayingAudio) {
                      stopSpeech();
                      setIsPlayingAudio(false);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedDialect.id === dialect.id
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#0a1118] text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{dialect.nativeName}</span>
                  <span className="text-[10px] opacity-75">({dialect.name})</span>
                </button>
              ))}
            </div>

            {/* Selected Dialect Showcase Box */}
            <div className="bg-[#0b1219] p-5 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                    <span>{selectedDialect.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
                      {selectedDialect.nativeName}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>Region: {selectedDialect.region}</span>
                  </p>
                </div>

                <button
                  onClick={() => handlePlayVoice(selectedDialect)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Pause Speech</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Play Dialect Audio</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Query & Answer */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Student Spoken Query ({selectedDialect.name}):
                  </span>
                  <p className="text-slate-200 italic">
                    "{selectedDialect.sampleQuery}"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                    ShikshaSathi Spoken Dialect Response:
                  </span>
                  <p className="text-amber-100 leading-relaxed">
                    "{selectedDialect.sampleResponse}"
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-cyan-300/80 bg-cyan-950/20 p-2 rounded-lg border border-cyan-500/20">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Nuance Note: {selectedDialect.accentNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map of India */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-[4/5] bg-gradient-to-b from-[#09111a] to-[#0d1622] rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between text-xs pb-2 border-b border-slate-800/60">
                <span className="font-bold text-slate-200">Dialect Density Map</span>
                <span className="text-[10px] text-emerald-400">14+ Zones Active</span>
              </div>

              {/* Stylized SVG Map of India */}
              <svg className="w-full h-56 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.15)]" viewBox="0 0 320 340" fill="none">
                {/* Kashmir & North */}
                <path
                  d="M135 25 L165 20 L185 45 L175 75 L145 80 L125 50 Z"
                  fill="#f59e0b"
                  opacity={activeRegion === 'north' ? 0.9 : 0.4}
                  className="cursor-pointer transition-opacity hover:opacity-100"
                  onClick={() => setActiveRegion('north')}
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                />
                <text x="155" y="50" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
                  North (अवधी/भोजपुरी)
                </text>

                {/* Central / Gangetic Plains */}
                <path
                  d="M120 85 L180 80 L230 110 L195 160 L130 150 L105 110 Z"
                  fill="#fb923c"
                  opacity={0.8}
                  stroke="#fdba74"
                  strokeWidth="1.5"
                  className="cursor-pointer"
                />

                {/* Western India (Maharashtra, Gujarat) */}
                <path
                  d="M80 120 L130 145 L120 220 L65 210 L60 140 Z"
                  fill="#10b981"
                  opacity={activeRegion === 'west' ? 0.9 : 0.4}
                  className="cursor-pointer transition-opacity hover:opacity-100"
                  onClick={() => setActiveRegion('west')}
                  stroke="#34d399"
                  strokeWidth="1.5"
                />
                <text x="95" y="175" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">
                  West (मराठी/गुजराती)
                </text>

                {/* Eastern & North-East */}
                <path
                  d="M210 110 L275 105 L300 135 L260 180 L200 150 Z"
                  fill="#ec4899"
                  opacity={activeRegion === 'east' ? 0.9 : 0.4}
                  className="cursor-pointer transition-opacity hover:opacity-100"
                  onClick={() => setActiveRegion('east')}
                  stroke="#f472b6"
                  strokeWidth="1.5"
                />
                <text x="250" y="140" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">
                  East (বাংলা/অসমীয়া)
                </text>

                {/* South India Peninsula */}
                <path
                  d="M110 220 L185 200 L160 305 L130 320 L105 260 Z"
                  fill="#6366f1"
                  opacity={activeRegion === 'south' ? 0.9 : 0.4}
                  className="cursor-pointer transition-opacity hover:opacity-100"
                  onClick={() => setActiveRegion('south')}
                  stroke="#818cf8"
                  strokeWidth="1.5"
                />
                <text x="140" y="260" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  South (தமிழ்/తెలుగు)
                </text>

                {/* Soundwave beacon circles on regions */}
                <circle cx="155" cy="50" r="14" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
                <circle cx="95" cy="175" r="14" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
                <circle cx="140" cy="260" r="14" stroke="#6366f1" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
              </svg>

              {/* Regional Legend */}
              <div className="w-full grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80 text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span>North (Awadhi/Bhojpuri)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span>West (Varhadi/Gujarati)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                  <span>South (Tamil/Telugu)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                  <span>East (Bangla/Odia)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
