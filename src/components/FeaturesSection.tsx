import React, { useState, useEffect } from 'react';
import { 
  Bot, CheckSquare, GitFork, FileText, Layers, Mic, 
  Volume2, Play, Square, Sparkles, Check, ChevronRight,
  TrendingUp, Award, RotateCw
} from 'lucide-react';
import { AccessibilitySettings } from '../types';
import { formatBionicReading, speakText, stopSpeech } from '../utils/bionic';
import { SAMPLE_QUIZ_QUESTIONS, DIAGRAM_STEPS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedQuiz, getLocalizedDiagram } from '../data/localizedContent';
import { INDIAN_LANGUAGES } from '../data/languages';

interface FeaturesSectionProps {
  accessibility: AccessibilitySettings;
  onOpenDemoTool: (toolId: string) => void;
}

export function FeaturesSection({ accessibility, onOpenDemoTool }: FeaturesSectionProps) {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  // AI Chat Phone State
  const [isPlayingChatAudio, setIsPlayingChatAudio] = useState(false);

  // Adaptive Quiz Phone State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(1);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [isQuizAudioPlaying, setIsQuizAudioPlaying] = useState(false);

  // Diagram Explainer State
  const [activeDiagramStep, setActiveDiagramStep] = useState(0);
  const [isDiagramAudioPlaying, setIsDiagramAudioPlaying] = useState(false);

  // Helper text renderer
  const renderText = (text: string) => {
    return accessibility.bionicReading ? formatBionicReading(text) : text;
  };

  const handleToggleChatAudio = () => {
    if (isPlayingChatAudio) {
      stopSpeech();
      setIsPlayingChatAudio(false);
    } else {
      setIsPlayingChatAudio(true);
      const textToSpeak = selectedLanguage.sampleResponse;
      speakText(textToSpeak, selectedLanguage.code || 'hi-IN', accessibility.speechSpeed || 0.95, () => setIsPlayingChatAudio(false));
    }
  };

  const handleToggleQuizAudio = (text: string) => {
    if (isQuizAudioPlaying) {
      stopSpeech();
      setIsQuizAudioPlaying(false);
    } else {
      setIsQuizAudioPlaying(true);
      speakText(text, selectedLanguage.code || 'hi-IN', accessibility.speechSpeed || 0.95, () => setIsQuizAudioPlaying(false));
    }
  };

  const handleToggleDiagramAudio = (text: string) => {
    if (isDiagramAudioPlaying) {
      stopSpeech();
      setIsDiagramAudioPlaying(false);
    } else {
      setIsDiagramAudioPlaying(true);
      speakText(text, selectedLanguage.code || 'hi-IN', accessibility.speechSpeed || 0.95, () => setIsDiagramAudioPlaying(false));
    }
  };

  // Reset interactive states when language changes so fresh localized content displays immediately
  useEffect(() => {
    setActiveQuizIndex(0);
    setSelectedAnswer(null);
    setActiveDiagramStep(0);
    stopSpeech();
    setIsQuizAudioPlaying(false);
    setIsDiagramAudioPlaying(false);
    setIsPlayingChatAudio(false);
  }, [selectedLanguage.id]);

  const localizedQuizList = getLocalizedQuiz(selectedLanguage.id);
  const currentQuiz = localizedQuizList[activeQuizIndex % localizedQuizList.length] || SAMPLE_QUIZ_QUESTIONS[0];
  const localizedDiagram = getLocalizedDiagram(selectedLanguage.id);
  const diagramSteps = (localizedDiagram.components && localizedDiagram.components.length > 0)
    ? localizedDiagram.components.map((c, i) => ({
        step: i + 1,
        title: c.name,
        explanation: c.functionDescription,
        description: c.functionDescription,
        dialectAudio: c.functionDescription,
        nodeColor: ['#f59e0b', '#0284c7', '#10b981', '#8b5cf6', '#ec4899'][i % 5]
      }))
    : DIAGRAM_STEPS;
  const currentDiagramStep = diagramSteps[activeDiagramStep % diagramSteps.length] || diagramSteps[0];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0b1118]">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading matching Column 2 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Tool Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Features
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-3 rounded-full" />
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            7 tailored learning instruments built for natural voice, regional dialect understanding, and zero cognitive strain.
          </p>
        </div>

        {/* Feature 1: AI Chat (Voice-First Sawaal Poochho) */}
        <div className="mb-16 bg-[#111a24] rounded-3xl border border-[#1f3245] p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Feature Info */}
            <div className="lg:col-span-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Bot className="w-7 h-7" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
                AI Chat
              </h3>

              <p className="text-amber-300/90 font-medium text-sm sm:text-base">
                "Sawaal Poochho" — Learn any complex topic through intuitive voice conversations in your home dialect.
              </p>

              <p className="text-slate-300 text-sm leading-relaxed">
                {renderText("Rather than memorizing dry textbook English, students can ask spontaneous spoken questions. The AI detects the regional dialect and breaks down concepts using relatable local analogies.")}
              </p>

              {/* Dialect selector chips */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-2 font-medium">Select Dialect / Language:</span>
                <div className="flex flex-wrap gap-2">
                  {INDIAN_LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        stopSpeech();
                        setSelectedLanguage(lang);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selectedLanguage.id === lang.id
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onOpenDemoTool('ai-chat')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-semibold text-sm transition-all"
                >
                  <span>Launch Interactive Chat Demo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Smartphone Mockup matching Reference Image */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[320px] sm:max-w-[340px] rounded-[36px] bg-[#070d14] border-[7px] border-[#223548] p-3 shadow-2xl relative overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="w-24 h-4 bg-[#223548] rounded-b-xl mx-auto -mt-3 mb-3 flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-600 rounded-full" />
                </div>

                {/* Chat Top Bar */}
                <div className="flex items-center justify-between px-2 py-2 border-b border-slate-800/80 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
                      <Mic className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">ShikshaSathi Voice</h4>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online • Dialect Aware
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                    {selectedLanguage.name}
                  </span>
                </div>

                {/* Chat Stream in Mobile Screen */}
                <div className="space-y-3 px-1 py-1 min-h-[260px] text-xs">
                  {/* User Voice Bubble */}
                  <div className="flex flex-col items-end">
                    <div className="bg-amber-500/20 border border-amber-500/30 text-amber-100 rounded-2xl rounded-tr-none px-3.5 py-2.5 max-w-[88%] shadow-sm">
                      <div className="flex items-center gap-2 mb-1 text-[10px] text-amber-300 font-semibold">
                        <Mic className="w-3 h-3 animate-pulse" />
                        <span>Student Voice (0:04)</span>
                      </div>
                      <p className="leading-relaxed">
                        {selectedLanguage.sampleQuery}
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-0.5 pr-1">Spoken in {selectedLanguage.nativeName} • 10:42 AM</span>
                  </div>

                  {/* AI Response Voice Bubble */}
                  <div className="flex flex-col items-start">
                    <div className="bg-[#121c27] border border-cyan-500/30 text-slate-200 rounded-2xl rounded-tl-none px-3.5 py-3 max-w-[92%] shadow-sm">
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800">
                        <div className="flex items-center gap-1.5 text-cyan-300 text-[10px] font-bold">
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI Explanation</span>
                        </div>
                        <button
                          onClick={handleToggleChatAudio}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-medium border border-amber-500/30 cursor-pointer"
                        >
                          {isPlayingChatAudio ? <Square className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
                          <span>{isPlayingChatAudio ? 'Stop' : 'Listen'}</span>
                        </button>
                      </div>

                      {/* Animated Audio Wave Bar Graphic */}
                      <div className="flex items-center gap-1 bg-[#0b1219] p-2 rounded-lg border border-slate-800 mb-2">
                        <div className="w-1 bg-amber-400 h-3 rounded-full animate-wave-bar-1" />
                        <div className="w-1 bg-amber-400 h-5 rounded-full animate-wave-bar-2" />
                        <div className="w-1 bg-cyan-400 h-2 rounded-full animate-wave-bar-3" />
                        <div className="w-1 bg-cyan-400 h-6 rounded-full animate-wave-bar-4" />
                        <div className="w-1 bg-amber-400 h-4 rounded-full animate-wave-bar-5" />
                        <div className="w-1 bg-amber-300 h-3 rounded-full animate-wave-bar-2" />
                        <span className="text-[9px] text-slate-400 ml-auto font-mono">0:18 audio</span>
                      </div>

                      <p className="text-[11px] leading-relaxed text-slate-200">
                        {selectedLanguage.sampleResponse}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Bottom Microphone Trigger Bar */}
                <div className="mt-3 p-2 bg-[#121c27] rounded-2xl border border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 pl-2">Tap mic or speak in dialect...</span>
                  <button 
                    onClick={handleToggleChatAudio}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Adaptive Quiz */}
        <div className="mb-16 bg-[#111a24] rounded-3xl border border-[#1f3245] p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Smartphone Mockup for Quiz */}
            <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <div className="w-full max-w-[320px] sm:max-w-[340px] rounded-[36px] bg-[#070d14] border-[7px] border-[#223548] p-3 shadow-2xl relative overflow-hidden">
                {/* Phone Notch */}
                <div className="w-24 h-4 bg-[#223548] rounded-b-xl mx-auto -mt-3 mb-3 flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-600 rounded-full" />
                </div>

                {/* Quiz Header with progress */}
                <div className="px-2 py-1 mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Level: {currentQuiz.difficulty}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      Score: {quizScore * 10} pts
                    </span>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${((activeQuizIndex + 1) / localizedQuizList.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Active Question Card */}
                <div className="bg-[#121c27] p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Adaptive Q{activeQuizIndex + 1}
                    </span>
                    <button
                      onClick={() => handleToggleQuizAudio(currentQuiz.questionDialect)}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[10px]"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isQuizAudioPlaying ? 'Playing' : 'Listen'}</span>
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-100 leading-snug">
                    {currentQuiz.question}
                  </p>

                  <p className="text-[11px] text-amber-200/90 italic bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                    "{currentQuiz.questionDialect}"
                  </p>

                  {/* Options List */}
                  <div className="space-y-1.5 pt-1">
                    {currentQuiz.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === currentQuiz.correctAnswer;
                      let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (selectedAnswer !== null) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedAnswer(idx);
                            if (idx === currentQuiz.correctAnswer) {
                              setQuizScore(s => s + 1);
                            }
                          }}
                          className={`w-full text-left p-2 rounded-xl text-[11px] border transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {selectedAnswer !== null && isCorrect && (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dialect Explanation Banner when answered */}
                  {selectedAnswer !== null && (
                    <div className="mt-2 p-2 rounded-xl bg-[#0a1118] border border-emerald-500/30 text-[10px] text-emerald-300 leading-relaxed">
                      <p className="font-semibold mb-0.5">Spoken Feedback:</p>
                      <p>"{currentQuiz.explanationDialect}"</p>
                    </div>
                  )}
                </div>

                {/* Quiz Next / Cycle button */}
                <div className="mt-3 flex items-center justify-between px-1">
                  <button
                    onClick={() => {
                      setSelectedAnswer(null);
                      setActiveQuizIndex((prev) => (prev + 1) % localizedQuizList.length);
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Next Adaptive Question</span>
                  </button>
                  <span className="text-[10px] text-slate-500">Auto-scaling engine</span>
                </div>
              </div>
            </div>

            {/* Feature Description */}
            <div className="lg:col-span-6 space-y-4 order-1 lg:order-2">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                <CheckSquare className="w-7 h-7" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
                Adaptive Quiz
              </h3>

              <p className="text-cyan-300 font-medium text-sm sm:text-base">
                Personalized Quiz that dynamically scales question difficulty according to student performance, with dialect audio explanations.
              </p>

              <p className="text-slate-300 text-sm leading-relaxed">
                {renderText("When a student excels, questions seamlessly scale from recall to higher-order conceptual synthesis. If a student struggles, the AI softens technical jargon, translates into familiar local idioms, and offers supportive audio hints.")}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#0a1118] border border-slate-800">
                  <div className="text-amber-400 font-bold text-base">3 Difficulty Tiers</div>
                  <div className="text-xs text-slate-400">Easy, Intermediate, Advanced with dynamic leveling</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0a1118] border border-slate-800">
                  <div className="text-emerald-400 font-bold text-base">Instant Audio Hints</div>
                  <div className="text-xs text-slate-400">Spoken encouragement in 14+ Indian mother tongues</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onOpenDemoTool('adaptive-quiz')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 font-semibold text-sm transition-all"
                >
                  <span>Open Full Adaptive Quiz</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Diagram Explainer */}
        <div className="bg-[#111a24] rounded-3xl border border-[#1f3245] p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Feature Description */}
            <div className="lg:col-span-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <GitFork className="w-7 h-7" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
                Diagram Explainer
              </h3>

              <p className="text-emerald-300 font-medium text-sm sm:text-base">
                Analyze diagrams, biology cycles, and circuit schematics into structured visual and dialect audio steps.
              </p>

              <p className="text-slate-300 text-sm leading-relaxed">
                {renderText("Visually impaired or neurodivergent students often struggle with intricate, unlabelled textbook diagrams. Diagram Explainer parses flowcharts and scientific charts into tactile, audio-annotated interactive stages.")}
              </p>

              {/* Step indicator */}
              <div className="space-y-2 pt-2">
                {diagramSteps.map((step, idx) => {
                  const nodeColors = ["#f59e0b", "#0284c7", "#10b981", "#8b5cf6", "#ec4899"];
                  const color = (step as any).nodeColor || nodeColors[idx % nodeColors.length];
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveDiagramStep(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        activeDiagramStep === idx
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                          : 'bg-[#0a1118] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-slate-950"
                          style={{ backgroundColor: color }}
                        >
                          {step.step || idx + 1}
                        </span>
                        <span className="text-xs font-semibold">{step.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onOpenDemoTool('diagram-explainer')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-semibold text-sm transition-all"
                >
                  <span>Explore Diagram Analyzer</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Smartphone Mockup with Flowchart/Diagram Visual */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[320px] sm:max-w-[340px] rounded-[36px] bg-[#070d14] border-[7px] border-[#223548] p-3 shadow-2xl relative overflow-hidden">
                {/* Phone Notch */}
                <div className="w-24 h-4 bg-[#223548] rounded-b-xl mx-auto -mt-3 mb-3 flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-600 rounded-full" />
                </div>

                {/* Screen Header */}
                <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Diagram Visualizer</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Photosynthesis Cycle</span>
                </div>

                {/* Flowchart Schematic Display */}
                <div className="bg-[#121c27] p-3 rounded-2xl border border-slate-800 text-center">
                  <svg className="w-full h-36 mx-auto" viewBox="0 0 200 120" fill="none">
                    {/* Node 1: Sun / Light */}
                    <rect 
                      x="70" y="5" width="60" height="24" rx="6" 
                      fill={activeDiagramStep === 0 ? "#f59e0b" : "#1e293b"} 
                      stroke="#fbbf24" strokeWidth="1.5" 
                      className="cursor-pointer transition-colors"
                      onClick={() => setActiveDiagramStep(0)}
                    />
                    <text x="100" y="21" fill={activeDiagramStep === 0 ? "#0f172a" : "#f8fafc"} fontSize="8" fontWeight="bold" textAnchor="middle">
                      1. Sunlight (धूप)
                    </text>

                    {/* Arrow down to Node 2 */}
                    <line x1="100" y1="29" x2="100" y2="44" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />

                    {/* Node 2: Chlorophyll & Water */}
                    <rect 
                      x="40" y="45" width="120" height="26" rx="6" 
                      fill={activeDiagramStep === 1 ? "#0284c7" : "#1e293b"} 
                      stroke="#38bdf8" strokeWidth="1.5"
                      className="cursor-pointer transition-colors"
                      onClick={() => setActiveDiagramStep(1)}
                    />
                    <text x="100" y="61" fill={activeDiagramStep === 1 ? "#0f172a" : "#f8fafc"} fontSize="8" fontWeight="bold" textAnchor="middle">
                      2. H2O Splitting & Chlorophyll
                    </text>

                    {/* Arrow down to Node 3 */}
                    <line x1="100" y1="71" x2="100" y2="86" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />

                    {/* Node 3: Glucose output */}
                    <rect 
                      x="50" y="87" width="100" height="26" rx="6" 
                      fill={activeDiagramStep === 2 ? "#10b981" : "#1e293b"} 
                      stroke="#34d399" strokeWidth="1.5"
                      className="cursor-pointer transition-colors"
                      onClick={() => setActiveDiagramStep(2)}
                    />
                    <text x="100" y="103" fill={activeDiagramStep === 2 ? "#0f172a" : "#f8fafc"} fontSize="8" fontWeight="bold" textAnchor="middle">
                      3. Glucose (C6H12O6)
                    </text>
                  </svg>
                </div>

                {/* Step Audio Player */}
                <div className="mt-3 p-3 rounded-2xl bg-[#121c27] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      {currentDiagramStep.title}
                    </span>
                    <button
                      onClick={() => handleToggleDiagramAudio(currentDiagramStep.dialectAudio)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-medium border border-emerald-500/30 cursor-pointer"
                    >
                      {isDiagramAudioPlaying ? <Square className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
                      <span>{isDiagramAudioPlaying ? 'Stop' : 'Audio Explanation'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {(currentDiagramStep as any).description || (currentDiagramStep as any).explanation}
                  </p>

                  <div className="p-2 rounded-lg bg-[#0a1118] border border-slate-800/80 text-[10px] text-amber-200 italic">
                    "{currentDiagramStep.dialectAudio}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Learning Tools Grid (PDF Summarizer, Flashcards, Mock Interview) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PDF Summarizer */}
          <div 
            onClick={() => onOpenDemoTool('pdf-summarizer')}
            className="p-6 rounded-2xl bg-[#111a24] border border-[#1f3245] hover:border-amber-500/50 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
              PDF Summarizer
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Upload dense textbook chapters or handwritten notes and transform them into dialect podcasts and bite-sized audio bullet points.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-400">
              <span>Try PDF Summarizer</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Flashcards */}
          <div 
            onClick={() => onOpenDemoTool('flashcards')}
            className="p-6 rounded-2xl bg-[#111a24] border border-[#1f3245] hover:border-cyan-500/50 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
              Smart Flashcards
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Automatically generated spaced-repetition cards that pair standard scientific terminology with regional mother tongue translations.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400">
              <span>Try Flashcards</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mock Interview */}
          <div 
            onClick={() => onOpenDemoTool('mock-interview')}
            className="p-6 rounded-2xl bg-[#111a24] border border-[#1f3245] hover:border-emerald-500/50 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
              Mock Interview
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Practice spoken viva questions and job interviews with real-time feedback on vocal fluency, dialect clarity, and conceptual precision.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <span>Try Mock Interview</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
