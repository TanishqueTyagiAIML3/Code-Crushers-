import React, { useState } from 'react';
import { 
  X, Bot, CheckSquare, GitFork, FileText, Layers, Mic, Sliders,
  Play, Square, Volume2, Sparkles, Award, RotateCw, Check, ArrowRight,
  Upload, HelpCircle, Eye, BookOpen
} from 'lucide-react';
import { LearningToolId, AccessibilitySettings } from '../types';
import { formatBionicReading, speakText, stopSpeech } from '../utils/bionic';
import { SAMPLE_QUIZ_QUESTIONS, SAMPLE_FLASHCARDS, DIAGRAM_STEPS } from '../data/mockData';
import { INDIAN_LANGUAGES } from '../data/languages';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveFlashcard } from './InteractiveFlashcard';

interface InteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTool?: LearningToolId;
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export function InteractiveDemoModal({
  isOpen,
  onClose,
  initialTool = 'ai-chat',
  accessibility,
  setAccessibility
}: InteractiveDemoModalProps) {
  const [activeTab, setActiveTab] = useState<LearningToolId>(initialTool);

  // Synchronize when initialTool prop changes
  React.useEffect(() => {
    if (initialTool) {
      setActiveTab(initialTool);
    }
  }, [initialTool]);

  // Audio playing state
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; dialect?: string }>>([
    {
      sender: 'user',
      text: 'Explain the water cycle.',
      dialect: 'Hindi'
    },
    {
      sender: 'ai',
      text: `🌊 **Water Cycle** ka matlab hai pani ka ghoomna!

Yeh 3 aasan steps mein hota hai:

☀️ 1. **Evaporation** (Baaph Banna):
Suraj ki garmi se nadi ka pani baaph (gas) ban jata hai. Yeh hawa mein upar udta hai.

☁️ 2. **Condensation** (Baadal Banna):
Upar jakar yeh baaph thandi ho jati hai. Thandi hokar yeh baadal ban jati hai.

🌧️ 3. **Precipitation** (Baarish Hona):
Jab baadal bahut bhari ho jate hain, toh pani baarish ban kar wapas zameen par girta hai.`
    }
  ]);
  const [userQueryInput, setUserQueryInput] = useState('');
  const { selectedLanguage: selectedChatDialect, setSelectedLanguage } = useLanguage();

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelection, setQuizSelection] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  // Diagram State
  const [diagramIndex, setDiagramIndex] = useState(0);

  // Flashcards State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // PDF Summarizer State
  const [pdfSummaryDone, setPdfSummaryDone] = useState(false);

  // Mock Interview State
  const [isRecordingInterview, setIsRecordingInterview] = useState(false);
  const [interviewSubmitted, setInterviewSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSpeak = (text: string) => {
    if (isPlayingVoice) {
      stopSpeech();
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      speakText(text, selectedChatDialect.code || 'hi-IN', accessibility.speechSpeed, () => setIsPlayingVoice(false));
    }
  };

  const handleSendQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userQueryInput.trim()) return;

    const userText = userQueryInput;
    setUserQueryInput('');

    setChatMessages(prev => [...prev, { sender: 'user', text: userText, dialect: selectedChatDialect.name }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversationHistory: chatMessages.slice(-6),
          language: selectedChatDialect.language,
          dialect: selectedChatDialect.name,
          languageCode: selectedChatDialect.code || 'hi-IN',
        })
      });
      const data = await res.json();
      const aiReply = data.reply || `🌊 **${userText}** ko saral shabdon mein samajhte hain!

Yeh aasan steps mein hota hai:

✨ 1. **Mukhya Niyam**:
Har prakritik ghatna ke piche ek aasan niyam hota hai.

💡 2. **Rozmarra ki Zindagi**:
Ise hum apne aas-paas aasaani se dekh sakte hain.`;
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      handleSpeak(aiReply);
    } catch {
      const fallbackReply = `🌊 **Water Cycle** ka matlab hai pani ka ghoomna!

Yeh 3 aasan steps mein hota hai:

☀️ 1. **Evaporation** (Baaph Banna):
Suraj ki garmi se nadi ka pani baaph (gas) ban jata hai. Yeh hawa mein upar udta hai.

☁️ 2. **Condensation** (Baadal Banna):
Upar jakar yeh baaph thandi ho jati hai. Thandi hokar yeh baadal ban jati hai.

🌧️ 3. **Precipitation** (Baarish Hona):
Jab baadal bahut bhari ho jate hain, toh pani baarish ban kar wapas zameen par girta hai.`;
      setChatMessages(prev => [...prev, { sender: 'ai', text: fallbackReply }]);
      handleSpeak(fallbackReply);
    }
  };

  const currentQuiz = SAMPLE_QUIZ_QUESTIONS[quizIndex];
  const currentCard = SAMPLE_FLASHCARDS[flashcardIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl h-[90vh] bg-[#0c131a] border border-[#213548] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#111a24]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>ShikshaSathi Interactive Demo</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  7 Active Tools
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Voice-First • Dialect-Aware • Neurodivergent Accessible
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tool Switcher Tabs Bar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto bg-[#0a1017] border-b border-slate-800 scrollbar-none text-xs">
          {[
            { id: 'ai-chat', label: '1. AI Chat', icon: Bot },
            { id: 'adaptive-quiz', label: '2. Adaptive Quiz', icon: CheckSquare },
            { id: 'diagram-explainer', label: '3. Diagram Explainer', icon: GitFork },
            { id: 'pdf-summarizer', label: '4. PDF Summarizer', icon: FileText },
            { id: 'flashcards', label: '5. Flashcards', icon: Layers },
            { id: 'mock-interview', label: '6. Mock Interview', icon: Mic },
            { id: 'accessibility', label: '7. Accessibility Lab', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  stopSpeech();
                  setIsPlayingVoice(false);
                  setActiveTab(tab.id as LearningToolId);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Content Body */}
        <div className={`flex-1 p-4 sm:p-6 overflow-y-auto ${accessibility.openDyslexic ? 'font-dyslexic' : ''}`}>
          {/* TAB 1: AI CHAT */}
          {activeTab === 'ai-chat' && (
            <div className="max-w-3xl mx-auto h-full flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between bg-[#111a24] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Target Dialect:</span>
                  <select
                    value={selectedChatDialect.id}
                    onChange={(e) => {
                      const found = INDIAN_LANGUAGES.find(l => l.id === e.target.value);
                      if (found) setSelectedLanguage(found);
                    }}
                    className="bg-[#091119] border border-slate-700 text-amber-300 text-xs rounded-lg px-2.5 py-1"
                  >
                    {INDIAN_LANGUAGES.map(lang => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Multilingual Gemini Engine Connected
                </span>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 min-h-[300px]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm ${
                      msg.sender === 'user'
                        ? 'bg-amber-500/20 border border-amber-500/30 text-amber-100 rounded-tr-none'
                        : 'bg-[#111a24] border border-cyan-500/30 text-slate-100 rounded-tl-none'
                    }`}>
                      <div className="flex items-center justify-between gap-4 mb-1 text-[11px] font-semibold text-slate-400">
                        <span>{msg.sender === 'user' ? `Student (${msg.dialect || 'Query'})` : 'Cognitive Accessibility Tutor'}</span>
                        {msg.sender === 'ai' && (
                          <button
                            onClick={() => handleSpeak(msg.text)}
                            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isPlayingVoice ? 'Stop' : 'Listen Spoken'}</span>
                          </button>
                        )}
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">
                        {accessibility.bionicReading ? formatBionicReading(msg.text) : msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested Dialect Queries */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] text-slate-500 font-medium">Quick Suggestions:</span>
                {[
                  "Photosynthesis saral bhasha mein samjhao",
                  "Gravity kyu hoti hai?",
                  "Ohm's Law ka desi formula kya hai?"
                ].map((sugg, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserQueryInput(sugg);
                    }}
                    className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-full transition-colors"
                  >
                    "{sugg}"
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <form onSubmit={handleSendQuery} className="flex items-center gap-2 bg-[#111a24] p-2 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setUserQueryInput("गुरुत्वाकर्षण (Gravity) कइसे काम करेला? ई काहे जरूरी बा?");
                  }}
                  title="Simulate speaking in dialect"
                  className="w-10 h-10 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center shrink-0"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={userQueryInput}
                  onChange={(e) => setUserQueryInput(e.target.value)}
                  placeholder={`Ask a question in ${selectedChatDialect.name} or type English...`}
                  className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:opacity-90"
                >
                  Ask Voice AI
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ADAPTIVE QUIZ */}
          {activeTab === 'adaptive-quiz' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between bg-[#111a24] p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">Current Adaptive Level:</span>
                  <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>{currentQuiz.difficulty} Tier</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Current Points:</span>
                  <div className="text-emerald-400 font-mono font-bold text-base">{score} pts</div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-[#111a24] p-6 rounded-3xl border border-[#213548] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Question {quizIndex + 1} of {SAMPLE_QUIZ_QUESTIONS.length}
                  </span>
                  <button
                    onClick={() => handleSpeak(currentQuiz.questionDialect)}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingVoice ? 'Stop' : 'Listen Spoken Dialect'}</span>
                  </button>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-100">
                  {accessibility.bionicReading ? formatBionicReading(currentQuiz.question) : currentQuiz.question}
                </h4>

                <p className="text-xs sm:text-sm text-amber-200/90 italic bg-amber-950/20 p-3 rounded-xl border border-amber-500/20">
                  "{currentQuiz.questionDialect}"
                </p>

                {/* Options */}
                <div className="space-y-2 pt-2">
                  {currentQuiz.options.map((opt, idx) => {
                    const isSelected = quizSelection === idx;
                    const isCorrect = idx === currentQuiz.correctAnswer;
                    let style = 'bg-[#091119] border-slate-800 text-slate-200 hover:border-slate-700';

                    if (quizSelection !== null) {
                      if (isCorrect) style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                      else if (isSelected) style = 'bg-rose-950/40 border-rose-500 text-rose-200';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (quizSelection === null) {
                            setQuizSelection(idx);
                            if (idx === currentQuiz.correctAnswer) {
                              setScore(s => s + 10);
                              handleSpeak(currentQuiz.explanationDialect);
                            }
                          }
                        }}
                        className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm border transition-all flex items-center justify-between ${style}`}
                      >
                        <span>{opt}</span>
                        {quizSelection !== null && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {quizSelection !== null && (
                  <div className="mt-4 p-4 rounded-xl bg-[#091119] border border-emerald-500/30 space-y-2">
                    <span className="text-xs font-bold text-emerald-300">Spoken Dialect Explanation:</span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {currentQuiz.explanationDialect}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Standard Concept: {currentQuiz.explanation}
                    </p>
                  </div>
                )}

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => {
                      setQuizSelection(null);
                      setQuizIndex((prev) => (prev + 1) % SAMPLE_QUIZ_QUESTIONS.length);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Adaptive Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DIAGRAM EXPLAINER */}
          {activeTab === 'diagram-explainer' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-[#111a24] p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-emerald-400" />
                    <span>Interactive Biology Circuit: Photosynthesis Stage Flow</span>
                  </h4>
                  <span className="text-xs font-mono text-amber-300">Class 10 NCERT Science</span>
                </div>

                {/* Flowchart Visual */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  {DIAGRAM_STEPS.map((step, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setDiagramIndex(idx);
                        handleSpeak(step.dialectAudio);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                        diagramIndex === idx
                          ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-950'
                          : 'bg-[#091119] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-slate-950 mx-auto mb-2"
                        style={{ backgroundColor: step.nodeColor }}
                      >
                        {step.step}
                      </div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-200">{step.title}</h5>
                      <span className="text-[10px] text-slate-400 block mt-1">Tap to explain node</span>
                    </div>
                  ))}
                </div>

                {/* Node Dialect Explanation */}
                <div className="mt-4 p-4 rounded-2xl bg-[#091119] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-emerald-300">
                      Step {diagramIndex + 1}: {DIAGRAM_STEPS[diagramIndex].title}
                    </h5>
                    <button
                      onClick={() => handleSpeak(DIAGRAM_STEPS[diagramIndex].dialectAudio)}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isPlayingVoice ? 'Stop' : 'Play Dialect Voice'}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {DIAGRAM_STEPS[diagramIndex].description}
                  </p>

                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 italic">
                    "{DIAGRAM_STEPS[diagramIndex].dialectAudio}"
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PDF SUMMARIZER */}
          {activeTab === 'pdf-summarizer' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-[#111a24] p-6 rounded-3xl border border-slate-800 space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <FileText className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-100">PDF & Chapter Notes Summarizer</h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Transform dense textbook PDFs or handwritten notes into 2-minute native dialect podcasts and flashcards.
                </p>

                {!pdfSummaryDone ? (
                  <div className="p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-[#091119] space-y-3">
                    <Upload className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                    <p className="text-xs text-slate-300">Upload any school textbook PDF or notes</p>
                    <button
                      onClick={() => setPdfSummaryDone(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:scale-105 transition-transform"
                    >
                      Try Sample: NCERT Class 10 "Light - Reflection and Refraction"
                    </button>
                  </div>
                ) : (
                  <div className="text-left space-y-4 pt-2">
                    <div className="p-4 rounded-2xl bg-[#091119] border border-cyan-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300">Generated Dialect Audio Podcast (1:45)</span>
                        <button
                          onClick={() => handleSpeak("यह अध्याय प्रकाश के परावर्तन और अपवर्तन के बारे में है। दर्पण में जब आप अपना चेहरा देखते हैं, तो प्रकाश की किरणें टकराकर आपकी आँखों तक आती हैं।")}
                          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{isPlayingVoice ? 'Stop Audio' : 'Play Chapter Podcast'}</span>
                        </button>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <strong className="text-amber-300">1. परावर्तन का नियम:</strong> आपतन कोण (Angle of incidence) हमेशा परावर्तन कोण के बराबर होता है।
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <strong className="text-cyan-300">2. उत्तल व अवतल दर्पण:</strong> गाड़ी के साइड शीशे में उत्तल दर्पण (Convex mirror) लगता है ताकि पीछे का बड़ा इलाका दिखे।
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <strong className="text-emerald-300">3. अपवर्तन (Refraction):</strong> जब प्रकाश हवा से पानी में जाता है, तो उसकी चाल बदलती है और वह मुड़ जाता है।
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setPdfSummaryDone(false)}
                      className="text-xs text-slate-400 hover:text-slate-200 underline"
                    >
                      Upload another document
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Spaced Repetition</span>
                <h4 className="text-lg font-bold text-slate-100">Bilingual Revision Cards</h4>
                <p className="text-xs text-slate-400">Card {flashcardIndex + 1} of {SAMPLE_FLASHCARDS.length} • Tap card to flip</p>
              </div>

              {/* 3D Interactive Flip Card */}
              <InteractiveFlashcard
                card={currentCard}
                isFlipped={isCardFlipped}
                onFlip={() => setIsCardFlipped(!isCardFlipped)}
                labels={{
                  cardFrontLabel: 'Question Side',
                  cardBackLabel: 'Answer Side',
                  flipCardPrompt: 'Tap card to flip'
                }}
                accessibility={accessibility}
                cardIndex={flashcardIndex}
                totalCards={SAMPLE_FLASHCARDS.length}
                variant="dark"
                onSpeak={(text) => handleSpeak(text)}
              />

              {/* Cycle cards */}
              <div className="flex justify-between items-center px-2">
                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : SAMPLE_FLASHCARDS.length - 1));
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Previous Card
                </button>
                <button
                  onClick={() => {
                    setIsCardFlipped(false);
                    setFlashcardIndex((prev) => (prev + 1) % SAMPLE_FLASHCARDS.length);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: MOCK INTERVIEW */}
          {activeTab === 'mock-interview' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-[#111a24] p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <Mic className="w-4 h-4" />
                    <span>AI Spoken Viva & Mock Interview</span>
                  </div>
                  <span className="text-xs text-slate-400">Technical Science Round</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#091119] border border-slate-800 space-y-2">
                  <span className="text-[10px] text-amber-400 uppercase font-semibold">AI Interviewer Prompt:</span>
                  <p className="text-sm font-semibold text-slate-100">
                    "Explain why the sky appears blue in daytime, but turns reddish during sunset, using simple everyday terms."
                  </p>
                  <button
                    onClick={() => handleSpeak("दिन में आसमान नीला क्यों दिखता है और शाम को लाल क्यों हो जाता है, सरल भाषा में समझाइए।")}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Spoken Question</span>
                  </button>
                </div>

                {/* Spoken recording simulator */}
                <div className="text-center py-6">
                  <button
                    onClick={() => {
                      if (isRecordingInterview) {
                        setIsRecordingInterview(false);
                        setInterviewSubmitted(true);
                      } else {
                        setIsRecordingInterview(true);
                        setInterviewSubmitted(false);
                      }
                    }}
                    className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${
                      isRecordingInterview
                        ? 'bg-rose-500 text-slate-950 animate-pulse ring-8 ring-rose-500/20'
                        : 'bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 hover:scale-105'
                    }`}
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                  <span className="text-xs text-slate-400 block mt-3">
                    {isRecordingInterview ? 'Listening to your spoken answer... (Tap again to submit)' : 'Tap to speak your answer in Hindi / Dialect / English'}
                  </span>
                </div>

                {interviewSubmitted && (
                  <div className="p-4 rounded-2xl bg-[#091119] border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-emerald-300">Spoken Evaluation Report</span>
                      <span className="text-xs font-mono font-bold text-amber-300">Score: 92/100</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Fluency</span>
                        <strong className="text-emerald-400">94%</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Concept Clarity</span>
                        <strong className="text-cyan-400">90%</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Dialect Naturalness</span>
                        <strong className="text-amber-400">95%</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>AI Feedback:</strong> Excellent use of the Rayleigh scattering dust particle analogy. Your spoken pace in colloquial Hindi was natural and showed deep intuitive understanding.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: ACCESSIBILITY LAB */}
          {activeTab === 'accessibility' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-[#111a24] p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                  <Sliders className="w-4 h-4" />
                  <span>Neurodiversity & Sensory Controls</span>
                </div>

                <div className="space-y-4">
                  {/* Dyslexic toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#091119] border border-slate-800">
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">OpenDyslexic Font Weighting</h5>
                      <p className="text-[11px] text-slate-400">Anchors letters with heavier bottom baselines</p>
                    </div>
                    <button
                      onClick={() => setAccessibility(a => ({ ...a, openDyslexic: !a.openDyslexic }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        accessibility.openDyslexic ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {accessibility.openDyslexic ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {/* Bionic toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#091119] border border-slate-800">
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Bionic Reading Fixations</h5>
                      <p className="text-[11px] text-slate-400">Bolds artificial eye focal points on every word</p>
                    </div>
                    <button
                      onClick={() => setAccessibility(a => ({ ...a, bionicReading: !a.bionicReading }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        accessibility.bionicReading ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {accessibility.bionicReading ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  {/* Speech Rate slider */}
                  <div className="p-3 rounded-xl bg-[#091119] border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Audio Speech Rate (Speed)</span>
                      <span className="font-mono text-amber-300">{accessibility.speechSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.75"
                      max="1.5"
                      step="0.05"
                      value={accessibility.speechSpeed}
                      onChange={(e) => setAccessibility(a => ({ ...a, speechSpeed: parseFloat(e.target.value) }))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>

                {/* Test sentence display */}
                <div className="p-4 rounded-xl bg-[#091119] border border-amber-500/30">
                  <span className="text-[10px] text-amber-400 font-bold block mb-1">Live Sensory Preview:</span>
                  <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                    {accessibility.bionicReading 
                      ? formatBionicReading("ShikshaSathi is tailored for rural, visually impaired, and neurodivergent learners across all of Bharat.")
                      : "ShikshaSathi is tailored for rural, visually impaired, and neurodivergent learners across all of Bharat."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
