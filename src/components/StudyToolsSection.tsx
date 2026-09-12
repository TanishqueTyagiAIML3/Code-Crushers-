import React, { useState, useEffect } from 'react';
import { 
  FileText, Layers, BarChart2, Upload, RefreshCw, Sparkles, 
  CheckCircle2, XCircle, ArrowRight, RotateCw, Award, BookOpen,
  Check, HelpCircle, Volume2, Download
} from 'lucide-react';
import { DialectOption, QuizQuestion, Flashcard, AccessibilitySettings, GroundingSource } from '../types';
import { getTranslations } from '../i18n/translations';
import { speakText } from '../utils/bionic';
import { recordUserHistory, CURRENT_USER_ID } from '../utils/historyService';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedQuiz, getLocalizedFlashcards, getSectionLabels } from '../data/localizedContent';
import { InteractiveFlashcard } from './InteractiveFlashcard';
import { generateQuizPDF } from '../utils/studyPdfGenerator';
import { matchAndCompleteTopic } from '../utils/progressService';
import { recordTopicPerformance } from '../utils/masteryAnalysisService';
import { GroundingSourcesList } from './GroundingSourcesList';

interface StudyToolsSectionProps {
  selectedLanguage?: DialectOption;
  accessibility: AccessibilitySettings;
  initialMode?: 'quiz' | 'flashcards';
  initialTopic?: string;
  onNavigateToHistory?: () => void;
}

export function StudyToolsSection({
  selectedLanguage: propLanguage,
  accessibility,
  initialMode = 'quiz',
  initialTopic = '',
  onNavigateToHistory
}: StudyToolsSectionProps) {
  const { selectedLanguage: globalLanguage } = useLanguage();
  const selectedLanguage = propLanguage || globalLanguage;
  const t = getTranslations(selectedLanguage.id);
  const labels = getSectionLabels(selectedLanguage.id);

  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards'>(initialMode);
  const [documentFileName, setDocumentFileName] = useState<string | null>(null);
  const [documentText, setDocumentText] = useState<string>('');
  const [customTopicInput, setCustomTopicInput] = useState<string>(initialTopic || '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Quiz State - Initialized strictly EMPTY ([]) as requested - strictly user-driven
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCustomQuiz, setIsCustomQuiz] = useState(false);

  // Flashcards State - Initialized strictly EMPTY ([]) as requested - strictly user-driven
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCustomFlashcards, setIsCustomFlashcards] = useState(false);

  // Dynamically update sample quiz when language changes (if viewing preset/sample)
  useEffect(() => {
    if (!isCustomQuiz && quizQuestions.length > 0) {
      setQuizQuestions(getLocalizedQuiz(selectedLanguage.id));
      setCurrentQuizIndex(0);
      setSelectedAnswers({});
    }
  }, [selectedLanguage.id, isCustomQuiz]);

  // Dynamically update sample flashcards when language changes (if viewing preset/sample)
  useEffect(() => {
    if (!isCustomFlashcards && flashcards.length > 0) {
      setFlashcards(getLocalizedFlashcards(selectedLanguage.id));
      setFlashcardIndex(0);
      setIsFlipped(false);
    }
  }, [selectedLanguage.id, isCustomFlashcards]);

  // Google Search Grounding State
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [isGrounded, setIsGrounded] = useState<boolean>(false);

  // PDF & Document Base64 State
  const [documentBase64, setDocumentBase64] = useState<string | null>(null);
  const [documentMimeType, setDocumentMimeType] = useState<string>('application/pdf');

  // Handle Document Ingestion (Robust PDF Base64 + Text Decoding)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size === 0) {
      setValidationError("The selected file is empty (0 bytes). Please upload a valid document with content.");
      return;
    }

    setValidationError(null);
    setDocumentFileName(file.name);

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setDocumentMimeType('application/pdf');
      const reader = new FileReader();
      reader.onload = () => {
        const result = (reader.result as string) || '';
        // Extract pure base64 string without data URL scheme prefix
        const commaIdx = result.indexOf(',');
        const base64 = commaIdx !== -1 ? result.slice(commaIdx + 1).trim() : result.trim();
        setDocumentBase64(base64);
        setDocumentText(`[Attached PDF Document: ${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)]`);
      };
      reader.readAsDataURL(file);
    } else {
      // Clean text/markdown file
      setDocumentBase64(null);
      setDocumentMimeType(file.type || 'text/plain');
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string) || '';
        setDocumentText(text.slice(0, 30000));
      };
      reader.readAsText(file);
    }
  };

  // Generate Tool Data with AI - STRICT FRONTEND VALIDATION
  const handleGenerate = async (presetTopic?: string) => {
    const hasBase64 = !!documentBase64;
    const content = presetTopic || customTopicInput.trim() || (!hasBase64 ? documentText.trim() : '');

    if (!content && !hasBase64) {
      setValidationError(`Please enter a study topic or upload a document before generating ${activeTab === 'quiz' ? 'the Quiz' : 'Flashcards'}.`);
      return;
    }

    setValidationError(null);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/study/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: activeTab,
          documentText: content 
            ? (content.startsWith('Topic:') ? content : `Topic: ${content}`)
            : (documentFileName ? `Document Topic: ${documentFileName.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ')}` : ''),
          documentBase64: hasBase64 ? documentBase64 : null,
          mimeType: documentMimeType,
          selectedLanguage: selectedLanguage.name,
          language: selectedLanguage.language,
          dialect: selectedLanguage.name
        })
      });

      const data = await res.json();

      if (!res.ok && data.error) {
        throw new Error(data.error);
      }

      if (data.groundingSources || data.isGrounded) {
        setGroundingSources(data.groundingSources || []);
        setSearchQueries(data.searchQueries || []);
        setIsGrounded(Boolean(data.isGrounded));
      } else {
        setGroundingSources([]);
        setSearchQueries([]);
        setIsGrounded(false);
      }

      if (activeTab === 'quiz') {
        if (data.questions && data.questions.length > 0) {
          setIsCustomQuiz(true);
          setQuizQuestions(data.questions);
          setQuizTitle(data.quizTitle || (documentFileName ? `Quiz on ${documentFileName}` : (customTopicInput ? `Quiz: ${customTopicInput}` : 'Adaptive Practice Quiz')));
          setCurrentQuizIndex(0);
          setSelectedAnswers({});
          setQuizCompleted(false);

          // History Log to Active User & Real-time Update
          recordUserHistory({
            userId: CURRENT_USER_ID,
            category: 'quiz',
            title: `Context Quiz: ${data.quizTitle || customTopicInput || 'Study Material'}`,
            summary: `Generated ${data.questions.length} context-aware questions with dialect explanations.`,
            data: data
          }).catch(err => console.warn(err));
        } else {
          setValidationError("Could not generate quiz questions for this topic. Please try entering another topic or upload a study document.");
        }
      } else if (activeTab === 'flashcards') {
        if (data.flashcards && data.flashcards.length > 0) {
          setIsCustomFlashcards(true);
          setFlashcards(data.flashcards);
          setFlashcardIndex(0);
          setIsFlipped(false);

          // History Log to Active User & Real-time Update
          recordUserHistory({
            userId: CURRENT_USER_ID,
            category: 'flashcards',
            title: `Flashcards: ${documentFileName || presetTopic || customTopicInput || 'Study Material'}`,
            summary: `Extracted ${data.flashcards.length} high-yield flashcard Q&A pairs with dialect translation.`,
            data: data.flashcards
          }).catch(err => console.warn(err));
        } else {
          setValidationError("Could not generate flashcards for this topic. Please try entering another topic or upload a study document.");
        }
      }
    } catch (e) {
      console.error("Failed to generate study tool:", e);
      setValidationError("An error occurred while generating study materials. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Quiz Scoring
  const currentQ = quizQuestions[currentQuizIndex];
  const userSelectedOption = selectedAnswers[currentQuizIndex];
  const isAnswered = userSelectedOption !== undefined;
  const isCorrect = userSelectedOption === currentQ?.correctAnswer;

  const totalScore = Object.entries(selectedAnswers).reduce((acc, [idx, optIndex]) => {
    return optIndex === quizQuestions[parseInt(idx)]?.correctAnswer ? acc + 1 : acc;
  }, 0);

  // Sync initialTopic prop when navigating from Mastery Overview or Curriculum
  useEffect(() => {
    if (initialTopic && initialTopic.trim()) {
      setCustomTopicInput(initialTopic.trim());
      if (activeTab === 'quiz' && quizQuestions.length === 0) {
        handleGenerate(initialTopic.trim());
      }
    }
  }, [initialTopic]);

  // Complete Quiz & Record strictly to real student performance store
  const handleFinishQuiz = () => {
    setQuizCompleted(true);

    const totalQ = quizQuestions.length;
    let correctCount = 0;
    const mistakeSummaries: string[] = [];

    quizQuestions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      if (userAns === q.correctAnswer) {
        correctCount++;
      } else {
        const userChoice = (userAns !== undefined && q.options[userAns]) ? q.options[userAns] : 'Skipped';
        const correctChoice = q.options[q.correctAnswer] || 'Correct answer';
        mistakeSummaries.push(
          `${q.question.slice(0, 65)} (Chosen: "${userChoice}" vs Correct: "${correctChoice}")`
        );
      }
    });

    const accuracy = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const topicQuery = quizTitle || customTopicInput || 'General Science';
    const matched = matchAndCompleteTopic(topicQuery, accuracy);
    const topicId = matched?.id || ('top-' + topicQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30));

    // Record performance strictly into user performance state (updates attempts, accuracy, mistakes live)
    recordTopicPerformance(
      topicId,
      totalQ,
      correctCount,
      mistakeSummaries,
      Math.max(1, Math.round(totalQ * 1.5)),
      matched?.title || quizTitle || customTopicInput
    );

    // Save to Persistent User History
    recordUserHistory({
      userId: CURRENT_USER_ID,
      category: 'quiz',
      title: `Quiz: ${matched?.title || quizTitle || customTopicInput || 'Assessment'}`,
      summary: `Scored ${correctCount}/${totalQ} (${accuracy}% accuracy) with ${mistakeSummaries.length} errors.`,
      data: {
        topicId,
        topicTitle: matched?.title || quizTitle || customTopicInput,
        score: correctCount,
        totalQuestions: totalQ,
        accuracy,
        mistakes: mistakeSummaries,
        completedAt: new Date().toISOString()
      }
    }).catch(err => console.warn('[StudyTools] History record failed:', err));
  };

  const handleDownloadQuizPDF = async () => {
    if (!quizQuestions || quizQuestions.length === 0) return;
    setIsDownloadingPDF(true);
    try {
      await generateQuizPDF({
        quizTitle: quizTitle || (documentFileName ? `Quiz on ${documentFileName}` : (customTopicInput ? `Quiz: ${customTopicInput}` : 'Adaptive Practice Quiz')),
        topic: customTopicInput,
        documentFileName: documentFileName || undefined,
        questions: quizQuestions,
        languageName: selectedLanguage.name,
        totalScore: quizCompleted ? totalScore : undefined,
        isCompleted: quizCompleted
      });
    } catch (err) {
      console.error("Failed to generate Quiz PDF:", err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Dedicated Keyboard Shortcuts for Quiz & Flashcards Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target && (
          target.tagName?.toLowerCase() === 'input' ||
          target.tagName?.toLowerCase() === 'textarea' ||
          target.tagName?.toLowerCase() === 'select' ||
          target.isContentEditable ||
          Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
        )
      ) {
        return;
      }

      // Quiz Mode Navigation Shortcuts
      if (activeTab === 'quiz' && quizQuestions.length > 0 && !quizCompleted) {
        const isAnswered = selectedAnswers[currentQuizIndex] !== undefined;

        // Keys A, B, C, D (or 1, 2, 3, 4 without Alt/Ctrl) to select options
        if (!isAnswered && !e.altKey && !e.ctrlKey && !e.metaKey) {
          if (e.code === 'KeyA' || e.code === 'Digit1') {
            e.preventDefault();
            setSelectedAnswers(prev => ({ ...prev, [currentQuizIndex]: 0 }));
            return;
          }
          if (e.code === 'KeyB' || e.code === 'Digit2') {
            e.preventDefault();
            setSelectedAnswers(prev => ({ ...prev, [currentQuizIndex]: 1 }));
            return;
          }
          if (e.code === 'KeyC' || e.code === 'Digit3') {
            e.preventDefault();
            setSelectedAnswers(prev => ({ ...prev, [currentQuizIndex]: 2 }));
            return;
          }
          if (e.code === 'KeyD' || e.code === 'Digit4') {
            e.preventDefault();
            setSelectedAnswers(prev => ({ ...prev, [currentQuizIndex]: 3 }));
            return;
          }
        }

        // Enter or ArrowRight to advance when answered
        if (isAnswered && (e.key === 'Enter' || e.key === 'ArrowRight')) {
          e.preventDefault();
          if (currentQuizIndex < quizQuestions.length - 1) {
            setCurrentQuizIndex(i => i + 1);
          } else {
            handleFinishQuiz();
          }
          return;
        }

        // Key L to listen to explanation audio
        if (isAnswered && e.code === 'KeyL') {
          e.preventDefault();
          const currentQ = quizQuestions[currentQuizIndex];
          if (currentQ) {
            speakText(currentQ.explanationDialect || currentQ.explanation, selectedLanguage.code || 'hi-IN');
          }
          return;
        }
      }

      // Flashcards Mode Navigation Shortcuts
      if (activeTab === 'flashcards' && flashcards.length > 0) {
        // Space, Enter, Up, or Down to flip card
        if (e.code === 'Space' || e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          setIsFlipped(f => !f);
          return;
        }
        // ArrowLeft: Previous Card
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setIsFlipped(false);
          setFlashcardIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1));
          return;
        }
        // ArrowRight: Next Card
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setIsFlipped(false);
          setFlashcardIndex(prev => (prev + 1) % flashcards.length);
          return;
        }
        // Key L: Listen to card audio
        if (e.code === 'KeyL') {
          e.preventDefault();
          const currentCard = flashcards[flashcardIndex];
          if (currentCard) {
            speakText(
              isFlipped 
                ? currentCard.dialectTranslation || currentCard.backAnswer 
                : currentCard.frontQuestion,
              selectedLanguage.code || 'hi-IN'
            );
          }
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, quizQuestions, quizCompleted, currentQuizIndex, selectedAnswers, flashcards, flashcardIndex, isFlipped, selectedLanguage.code]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 section-header-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 border border-orange-200/50 dark:border-orange-800/60 text-[#ea580c] dark:text-orange-400 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{labels.studyToolsStudio}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight section-header-title">
            {labels.studyToolsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1 section-header-desc">
            {labels.studyToolsDesc}
          </p>
        </div>

        {/* Tab Switcher: Quiz vs Flashcards */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quiz' 
                ? 'bg-white dark:bg-slate-900 text-[#ea580c] dark:text-orange-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {labels.adaptiveQuizTab}
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'flashcards' 
                ? 'bg-white dark:bg-slate-900 text-[#ea580c] dark:text-orange-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {labels.flashcardsTab}
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span>⚠️ {validationError}</span>
          <button onClick={() => setValidationError(null)} className="text-amber-700 font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Upload / Ingestion Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="lg:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ea580c] text-xs font-bold border border-orange-200 cursor-pointer transition-colors shrink-0">
            <Upload className="w-4 h-4" />
            <span>{labels.uploadDoc}</span>
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <input
            type="text"
            value={customTopicInput}
            onChange={(e) => {
              setCustomTopicInput(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder={documentFileName ? `Using: ${documentFileName}` : labels.enterStudyTopicPlaceholder}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <div className="lg:col-span-6 flex flex-wrap items-center justify-start lg:justify-end gap-2">
          <button
            onClick={() => {
              setCustomTopicInput(labels.presetTopic1);
              handleGenerate(labels.presetTopic1);
            }}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 cursor-pointer"
          >
            {labels.presetTopic1}
          </button>
          <button
            onClick={() => {
              setCustomTopicInput(labels.presetTopic2);
              handleGenerate(labels.presetTopic2);
            }}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-700 cursor-pointer"
          >
            {labels.presetTopic2}
          </button>
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isGenerating ? "..." : (activeTab === 'quiz' ? labels.generateQuizBtn : labels.generateCardsBtn)}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CONTEXT-AWARE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 max-w-4xl mx-auto">
          {quizQuestions.length === 0 ? (
            /* Empty State for Quiz */
            <div className="text-center py-12 sm:py-16 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#ea580c] border border-orange-200 flex items-center justify-center mx-auto shadow-inner">
                <BarChart2 className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {documentFileName ? `Ready to Quiz: ${documentFileName}` : customTopicInput ? `Ready for Quiz: "${customTopicInput}"` : labels.noQuizTitle}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {documentFileName || customTopicInput
                    ? "Click the button below to formulate interactive multiple-choice questions with dialect explanations."
                    : "Upload a study document (PDF/TXT) or enter a subject topic in the bar above, then click 'Generate Adaptive Quiz' to create interactive questions."}
                </p>
              </div>

              {(customTopicInput || documentFileName) && (
                <div className="pt-2">
                  <button
                    onClick={() => handleGenerate(customTopicInput || documentFileName)}
                    disabled={isGenerating}
                    className="px-6 py-3 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-bold shadow-lg shadow-orange-500/20 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-105"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isGenerating ? "Preparing Quiz..." : `Start Quiz: "${customTopicInput || documentFileName}"`}</span>
                  </button>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const sampleQuestions = getLocalizedQuiz(selectedLanguage.id);
                    setIsCustomQuiz(false);
                    setQuizQuestions(sampleQuestions);
                    setQuizTitle(`Sample Practice Quiz (${selectedLanguage.name})`);
                    setCurrentQuizIndex(0);
                    setSelectedAnswers({});
                    setQuizCompleted(false);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ea580c] border border-orange-200 text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load {selectedLanguage.name} Sample Quiz</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ea580c]" />
                <span>Strictly user-driven: Provide a topic or document above to generate.</span>
              </div>
            </div>
          ) : !quizCompleted ? (
            <div className="space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c] flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4" />
                  <span>{labels.questionNumber} {currentQuizIndex + 1} {labels.ofTotal} {quizQuestions.length}</span>
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleDownloadQuizPDF}
                    disabled={isDownloadingPDF}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    title="Download complete quiz and solutions as PDF"
                  >
                    <Download className={`w-3.5 h-3.5 ${isDownloadingPDF ? 'animate-bounce' : ''}`} />
                    <span>{isDownloadingPDF ? 'Generating PDF...' : 'Download Quiz PDF'}</span>
                  </button>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-orange-50 text-[#ea580c]">
                    {labels.difficultyLabel}: {currentQ?.difficulty || 'Standard'}
                  </span>
                  <button
                    onClick={() => {
                      setIsCustomQuiz(false);
                      setQuizQuestions([]);
                      setSelectedAnswers({});
                      setCurrentQuizIndex(0);
                      setQuizCompleted(false);
                      setCustomTopicInput('');
                    }}
                    className="text-[11px] text-slate-400 hover:text-red-600 font-medium cursor-pointer"
                  >
                    {labels.resetBtn}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {currentQ?.question}
                </h3>
                {currentQ?.questionDialect && (
                  <p className="text-xs text-orange-950/80 italic bg-orange-50/60 p-2.5 rounded-xl border border-orange-100/80">
                    "{currentQ.questionDialect}"
                  </p>
                )}
              </div>

              {/* 4 Options */}
              <div className="space-y-2.5">
                {currentQ?.options.map((option, idx) => {
                  const isThisOptionChosen = userSelectedOption === idx;
                  let btnStyle = "bg-slate-50 border-slate-200 text-slate-800 hover:bg-orange-50/50";

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswer) {
                      btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                    } else if (isThisOptionChosen) {
                      btnStyle = "bg-rose-50 border-rose-400 text-rose-900";
                    } else {
                      btnStyle = "bg-slate-50/60 border-slate-200 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!isAnswered) {
                          setSelectedAnswers(prev => ({ ...prev, [currentQuizIndex]: idx }));
                        }
                      }}
                      aria-keyshortcuts={String.fromCharCode(65 + idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <kbd className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-500 border border-slate-200">
                          {String.fromCharCode(65 + idx)}
                        </kbd>
                        {isAnswered && idx === currentQ.correctAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        )}
                        {isAnswered && isThisOptionChosen && idx !== currentQ.correctAnswer && (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* AI Explanation Box (revealed when answered) */}
              {isAnswered && (
                <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-fade-in ${
                  isCorrect ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-amber-50/60 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>{isCorrect ? '✓ ' + (currentQ?.explanationDialect ? labels.explanationDialectLabel : 'Correct!') : '✗ ' + labels.explanationDialectLabel}</span>
                    <button
                      onClick={() => speakText(currentQ.explanationDialect || currentQ.explanation, selectedLanguage.code || 'hi-IN')}
                      className="text-[11px] text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                      title="Listen audio (Press L)"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{labels.listenAudioBtn}</span>
                      <kbd className="ml-0.5 px-1 py-0.2 rounded text-[9px] font-mono bg-orange-100 text-orange-800 border border-orange-200">L</kbd>
                    </button>
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                  {currentQ.explanationDialect && (
                    <p className="italic text-[11px] opacity-90 pt-1 border-t border-amber-200/60">
                      "{currentQ.explanationDialect}"
                    </p>
                  )}
                </div>
              )}

              {/* Next Question / Finish Button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  {labels.scoreLabel}: {totalScore} / {quizQuestions.length}
                </span>

                <button
                  disabled={!isAnswered}
                  onClick={() => {
                    if (currentQuizIndex < quizQuestions.length - 1) {
                      setCurrentQuizIndex(i => i + 1);
                    } else {
                      handleFinishQuiz();
                    }
                  }}
                  title={isAnswered ? "Next Question (Press Enter)" : "Select an answer first"}
                  className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md disabled:opacity-40 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{currentQuizIndex < quizQuestions.length - 1 ? labels.nextQuestionBtn : labels.restartQuizBtn}</span>
                  {isAnswered && (
                    <kbd className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white border border-white/30">
                      Enter ↵
                    </kbd>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Google Search Grounding for Quiz */}
              {(isGrounded || groundingSources.length > 0) && (
                <div className="pt-2 animate-fade-in">
                  <GroundingSourcesList
                    sources={groundingSources}
                    searchQueries={searchQueries}
                    isGrounded={isGrounded}
                  />
                </div>
              )}
            </div>
          ) : (
            /* Quiz Scorecard View */
            <div className="text-center space-y-6 py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-orange-100 text-[#ea580c] flex items-center justify-center mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{labels.studyToolsTitle}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {labels.scoreLabel}: {totalScore} / {quizQuestions.length} ({Math.round((totalScore / quizQuestions.length) * 100)}%).
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleDownloadQuizPDF}
                  disabled={isDownloadingPDF}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className={`w-4 h-4 ${isDownloadingPDF ? 'animate-bounce' : ''}`} />
                  <span>{isDownloadingPDF ? 'Generating PDF...' : 'Download Quiz PDF'}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setCurrentQuizIndex(0);
                    setQuizCompleted(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#ea580c] text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
                >
                  {labels.restartQuizBtn}
                </button>

                {onNavigateToHistory && (
                  <button
                    onClick={onNavigateToHistory}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    {labels.savedInHistory}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: VERNACULAR FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {flashcards.length === 0 ? (
            /* Empty State for Flashcards */
            <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200/80 shadow-md text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#ea580c] border border-orange-200 flex items-center justify-center mx-auto shadow-inner">
                <RotateCw className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {documentFileName ? `Ready to Create Flashcards: ${documentFileName}` : customTopicInput ? `Ready for Flashcards: "${customTopicInput}"` : labels.flashcardsTab}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {documentFileName || customTopicInput
                    ? "Click 'Generate Flashcards' above to extract high-yield concept review pairs with native dialect translations."
                    : "Upload study notes or enter a subject topic in the bar above, then click 'Generate Flashcards' to create interactive flip cards."}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const sampleCards = getLocalizedFlashcards(selectedLanguage.id);
                    setIsCustomFlashcards(false);
                    setFlashcards(sampleCards);
                    setFlashcardIndex(0);
                    setIsFlipped(false);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ea580c] border border-orange-200 text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load {selectedLanguage.name} Sample Flashcards</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                <span className="inline-block w-2 h-2 rounded-full bg-[#ea580c]" />
                <span>Strictly user-driven: Provide a topic or document above to generate.</span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                <span>{labels.cardFrontLabel} {flashcardIndex + 1} {labels.ofTotal} {flashcards.length}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#ea580c]">{flashcards[flashcardIndex]?.topic}</span>
                  <button
                    onClick={() => {
                      setIsCustomFlashcards(false);
                      setFlashcards([]);
                      setFlashcardIndex(0);
                      setIsFlipped(false);
                      setCustomTopicInput('');
                    }}
                    className="text-[11px] text-slate-400 hover:text-red-600 font-medium cursor-pointer"
                  >
                    {labels.resetBtn}
                  </button>
                </div>
              </div>

              {/* 3D Interactive Flip Card */}
              <InteractiveFlashcard
                card={flashcards[flashcardIndex]}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                labels={{
                  cardFrontLabel: labels.cardFrontLabel,
                  cardBackLabel: labels.cardBackLabel,
                  flipCardPrompt: labels.flipCardPrompt
                }}
                accessibility={accessibility}
                cardIndex={flashcardIndex}
                totalCards={flashcards.length}
                onSpeak={(text) => speakText(text, selectedLanguage.code || 'hi-IN')}
              />

              {/* Navigation Controls */}
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIndex(prev => (prev > 0 ? prev - 1 : flashcards.length - 1));
                  }}
                  title="Previous Card (Press ← Left Arrow)"
                  aria-keyshortcuts="ArrowLeft"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <kbd className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">←</kbd>
                  <span>{labels.prevCardBtn}</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">
                    Flip: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200">Space</kbd>
                  </span>
                  
                  <button
                    onClick={() => {
                      speakText(
                        isFlipped 
                          ? flashcards[flashcardIndex]?.dialectTranslation || flashcards[flashcardIndex]?.backAnswer 
                          : flashcards[flashcardIndex]?.frontQuestion,
                        selectedLanguage.code || 'hi-IN'
                      );
                    }}
                    title="Listen to card audio (Press L)"
                    aria-keyshortcuts="L"
                    className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{labels.listenAudioBtn}</span>
                    <kbd className="hidden sm:inline px-1 py-0.2 rounded text-[9px] font-mono bg-orange-100 text-orange-800 border border-orange-200">L</kbd>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIndex(prev => (prev + 1) % flashcards.length);
                  }}
                  title="Next Card (Press → Right Arrow)"
                  aria-keyshortcuts="ArrowRight"
                  className="text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] px-5 py-2 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>{labels.nextCardBtn}</span>
                  <kbd className="text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded border border-white/30">→</kbd>
                </button>
              </div>

              {/* Google Search Grounding for Flashcards */}
              {(isGrounded || groundingSources.length > 0) && (
                <div className="pt-2 px-2 animate-fade-in">
                  <GroundingSourcesList
                    sources={groundingSources}
                    searchQueries={searchQueries}
                    isGrounded={isGrounded}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
