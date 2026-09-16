import React from 'react';

/**
 * Custom SVG vector illustration of the Hero Studio Microphone with radial sound waves
 */
export function HeroMicrophoneArtwork({ isLive = false }: { isLive?: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72 mx-auto">
      {/* Outer pulsating soundwave rings */}
      <div className={`absolute inset-0 rounded-full border border-amber-500/20 ${isLive ? 'animate-ping' : 'animate-pulse-wave'}`} style={{ animationDuration: '3.5s' }} />
      <div className="absolute inset-4 rounded-full border border-amber-400/30 animate-pulse-wave" style={{ animationDuration: '2.8s', animationDelay: '0.4s' }} />
      <div className="absolute inset-8 rounded-full border border-amber-300/40 animate-pulse-wave" style={{ animationDuration: '2.2s', animationDelay: '0.8s' }} />
      <div className="absolute inset-12 rounded-full border border-cyan-400/30 animate-pulse-wave" style={{ animationDuration: '1.8s' }} />

      {/* Golden radial background glow */}
      <div className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500/20 via-amber-300/15 to-cyan-500/15 blur-2xl" />

      {/* Decorative vertical acoustic sound wave lines (left and right) */}
      <div className="absolute -left-12 sm:-left-20 flex items-center gap-1.5 opacity-70">
        <div className="w-1 bg-amber-400/50 rounded-full animate-wave-bar-1" />
        <div className="w-1 bg-amber-400/70 rounded-full animate-wave-bar-3" />
        <div className="w-1 bg-amber-300/90 rounded-full animate-wave-bar-2" />
        <div className="w-1 bg-amber-400/80 rounded-full animate-wave-bar-4" />
        <div className="w-1 bg-amber-500/60 rounded-full animate-wave-bar-5" />
      </div>

      <div className="absolute -right-12 sm:-right-20 flex items-center gap-1.5 opacity-70">
        <div className="w-1 bg-amber-500/60 rounded-full animate-wave-bar-5" />
        <div className="w-1 bg-amber-400/80 rounded-full animate-wave-bar-4" />
        <div className="w-1 bg-amber-300/90 rounded-full animate-wave-bar-2" />
        <div className="w-1 bg-amber-400/70 rounded-full animate-wave-bar-3" />
        <div className="w-1 bg-amber-400/50 rounded-full animate-wave-bar-1" />
      </div>

      {/* Studio Microphone SVG */}
      <svg className="w-32 h-32 relative z-10 filter drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]" viewBox="0 0 100 100" fill="none">
        {/* Outer stand ring */}
        <circle cx="50" cy="46" r="32" stroke="url(#goldGradient)" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.6" />
        
        {/* Shock mount elastic bands */}
        <line x1="28" y1="46" x2="38" y2="46" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <line x1="62" y1="46" x2="72" y2="46" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="20" x2="50" y2="28" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="64" x2="50" y2="72" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />

        {/* Microphone capsule capsule body */}
        <rect x="38" y="24" width="24" height="38" rx="12" fill="url(#silverGradient)" stroke="#f59e0b" strokeWidth="2" />
        
        {/* Metal grille grid */}
        <line x1="42" y1="28" x2="58" y2="28" stroke="#64748b" strokeWidth="1.2" />
        <line x1="40" y1="32" x2="60" y2="32" stroke="#64748b" strokeWidth="1.2" />
        <line x1="40" y1="36" x2="60" y2="36" stroke="#64748b" strokeWidth="1.2" />
        <line x1="42" y1="40" x2="58" y2="40" stroke="#64748b" strokeWidth="1.2" />

        {/* Center acoustic ring */}
        <rect x="37" y="44" width="26" height="3" fill="#f59e0b" rx="1.5" />

        {/* Mic base stand */}
        <path d="M42 66 H58 V78 H42 Z" fill="url(#silverGradient)" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="32" y="78" width="36" height="5" rx="2.5" fill="#f59e0b" />

        {/* Gradients */}
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="silverGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="40%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Illustration of Rural student with turban & backpack + visually impaired student with glasses & phone
 * Matching Card 1 of "Our Vision" in image.png
 */
export function RuralAndBlindStudentsArtwork() {
  return (
    <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-gradient-to-b from-[#1b2b3a] to-[#121c26] border border-amber-500/20 flex items-center justify-center p-3 shadow-lg">
      {/* Background rural landscape: green field, soft hills, warm sky */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 240">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#fde68a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#86efac" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="fieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="150" fill="url(#skyGrad)" />
        {/* Distant Trees & Rural Hills */}
        <path d="M 0 140 Q 80 120 180 135 T 400 130 L 400 240 L 0 240 Z" fill="#166534" opacity="0.4" />
        {/* Wheat/Paddy Field */}
        <path d="M 0 160 Q 120 145 240 155 T 400 150 L 400 240 L 0 240 Z" fill="url(#fieldGrad)" />
        
        {/* Sun in distant background */}
        <circle cx="200" cy="85" r="28" fill="#fef08a" opacity="0.4" />
      </svg>

      {/* Characters Graphic: Rural Young Man + Visually Impaired Girl */}
      <div className="relative z-10 flex items-end justify-center gap-4 sm:gap-8 w-full max-w-sm pt-4">
        {/* Student 1: Rural young man with turban & backpack */}
        <div className="flex flex-col items-center">
          <svg className="w-32 h-44 sm:w-36 sm:h-48 drop-shadow-md" viewBox="0 0 100 140" fill="none">
            {/* Backpack strap */}
            <path d="M 28 65 Q 24 90 28 115" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
            <rect x="18" y="70" width="12" height="35" rx="3" fill="#78350f" />

            {/* Body / Kurta */}
            <path d="M 32 60 L 70 60 L 75 125 L 26 125 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
            <line x1="51" y1="60" x2="51" y2="100" stroke="#d97706" strokeWidth="1.5" />

            {/* Neck */}
            <rect x="46" y="48" width="10" height="14" fill="#d97706" />

            {/* Head & Beard */}
            <circle cx="51" cy="40" r="14" fill="#f59e0b" />
            <path d="M 40 40 Q 51 56 62 40 Z" fill="#451a03" /> {/* Beard */}
            {/* Eyes, Nose, Smile */}
            <circle cx="46" cy="38" r="1.5" fill="#1e293b" />
            <circle cx="55" cy="38" r="1.5" fill="#1e293b" />
            <path d="M 49 43 Q 51 45 53 43" stroke="#451a03" strokeWidth="1.2" strokeLinecap="round" />

            {/* Rural Turban (Gamchha / Pagdi) */}
            <path d="M 34 32 Q 51 14 68 32 Q 51 22 34 32 Z" fill="#ea580c" />
            <path d="M 33 28 Q 50 18 67 28 Q 51 10 33 28 Z" fill="#fb923c" />
            <path d="M 34 30 L 26 44 L 32 46 Z" fill="#ea580c" /> {/* Turban fold tail */}

            {/* Hands holding smartphone */}
            <path d="M 62 78 Q 72 86 65 98" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />
            <rect x="62" y="86" width="12" height="22" rx="2" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.2" />
            <circle cx="68" cy="97" r="2" fill="#38bdf8" />
          </svg>
          <span className="text-[11px] font-semibold text-amber-200 bg-black/40 px-2 py-0.5 rounded-full border border-amber-500/30 -mt-2">
            Rural Learner (Awadhi)
          </span>
        </div>

        {/* Student 2: Visually Impaired Indian girl with dark glasses, audio wave headset */}
        <div className="flex flex-col items-center">
          <svg className="w-32 h-44 sm:w-36 sm:h-48 drop-shadow-md" viewBox="0 0 100 140" fill="none">
            {/* Traditional Salwar / Kurti (Blue & Dupatta) */}
            <path d="M 30 62 L 72 62 L 76 125 L 26 125 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            {/* Dupatta drape */}
            <path d="M 36 62 Q 51 85 66 62" stroke="#bae6fd" strokeWidth="5" strokeLinecap="round" fill="none" />

            {/* Neck */}
            <rect x="46" y="50" width="10" height="13" fill="#f59e0b" />

            {/* Face & Hair */}
            <path d="M 34 38 C 34 22 68 22 68 38 C 68 46 64 54 51 54 C 38 54 34 46 34 38 Z" fill="#1e1b4b" />
            <circle cx="51" cy="42" r="13" fill="#fbbf24" />
            {/* Hair bangs */}
            <path d="M 38 35 Q 51 28 64 35 Q 51 22 38 35 Z" fill="#0f172a" />

            {/* Dark Glasses (Visually impaired indicator) */}
            <rect x="40" y="38" width="9" height="7" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <rect x="52" y="38" width="9" height="7" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <line x1="49" y1="41" x2="52" y2="41" stroke="#0f172a" strokeWidth="1.5" />

            {/* Gentle Smile */}
            <path d="M 47 48 Q 51 51 55 48" stroke="#78350f" strokeWidth="1.3" strokeLinecap="round" />

            {/* Hand holding phone with Audio Waves emitting */}
            <rect x="30" y="86" width="12" height="22" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
            <circle cx="36" cy="97" r="2" fill="#38bdf8" />
            {/* Audio Waves from phone to ear */}
            <path d="M 28 92 Q 22 96 28 102" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M 24 88 Q 16 96 24 105" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          <span className="text-[11px] font-semibold text-cyan-200 bg-black/40 px-2 py-0.5 rounded-full border border-cyan-500/30 -mt-2">
            Audio / Screen-Free Learner
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Illustration of two smiling students with smartphones conversing naturally
 * Matching Card 2 of "Our Vision" in image.png
 */
export function StudentsAdaptingArtwork() {
  return (
    <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-gradient-to-b from-[#192634] to-[#0f1721] border border-amber-500/20 flex items-center justify-center p-3 shadow-lg">
      {/* Dynamic sound wave circles in center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 rounded-full border border-amber-400/20 animate-pulse-wave" />
        <div className="w-36 h-36 rounded-full border border-cyan-400/15 animate-pulse-wave" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Central Voice AI Beacon */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1e293b]/90 border border-amber-400/40 px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 z-20">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[11px] font-bold text-amber-300">ShikshaSathi Voice Core</span>
      </div>

      {/* Two Smiling Students */}
      <div className="relative z-10 flex items-end justify-between w-full max-w-xs px-2 pt-6">
        {/* Male student in white collared shirt */}
        <div className="flex flex-col items-center">
          <svg className="w-32 h-44 drop-shadow-md" viewBox="0 0 100 140" fill="none">
            {/* White shirt */}
            <path d="M 30 62 L 72 62 L 76 125 L 26 125 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <path d="M 44 62 L 51 72 L 58 62" stroke="#94a3b8" strokeWidth="1.5" fill="none" />

            {/* Neck & Head */}
            <rect x="46" y="50" width="10" height="13" fill="#f59e0b" />
            <circle cx="51" cy="40" r="14" fill="#fbbf24" />
            {/* Modern hair */}
            <path d="M 36 36 C 36 20 66 20 66 36 C 66 30 58 24 51 24 C 44 24 38 28 36 36 Z" fill="#0f172a" />

            {/* Eyes and Happy Smile */}
            <circle cx="46" cy="38" r="1.5" fill="#0f172a" />
            <circle cx="56" cy="38" r="1.5" fill="#0f172a" />
            <path d="M 47 46 Q 51 51 55 46" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />

            {/* Holding phone with microphone */}
            <rect x="62" y="80" width="13" height="24" rx="2.5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="68.5" cy="92" r="3" fill="#f59e0b" />
          </svg>
          <span className="text-[11px] font-semibold text-amber-200 bg-slate-900/60 px-2 py-0.5 rounded-full border border-amber-500/20">
            Natural Dialect
          </span>
        </div>

        {/* Floating Voice Hub in center */}
        <div className="flex flex-col items-center justify-center -mb-2">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-lg">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
          <span className="text-[10px] text-slate-300 mt-1 font-mono">Multilingual ASR</span>
        </div>

        {/* Female student in Indian blue dress with dupatta */}
        <div className="flex flex-col items-center">
          <svg className="w-32 h-44 drop-shadow-md" viewBox="0 0 100 140" fill="none">
            {/* Kurti & Dupatta */}
            <path d="M 28 62 L 72 62 L 76 125 L 24 125 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <path d="M 32 62 Q 50 82 68 62" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Neck & Head */}
            <rect x="46" y="50" width="10" height="13" fill="#f59e0b" />
            <circle cx="51" cy="40" r="14" fill="#fbbf24" />
            {/* Long Hair with Bindi */}
            <path d="M 33 40 C 33 20 68 20 68 40 C 72 65 65 85 64 95 C 58 75 58 60 58 52 C 50 52 44 60 38 68 C 34 55 33 46 33 40 Z" fill="#0f172a" />
            <circle cx="51" cy="35" r="1.2" fill="#ef4444" /> {/* Bindi */}

            {/* Eyes and confident smile */}
            <circle cx="46" cy="38" r="1.5" fill="#0f172a" />
            <circle cx="56" cy="38" r="1.5" fill="#0f172a" />
            <path d="M 47 46 Q 51 51 55 46" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />

            {/* Phone */}
            <rect x="25" y="80" width="13" height="24" rx="2.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="31.5" cy="92" r="3" fill="#38bdf8" />
          </svg>
          <span className="text-[11px] font-semibold text-cyan-200 bg-slate-900/60 px-2 py-0.5 rounded-full border border-cyan-500/20">
            Neurodivergent Friendly
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Illustration of Indian learners in classroom / community study group
 * Matching "Impact and Inclusivity" in image.png
 */
export function DiverseLearnersGroupArtwork() {
  return (
    <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-gradient-to-r from-[#172534] via-[#1b2b3b] to-[#14202c] border border-amber-500/20 flex items-center justify-center p-3 shadow-md">
      {/* Classroom chalkboard/board subtle background */}
      <div className="absolute inset-x-6 top-3 h-16 rounded-md bg-[#0f1f1d] border border-emerald-500/20 opacity-40 flex items-center justify-around px-4">
        <span className="text-xs font-mono text-emerald-300/60">14+ Languages</span>
        <span className="text-xs font-mono text-amber-300/60">Voice-First AI</span>
        <span className="text-xs font-mono text-cyan-300/60">Multimodal + Gemini</span>
      </div>

      {/* 4 Indian students around table */}
      <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-6 pt-6">
        {/* Student A (young boy in yellow kurta) */}
        <div className="flex flex-col items-center">
          <svg className="w-20 h-28" viewBox="0 0 80 100" fill="none">
            <path d="M 20 48 L 60 48 L 64 100 L 16 100 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1.2" />
            <circle cx="40" cy="30" r="12" fill="#fbbf24" />
            <path d="M 28 26 C 28 14 52 14 52 26 Z" fill="#1e293b" />
            <circle cx="36" cy="30" r="1.5" fill="#0f172a" />
            <circle cx="44" cy="30" r="1.5" fill="#0f172a" />
            <path d="M 37 36 Q 40 39 43 36" stroke="#451a03" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Student B (student in blue school uniform) */}
        <div className="flex flex-col items-center">
          <svg className="w-24 h-32" viewBox="0 0 80 100" fill="none">
            <path d="M 18 45 L 62 45 L 66 100 L 14 100 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.2" />
            <circle cx="40" cy="28" r="13" fill="#f59e0b" />
            <path d="M 26 24 C 26 12 54 12 54 24 Z" fill="#0f172a" />
            <circle cx="36" cy="27" r="1.5" fill="#0f172a" />
            <circle cx="44" cy="27" r="1.5" fill="#0f172a" />
            <path d="M 36 34 Q 40 38 44 34" stroke="#451a03" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Student C (young girl with plaited hair and red scarf) */}
        <div className="flex flex-col items-center">
          <svg className="w-20 h-28" viewBox="0 0 80 100" fill="none">
            <path d="M 20 48 L 60 48 L 64 100 L 16 100 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="1.2" />
            <circle cx="40" cy="30" r="12" fill="#fbbf24" />
            <path d="M 26 26 C 26 14 54 14 54 26 C 58 40 54 55 52 65 Z" fill="#0f172a" />
            <circle cx="36" cy="30" r="1.5" fill="#0f172a" />
            <circle cx="44" cy="30" r="1.5" fill="#0f172a" />
            <path d="M 37 36 Q 40 39 43 36" stroke="#451a03" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Student D (college/elder student with glasses) */}
        <div className="flex flex-col items-center">
          <svg className="w-24 h-32" viewBox="0 0 80 100" fill="none">
            <path d="M 18 45 L 62 45 L 66 100 L 14 100 Z" fill="#10b981" stroke="#059669" strokeWidth="1.2" />
            <circle cx="40" cy="28" r="13" fill="#f59e0b" />
            <path d="M 26 22 C 26 10 54 10 54 22 Z" fill="#0f172a" />
            <rect x="32" y="25" width="7" height="6" rx="1.5" stroke="#0f172a" strokeWidth="1" fill="none" />
            <rect x="41" y="25" width="7" height="6" rx="1.5" stroke="#0f172a" strokeWidth="1" fill="none" />
            <path d="M 36 34 Q 40 37 44 34" stroke="#451a03" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
