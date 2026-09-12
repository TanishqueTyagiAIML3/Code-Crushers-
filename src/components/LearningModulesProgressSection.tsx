import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Award, BookOpen, Sparkles, RotateCcw, 
  MessageSquare, BarChart2, Filter, ArrowRight, Zap, 
  Activity, FlaskConical, Calculator, Check, Clock, RefreshCw,
  AlertTriangle, TrendingUp, HelpCircle, ArrowUpRight, Compass,
  PlayCircle, X
} from 'lucide-react';
import { 
  getAllTopics, toggleTopicCompleted, 
  advanceTopicLesson, resetAllProgress, resetSingleTopicProgress, getOverallProgressStats,
  LearningTopic, PROGRESS_UPDATE_EVENT 
} from '../utils/progressService';
import { useCurriculumProgress } from '../context/CurriculumProgressContext';
import { 
  getFullDynamicMasteryAnalysis, 
  getLocalizedMasteryContent,
  recordTopicPerformance,
  clearUserPerformance,
  resetSingleTopicPerformance,
  getUserPerformanceData,
  MASTERY_UPDATE_EVENT,
  DynamicTopicInsight,
  MasteryLevel,
  resetAllUserActivityAndMastery
} from '../utils/masteryAnalysisService';
import { CircularProgressRing } from './CircularProgressRing';
import { useLanguage } from '../context/LanguageContext';

interface LearningModulesProgressSectionProps {
  isDarkMode?: boolean;
  onSelectTopicForChat?: (topicTitleOrPrompt: string) => void;
  onSelectTopicForQuiz?: (topicTitle: string) => void;
}

export function LearningModulesProgressSection({
  isDarkMode = false,
  onSelectTopicForChat,
  onSelectTopicForQuiz
}: LearningModulesProgressSectionProps) {
  const { selectedLanguage } = useLanguage();
  const langId = selectedLanguage?.id || 'hi-bhojpuri';

  // Primary view: 'mastery' (Dynamic Performance Analysis) or 'modules' (Full Curriculum List)
  const [viewMode, setViewMode] = useState<'mastery' | 'modules'>('mastery');

  // Mastery filter: 'all' | 'mastered' | 'progressing' | 'needs_improvement'
  const [masteryFilter, setMasteryFilter] = useState<'all' | MasteryLevel>('all');

  // Modules filter for raw curriculum view: default to 'all' so users see full subject curriculum
  const [moduleFilter, setModuleFilter] = useState<'all' | 'completed' | 'Physics' | 'Biology' | 'Chemistry' | 'Mathematics'>('all');

  // Shared global curriculum state from Context API
  const { 
    topics, 
    stats: rawStats,
    toggleTopicComplete, 
    advanceTopicStep, 
    resetTopic, 
    resetAllTopics,
    refreshProgress 
  } = useCurriculumProgress();

  // Dynamic analysis state
  const [analysisData, setAnalysisData] = useState(() => getFullDynamicMasteryAnalysis(langId));
  const [justToggledId, setJustToggledId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // In-app modal state for resetting (replaces window.confirm which is blocked in sandboxed iframes)
  const [resetModalState, setResetModalState] = useState<{
    isOpen: boolean;
    mode: 'all' | 'single';
    topicId?: string;
    topicTitle?: string;
  } | null>(null);

  // Temporary feedback toast notification
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Sync with both progress and performance storage events
  const refreshAll = () => {
    setAnalysisData(getFullDynamicMasteryAnalysis(langId));
    refreshProgress();
  };

  useEffect(() => {
    refreshAll();

    const handleUpdate = () => {
      refreshAll();
    };

    window.addEventListener(MASTERY_UPDATE_EVENT, handleUpdate);
    window.addEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(MASTERY_UPDATE_EVENT, handleUpdate);
      window.removeEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [langId, refreshProgress]);

  const loc = getLocalizedMasteryContent(langId);
  const { summary, topics: analyzedTopics } = analysisData;

  // Filter dynamic topics: show attempted topics first when 'all' is selected
  const displayedDynamicTopics = analyzedTopics
    .filter(topic => {
      if (masteryFilter === 'all') return true;
      return topic.masteryLevel === masteryFilter;
    })
    .sort((a, b) => {
      if (masteryFilter === 'all') {
        if (b.attempts !== a.attempts) return b.attempts - a.attempts;
        return b.accuracy - a.accuracy;
      }
      return 0;
    });

  // Filter raw curriculum topics
  const displayedCurriculumTopics = topics.filter(topic => {
    if (moduleFilter === 'completed') return topic.isCompleted;
    if (moduleFilter === 'all') return true;
    return topic.category === moduleFilter;
  });

  const handleToggleCompleted = (topicId: string) => {
    setJustToggledId(topicId);
    toggleTopicComplete(topicId);
    setAnalysisData(getFullDynamicMasteryAnalysis(langId));
    setTimeout(() => setJustToggledId(null), 1200);
  };

  const handleAdvanceStep = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJustToggledId(topicId);
    advanceTopicStep(topicId);
    setAnalysisData(getFullDynamicMasteryAnalysis(langId));
    setTimeout(() => setJustToggledId(null), 1200);
  };

  const handleOpenResetAll = () => {
    setResetModalState({
      isOpen: true,
      mode: 'all'
    });
  };

  /**
   * Complete reset of all user activity, scores, attempts, history, and curriculum progress.
   * Reverts all metrics back to the absolute initial default (0% mastery, 0 attempts, unattempted).
   * Triggers an immediate UI re-render with clean state.
   */
  const handleResetAllActivity = async () => {
    setIsResetting(true);
    try {
      // 1. Completely clear all user activity, scores, attempts, history, and progress in storage
      await resetAllUserActivityAndMastery();
      
      // 2. Clear curriculum context
      resetAllTopics();

      // 3. Immediately compute and set fresh absolute initial analysis
      const cleanAnalysis = getFullDynamicMasteryAnalysis(langId);
      setAnalysisData(cleanAnalysis);

      // 4. Revert UI filters back to default initial state
      setMasteryFilter('all');
      setModuleFilter('all');
      setJustToggledId(null);
      setResetModalState(null);

      // 5. Trigger refresh on context and progress stats
      refreshProgress();

      // 6. Set feedback notice banner
      setFeedbackNotice(loc.resetSuccessToast || 'All activity data, scores, attempts, and history have been reset to initial state (0%).');
    } catch (err) {
      console.error('Error during activity reset:', err);
    } finally {
      setTimeout(() => setIsResetting(false), 500);
      setTimeout(() => setFeedbackNotice(null), 5000);
    }
  };

  const handleOpenResetTopic = (topicId: string, topicTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setResetModalState({
      isOpen: true,
      mode: 'single',
      topicId,
      topicTitle
    });
  };

  const handleConfirmReset = async () => {
    if (!resetModalState) return;

    if (resetModalState.mode === 'all') {
      await handleResetAllActivity();
    } else if (resetModalState.mode === 'single' && resetModalState.topicId) {
      const { topicId, topicTitle } = resetModalState;
      resetSingleTopicPerformance(topicId);
      resetTopic(topicId);
      setJustToggledId(topicId);
      setAnalysisData(getFullDynamicMasteryAnalysis(langId));
      refreshProgress();
      setFeedbackNotice(`"${topicTitle}" reset back to 0%.`);
      setTimeout(() => setJustToggledId(null), 1200);
      setResetModalState(null);
      setTimeout(() => setFeedbackNotice(null), 4000);
    }
  };

  const handleCancelReset = () => {
    setResetModalState(null);
  };

  useEffect(() => {
    if (!resetModalState?.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setResetModalState(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetModalState?.isOpen]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Physics':
        return <Zap className="w-3.5 h-3.5 text-[#ea580c]" />;
      case 'Biology':
        return <Activity className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Chemistry':
        return <FlaskConical className="w-3.5 h-3.5 text-sky-600" />;
      case 'Mathematics':
        return <Calculator className="w-3.5 h-3.5 text-violet-600" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getMasteryBadge = (level: MasteryLevel) => {
    switch (level) {
      case 'mastered':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 inline-flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {loc.masteredTag}
          </span>
        );
      case 'progressing':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800 inline-flex items-center gap-1.5 shadow-xs">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {loc.progressingTag}
          </span>
        );
      case 'needs_improvement':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 inline-flex items-center gap-1.5 shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            {loc.needsImprovementTag}
          </span>
        );
      case 'unattempted':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 inline-flex items-center gap-1.5 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {loc.unattemptedTag || 'Pending'}
          </span>
        );
    }
  };

  const getRingColor = (level: MasteryLevel) => {
    switch (level) {
      case 'mastered':
        return '#10b981'; // Emerald
      case 'progressing':
        return '#f59e0b'; // Amber
      case 'needs_improvement':
        return '#f43f5e'; // Rose
      case 'unattempted':
        return isDarkMode ? '#475569' : '#cbd5e1'; // Slate
    }
  };

  return (
    <section 
      id="adaptive-mastery-dashboard-section"
      aria-label="Adaptive Performance Mastery Dashboard"
      className={`w-full rounded-3xl border p-5 sm:p-7 space-y-6 transition-all shadow-sm overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-900/95 border-slate-800 text-slate-100' 
          : 'bg-white border-slate-200/80 text-slate-900 shadow-[0_6px_25px_-5px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Dynamic Reset Feedback Banner */}
      {feedbackNotice && (
        <div 
          id="mastery-reset-feedback-banner"
          role="status"
          className="p-3 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{feedbackNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackNotice(null)}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 p-0.5 rounded-md cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header with View Switcher & Overall Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-4">
          {/* Dynamic Overall Score Progress Ring */}
          <div className="relative shrink-0 flex flex-col items-center">
            <CircularProgressRing 
              id="overall-mastery-score-ring"
              progress={viewMode === 'mastery' ? summary.overallScore : rawStats.overallPercentage}
              size={68}
              strokeWidth={7}
              color={viewMode === 'mastery' ? (summary.overallScore >= 80 ? '#10b981' : summary.overallScore >= 50 ? '#f59e0b' : '#ea580c') : '#ea580c'}
              showPercentageText={true}
              showCheckmarkWhenComplete={summary.overallScore >= 80 && summary.totalAttempts > 0}
              isDarkMode={isDarkMode}
              ariaLabel={`Overall student mastery accuracy: ${summary.overallScore}%`}
            />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">
              {viewMode === 'mastery'
                ? (summary.totalAttempts === 0 ? '0 Attempts' : `${summary.totalAttempts} ${summary.totalAttempts === 1 ? 'Attempt' : 'Attempts'}`)
                : `${rawStats.completedTopicsCount}/${rawStats.totalTopics} Done`}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#ea580c] dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ea580c]" />
                Adaptive Learning Assistant
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                {selectedLanguage.name}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{loc.headerTitle}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {loc.headerSubtitle}
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Dynamic Mastery vs Curriculum */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              id="switch-view-mastery-btn"
              type="button"
              onClick={() => setViewMode('mastery')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'mastery'
                  ? 'bg-[#ea580c] text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Dynamic Performance</span>
            </button>
            <button
              id="switch-view-modules-btn"
              type="button"
              onClick={() => setViewMode('modules')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'modules'
                  ? 'bg-white dark:bg-slate-700 text-[#ea580c] dark:text-orange-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum ({topics.length})</span>
            </button>
          </div>

          <button
            id="reset-mastery-metrics-btn"
            type="button"
            onClick={handleResetAllActivity}
            disabled={isResetting}
            title={loc.actionResetBtn || "Reset all user activity, scores, attempts, and mastery to 0%"}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-slate-500 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-all cursor-pointer text-xs flex items-center gap-1.5 font-medium shadow-2xs disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-rose-500' : ''}`} />
            <span className="inline">{isResetting ? 'Resetting...' : (loc.actionResetBtn ? loc.actionResetBtn.split(' ')[0] : 'Reset')}</span>
          </button>
        </div>
      </div>

      {/* 2. Analytical Summary of Overall Performance (When in Mastery View) */}
      {viewMode === 'mastery' && (
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isDarkMode 
            ? 'bg-slate-800/40 border-slate-700/80 text-slate-200' 
            : 'bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white border-orange-200/70 text-slate-800'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c] dark:text-orange-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Live Performance Analysis
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {summary.totalAttempts === 0 
                    ? '0 tests completed • Live score will calculate on quiz attempt' 
                    : `${summary.totalAttempts} total quiz attempt(s) • ${summary.totalCorrectAnswers}/${summary.totalQuestionsAttempted} correct`}
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                {summary.summaryText}
              </p>

              {summary.totalAttempts === 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectTopicForQuiz) {
                        onSelectTopicForQuiz('Photosynthesis');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-orange-500/20 inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Start Practice Quiz (Photosynthesis)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Badges of Status */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{summary.masteredCount} {loc.masteredTag}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{summary.progressingCount} {loc.progressingTag}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>{summary.needsImprovementCount} {loc.needsImprovementTag}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{summary.unattemptedCount} {loc.unattemptedTag || 'Pending'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Mastery Filter Navigation (Tabs) */}
      {viewMode === 'mastery' ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setMasteryFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                masteryFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{loc.filters.all} ({analyzedTopics.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setMasteryFilter('mastered')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                masteryFilter === 'mastered'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{loc.filters.mastered} ({summary.masteredCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setMasteryFilter('progressing')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                masteryFilter === 'progressing'
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{loc.filters.progressing} ({summary.progressingCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setMasteryFilter('needs_improvement')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                masteryFilter === 'needs_improvement'
                  ? 'bg-rose-600 text-white shadow-sm font-bold'
                  : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{loc.filters.needsImprovement} ({summary.needsImprovementCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setMasteryFilter('unattempted')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                masteryFilter === 'unattempted'
                  ? 'bg-slate-700 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{loc.filters.unattempted} ({summary.unattemptedCount})</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            Dynamic diagnostics updated strictly from your quiz attempts
          </span>
        </div>
      ) : (
        /* Curriculum Mode Filter Bar */
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setModuleFilter('completed')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                moduleFilter === 'completed'
                  ? 'bg-[#ea580c] text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed Topics ({rawStats.completedTopicsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setModuleFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                moduleFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-[#ea580c] dark:text-orange-400 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>All Topics ({topics.length})</span>
            </button>

            {(['Physics', 'Biology', 'Chemistry', 'Mathematics'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setModuleFilter(cat)}
                className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer hidden sm:flex items-center gap-1 text-[11px] ${
                  moduleFilter === cat
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Click ring to toggle completion
          </span>
        </div>
      )}

      {/* 4. Topic-Wise Breakdown Grid */}
      {viewMode === 'mastery' ? (
        /* DYNAMIC MASTERY PERFORMANCE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 w-full min-w-0">
          {displayedDynamicTopics.map(item => {
            const ringColor = getRingColor(item.masteryLevel);

            return (
              <div
                key={item.topicId}
                id={`mastery-topic-${item.topicId}`}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 relative group overflow-hidden ${
                  item.masteryLevel === 'mastered'
                    ? isDarkMode
                      ? 'bg-slate-800/80 border-emerald-800/40 hover:border-emerald-700 shadow-sm'
                      : 'bg-emerald-50/20 border-emerald-200/80 hover:border-emerald-300 shadow-xs'
                    : item.masteryLevel === 'progressing'
                    ? isDarkMode
                      ? 'bg-slate-800/70 border-amber-800/40 hover:border-amber-700 shadow-sm'
                      : 'bg-amber-50/20 border-amber-200/80 hover:border-amber-300 shadow-xs'
                    : isDarkMode
                      ? 'bg-slate-800/70 border-rose-800/40 hover:border-rose-700 shadow-sm'
                      : 'bg-rose-50/20 border-rose-200/80 hover:border-rose-300 shadow-xs'
                }`}
              >
                {/* Header: Title, Category & Mastery Level */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 flex items-center gap-1 shrink-0">
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </span>
                      {getMasteryBadge(item.masteryLevel)}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight break-words">
                      {item.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                      {item.nativeTitle}
                    </p>
                  </div>

                  {/* Circular Accuracy Ring */}
                  <div className="shrink-0 flex flex-col items-center">
                    <CircularProgressRing 
                      id={`ring-${item.topicId}`}
                      progress={item.accuracy}
                      size={54}
                      strokeWidth={5.5}
                      color={ringColor}
                      showPercentageText={true}
                      showCheckmarkWhenComplete={item.masteryLevel === 'mastered'}
                      isDarkMode={isDarkMode}
                      ariaLabel={`${item.title} accuracy: ${item.accuracy}%`}
                    />
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {item.attempts} {loc.attemptsLabel.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Personalized Insights Box (Strengths & Struggles) */}
                <div className={`p-3.5 rounded-xl space-y-2.5 text-xs ${
                  isDarkMode ? 'bg-slate-900/60 border border-slate-700/70' : 'bg-white/90 border border-slate-200/80'
                }`}>
                  {/* What Did Well (Strength) */}
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        {loc.whatDidWellLabel}:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                        {item.whatDidWell}
                      </p>
                    </div>
                  </div>

                  {/* Where Struggled (Struggle / Mistakes) */}
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="font-bold text-rose-800 dark:text-rose-300">
                        {loc.whereStruggledLabel}:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                        {item.whereStruggled}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommended Next Action Banner - Vertical structured hierarchy to prevent overflow */}
                <div className={`p-3.5 rounded-xl border space-y-2.5 overflow-hidden ${
                  item.recommendedAction.type === 'review'
                    ? 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
                    : item.recommendedAction.type === 'practice'
                    ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
                    : 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200'
                }`}>
                  {/* Top row: Recommendation Badge and subtle Topic Reset button */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                      {loc.recommendedActionLabel}
                    </div>

                    {/* Reset Single Topic Option */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenResetTopic(item.topicId, item.title, e)}
                      className="px-2 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/80 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-[11px] font-medium transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
                      title={loc.actionResetBtn || 'Reset Topic Progress'}
                      aria-label={loc.actionResetBtn || 'Reset Topic Progress'}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{loc.actionResetBtn ? loc.actionResetBtn.split(' ')[0] : 'Reset'}</span>
                    </button>
                  </div>

                  {/* Recommendation Title and Description */}
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                      <span className="break-words">{item.recommendedAction.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                      {item.recommendedAction.description}
                    </p>
                  </div>

                  {/* Direct Action Trigger Buttons: Proportional grid that never overflows */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectTopicForQuiz) {
                          onSelectTopicForQuiz(item.title);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 min-w-0"
                      title="Start Quiz on this topic"
                    >
                      <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.attempts === 0 ? (loc.actionPracticeBtn || 'Start Quiz') : 'Practice Again'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectTopicForChat) {
                          onSelectTopicForChat(item.recommendedAction.promptQuery);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 min-w-0"
                      title={loc.actionReviewBtn}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                      <span className="truncate">{loc.actionReviewBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* STANDARD CURRICULUM VIEW (Retaining full compatibility) */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full min-w-0">
          {displayedCurriculumTopics.map(topic => {
            const isToggled = justToggledId === topic.id;

            return (
              <div
                key={topic.id}
                id={`topic-card-${topic.id}`}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 relative group overflow-hidden ${
                  topic.isCompleted
                    ? isDarkMode
                      ? 'bg-slate-800/80 border-emerald-800/60 shadow-xs'
                      : 'bg-emerald-50/20 border-emerald-200/90 shadow-xs'
                    : isDarkMode
                      ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        {getCategoryIcon(topic.category)}
                        <span>{topic.category}</span>
                      </span>

                      {topic.isCompleted ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 inline-flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          Mastered
                        </span>
                      ) : null}
                    </div>

                    <h3 className={`text-base font-bold transition-colors ${
                      topic.isCompleted 
                        ? 'text-[#ea580c] dark:text-orange-400' 
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {topic.nativeTitle}
                    </p>
                  </div>

                  <div 
                    onClick={() => handleToggleCompleted(topic.id)}
                    className="shrink-0 cursor-pointer transform hover:scale-105 active:scale-95 transition-transform"
                    title={`Click to mark ${topic.isCompleted ? 'incomplete' : 'complete'}`}
                  >
                    <CircularProgressRing 
                      id={`ring-${topic.id}`}
                      progress={topic.progress}
                      size={48}
                      strokeWidth={5}
                      color={topic.isCompleted ? '#10b981' : topic.accentColor}
                      showPercentageText={!topic.isCompleted}
                      showCheckmarkWhenComplete={true}
                      isDarkMode={isDarkMode}
                      ariaLabel={`${topic.title} progress: ${topic.progress}%`}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Lessons: {topic.completedLessons}/{topic.totalLessons}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectTopicForChat && onSelectTopicForChat(topic.title)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Ask doubt about this topic"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTopicForQuiz && onSelectTopicForQuiz(topic.title)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Take quiz on this topic"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenResetTopic(topic.id, topic.title, e)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title={loc.actionResetBtn || 'Reset Topic Progress'}
                      aria-label="Reset Topic"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleAdvanceStep(topic.id, e)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        topic.isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-[#ea580c] hover:text-white'
                      }`}
                    >
                      {topic.isCompleted ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Completed✓</span>
                        </>
                      ) : (
                        <span>+Step</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-App Accessible Reset Confirmation Modal (Guaranteed to work in sandboxed iframes) */}
      {resetModalState?.isOpen && (
        <div 
          id="reset-confirmation-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={handleCancelReset}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div 
            id="reset-confirmation-modal-card"
            className={`relative w-full max-w-md rounded-3xl border p-6 space-y-5 shadow-2xl transition-all ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]' 
                : 'bg-white border-slate-200 text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 id="reset-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {resetModalState.mode === 'all'
                      ? (loc.resetAllModalTitle || 'Reset All Mastery & Progress Data?')
                      : (loc.resetTopicModalTitle ? loc.resetTopicModalTitle(resetModalState.topicTitle || '') : `Reset "${resetModalState.topicTitle}"?`)}
                  </h3>
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                    {resetModalState.mode === 'all' ? 'All Subjects & Topics' : 'Single Topic Reset'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelReset}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {resetModalState.mode === 'all'
                ? (loc.resetAllModalDesc || 'This will reset all quiz attempts, accuracy statistics, identified mistakes, and completed lessons across all topics back to a clean initial state (0%).')
                : (loc.resetTopicModalDesc || 'This will reset all quiz attempts, accuracy score, mistakes, and lesson milestones for this topic back to 0 (clean state).')}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="reset-modal-cancel-btn"
                type="button"
                onClick={handleCancelReset}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                {loc.cancelBtn || 'Cancel'}
              </button>

              <button
                id="reset-modal-confirm-btn"
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{loc.confirmResetBtn || 'Yes, Reset'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
