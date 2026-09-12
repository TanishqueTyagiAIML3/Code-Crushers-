import React from 'react';
import { DiverseLearnersGroupArtwork } from './ArtworkIllustrations';
import { Heart, Users, Globe2, ShieldCheck, Github, Video, Code2, ExternalLink } from 'lucide-react';

export function ImpactSection() {
  const teamMembers = [
    { name: 'Aarav Sharma', role: 'AI & Speech Lead', initials: 'AS', color: 'from-amber-500 to-amber-700' },
    { name: 'Priya Patel', role: 'Accessibility & Neurodiversity', initials: 'PP', color: 'from-cyan-500 to-blue-700' },
    { name: 'Rohit Verma', role: 'Full Stack & FastAPI', initials: 'RV', color: 'from-emerald-500 to-emerald-700' },
    { name: 'Ananya Roy', role: 'Dialect Models & Speech AI', initials: 'AR', color: 'from-purple-500 to-pink-700' }
  ];

  return (
    <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a1017] border-t border-[#1a2837]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading matching Column 3 bottom */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5" />
            <span>Inclusive Learning Mission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Impact and Inclusivity
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-rose-400 to-amber-500 mx-auto mt-3 rounded-full" />
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Ensuring no child in rural or marginalized communities is excluded from the future of technology and higher learning.
          </p>
        </div>

        {/* Impact Content Box */}
        <div className="bg-[#111a24] p-6 sm:p-8 rounded-3xl border border-[#213548] shadow-2xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Diverse Learners Group Artwork */}
            <div className="lg:col-span-6 w-full">
              <DiverseLearnersGroupArtwork />
            </div>

            {/* Impact Highlights from image.png */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#091119] border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-100">14+ Indian Languages</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Covering Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#091119] border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-100">Regional Dialect Support</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Deep contextual recognition of non-standard colloquial dialects (Awadhi, Bhojpuri, Varhadi, Kathiyawadi) that conventional tools ignore.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#091119] border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-100">Accessibility Statement</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    OpenDyslexic typography, Bionic Reading fixations, and 100% speech-synthesized screen-free learning for visually impaired students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team & Links Block - Matching image.png footer */}
        <div className="bg-[#111a24] p-6 sm:p-8 rounded-3xl border border-[#213548] text-center space-y-6">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Developed by [ShikshaSathi Hackathon Team]
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 group">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center font-bold text-slate-100 text-sm border-2 border-slate-800 group-hover:scale-105 transition-transform shadow-md`}>
                    {member.initials}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{member.name}</span>
                  <span className="text-[10px] text-slate-400">{member.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links matching reference */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Project Source</span>
            </a>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => alert('Pitch Video demo is active in the Explore Demo modal!')}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Pitch Video</span>
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => alert('Gemini Multimodal API docs are integrated into the architecture section.')}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>APIs & Documentation</span>
            </button>
          </div>

          {/* Tagline & Copyright from Reference Image */}
          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-base sm:text-lg font-bold text-amber-300 tracking-tight">
              A Voice for every Learner.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Harnessing Gemini Multimodal APIs | <span className="text-slate-300">shikshasathi.ai</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
