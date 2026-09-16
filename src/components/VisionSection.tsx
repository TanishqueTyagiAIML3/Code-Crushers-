import React from 'react';
import { RuralAndBlindStudentsArtwork, StudentsAdaptingArtwork } from './ArtworkIllustrations';
import { CheckCircle2, XCircle, Sparkles, Volume2, Eye } from 'lucide-react';
import { AccessibilitySettings } from '../types';
import { formatBionicReading } from '../utils/bionic';

interface VisionSectionProps {
  accessibility: AccessibilitySettings;
}

export function VisionSection({ accessibility }: VisionSectionProps) {
  const quoteSnippet = "Standardized text, dictated by standardized text-based tools, builds insurmountable barriers for diverse learners.";
  const quoteDyslexic = "Bionic Reading mode empowers neurodivergent brains to navigate text with effortless cognitive flow.";

  return (
    <section id="vision" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a2837] bg-[#0c131a]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Our Vision
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-3 rounded-full" />
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Democratizing education across Bharat by replacing the text barrier with voice, dialect, and neurodivergent accessibility.
          </p>
        </div>

        {/* Vision Card 1: The Problem of Standardized Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center bg-[#111a24] p-5 sm:p-7 rounded-2xl border border-[#203447] shadow-xl">
          {/* Artwork: Rural & Visually Impaired Learners */}
          <div className="w-full">
            <RuralAndBlindStudentsArtwork />
          </div>

          {/* Vision Text 1 */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <span>The Language & Sensory Gap</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
              Standardized text leaves millions of eager minds behind.
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {accessibility.bionicReading ? formatBionicReading(quoteSnippet) : quoteSnippet}
            </p>

            <div className="p-4 rounded-xl bg-[#0b1219] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Bionic Reading & Spoken Clarity Sample:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{accessibility.bionicReading ? formatBionicReading(quoteDyslexic) : quoteDyslexic}"
              </p>
            </div>
          </div>
        </div>

        {/* Vision Card 2: Student Adapts vs AI Adapts */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center bg-[#111a24] p-5 sm:p-7 rounded-2xl border border-[#203447] shadow-xl">
          {/* Vision Text 2 */}
          <div className="space-y-4 order-2 md:order-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The ShikshaSathi Paradigm</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
              Students shouldn't have to alter their identity to understand science and math.
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              For decades, students in rural towns and non-English households were told they had to adapt to rigid textbook syntax.
            </p>

            {/* Comparison Callout: Student Adapts vs AI Adapts */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-slate-300 text-xs sm:text-sm">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-red-300">The Flawed Status Quo:</span> "Student Adapts" to complex English/Hindi text, alien terminology, and visual-only interfaces.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-slate-200 text-xs sm:text-sm shadow-md shadow-emerald-950/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-300">ShikshaSathi Vision:</span> "AI Adapts" to the student's native voice, local dialect nuances, and sensory needs in real-time.
                </div>
              </div>
            </div>
          </div>

          {/* Artwork: Students smiling with phone */}
          <div className="w-full order-1 md:order-2">
            <StudentsAdaptingArtwork />
          </div>
        </div>
      </div>
    </section>
  );
}
