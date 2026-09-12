import React from 'react';
import { Cpu, Database, Layout, Sparkles, ArrowRightLeft, Radio, Network } from 'lucide-react';

export function ArchitectureSection() {
  return (
    <section id="technology" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0c141e] border-t border-[#1a2b3c]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading matching Column 3 */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Under The Hood</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Technology & Architecture
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-amber-500 mx-auto mt-3 rounded-full" />
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Harnessing Google Gemini multimodal reasoning and high-fidelity Indic multilingual speech stack.
          </p>
        </div>

        {/* Top Tech Badges (Gemini APIs & Indic Multilingual Voice AI) - Matching reference layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gemini APIs Card */}
          <div className="bg-[#111a24] p-6 sm:p-7 rounded-2xl border border-[#213548] shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-sky-500/20 to-indigo-500/20 border border-amber-400/40 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">
                  Gemini APIs
                </h3>
                <span className="text-xs text-amber-300 font-mono font-medium">
                  Multimodal Reasoning & Synthesis
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              Powers deep conceptual understanding, diagram breakdown, adaptive question grading, and conversational dialect adaptation without losing scientific rigor.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                Context-Aware Reasoning
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                Visual Diagram Analysis
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                Real-Time Dialect Paraphrasing
              </span>
            </div>
          </div>

          {/* Multilingual Voice AI Card */}
          <div className="bg-[#111a24] p-6 sm:p-7 rounded-2xl border border-[#213548] shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-amber-500/20 to-emerald-500/20 border border-cyan-400/40 flex items-center justify-center shadow-lg">
                <Radio className="w-7 h-7 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">
                  Multilingual Voice AI
                </h3>
                <span className="text-xs text-cyan-300 font-mono font-medium">
                  Indic Language & Speech Processing
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              Provides sovereign Indian dialect Automatic Speech Recognition (ASR), phonetic Text-To-Speech (TTS), and regional translation pipelines across 14+ Indian languages.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                Dialect Speech Recognition (ASR)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                Human-Like Indian TTS
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                Vernacular Transliteration
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Architecture Diagram: React/TS <---> Supabase/FastAPI <---> Speech Engines */}
        <div className="bg-[#111a24] p-6 sm:p-8 rounded-3xl border border-[#213548] shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-200">End-to-End System Pipeline</h4>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              Low-Latency Audio Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Frontend Block */}
            <div className="bg-[#0b1219] p-5 rounded-2xl border border-slate-800 text-center relative group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3">
                <Layout className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-slate-100 text-sm">Frontend Layer</h5>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">React 19 + TypeScript</p>
              <ul className="text-[11px] text-slate-400 mt-3 space-y-1 text-left list-disc list-inside">
                <li>Voice recording & audio player</li>
                <li>OpenDyslexic typography</li>
                <li>Bionic Reading fixation parsing</li>
                <li>Sub-200ms tactile UI response</li>
              </ul>
            </div>

            {/* Middle Pipeline Arrow / Backend Block */}
            <div className="bg-[#0b1219] p-5 rounded-2xl border border-emerald-500/40 text-center relative shadow-lg shadow-emerald-950/30">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Database className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-slate-100 text-sm">Backend & Storage</h5>
              <p className="text-xs text-emerald-300 font-mono mt-0.5">Supabase / FastAPI</p>
              <ul className="text-[11px] text-slate-400 mt-3 space-y-1 text-left list-disc list-inside">
                <li>Adaptive learning performance logs</li>
                <li>Student progress vectors</li>
                <li>Offline caching for low-network areas</li>
                <li>Zero personal data tracking</li>
              </ul>
            </div>

            {/* AI & Dialect Speech Engine Block */}
            <div className="bg-[#0b1219] p-5 rounded-2xl border border-slate-800 text-center relative">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Cpu className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-slate-100 text-sm">Dialect AI Intelligence</h5>
              <p className="text-xs text-amber-300 font-mono mt-0.5">Gemini Multimodal</p>
              <ul className="text-[11px] text-slate-400 mt-3 space-y-1 text-left list-disc list-inside">
                <li>14+ Indian Language ASR & TTS</li>
                <li>Colloquial dialect idioms</li>
                <li>Diagram OCR & semantic graph</li>
                <li>Concept simplification engine</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
