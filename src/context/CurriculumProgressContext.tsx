import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LearningTopic, 
  OverallProgressStats, 
  getAllTopics, 
  getOverallProgressStats,
  markTopicAsCompleted,
  markTopicAsIncomplete,
  toggleTopicCompleted,
  advanceTopicLesson,
  resetSingleTopicProgress,
  resetAllProgress,
  updateTopicProgress,
  PROGRESS_UPDATE_EVENT
} from '../utils/progressService';
import { 
  MASTERY_UPDATE_EVENT,
  clearUserPerformance,
  resetSingleTopicPerformance,
  resetAllUserActivityAndMastery
} from '../utils/masteryAnalysisService';

export interface CurriculumProgressContextType {
  topics: LearningTopic[];
  stats: OverallProgressStats;
  markTopicComplete: (topicId: string) => void;
  markTopicIncomplete: (topicId: string) => void;
  toggleTopicComplete: (topicId: string) => void;
  advanceTopicStep: (topicId: string) => void;
  resetTopic: (topicId: string) => void;
  resetAllTopics: () => void;
  setTopicProgressPercent: (topicId: string, progressPercent: number, isCompleted?: boolean) => void;
  refreshProgress: () => void;
}

const CurriculumProgressContext = createContext<CurriculumProgressContextType | undefined>(undefined);

export function CurriculumProgressProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<LearningTopic[]>(() => getAllTopics());
  const [stats, setStats] = useState<OverallProgressStats>(() => getOverallProgressStats());

  const refreshProgress = useCallback(() => {
    setTopics(getAllTopics());
    setStats(getOverallProgressStats());
  }, []);

  useEffect(() => {
    refreshProgress();

    const handleUpdate = () => {
      refreshProgress();
    };

    window.addEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
    window.addEventListener(MASTERY_UPDATE_EVENT, handleUpdate);
    window.addEventListener('app:history_updated', handleUpdate);
    window.addEventListener('app:history_deleted', handleUpdate);
    window.addEventListener('app:history_cleared', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(PROGRESS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener(MASTERY_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('app:history_updated', handleUpdate);
      window.removeEventListener('app:history_deleted', handleUpdate);
      window.removeEventListener('app:history_cleared', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshProgress]);

  const markTopicComplete = useCallback((topicId: string) => {
    markTopicAsCompleted(topicId);
    refreshProgress();
  }, [refreshProgress]);

  const markTopicIncomplete = useCallback((topicId: string) => {
    markTopicAsIncomplete(topicId);
    refreshProgress();
  }, [refreshProgress]);

  const toggleTopicComplete = useCallback((topicId: string) => {
    toggleTopicCompleted(topicId);
    refreshProgress();
  }, [refreshProgress]);

  const advanceTopicStep = useCallback((topicId: string) => {
    advanceTopicLesson(topicId);
    refreshProgress();
  }, [refreshProgress]);

  const resetTopic = useCallback((topicId: string) => {
    resetSingleTopicPerformance(topicId);
    resetSingleTopicProgress(topicId);
    refreshProgress();
  }, [refreshProgress]);

  const resetAllTopics = useCallback(() => {
    resetAllUserActivityAndMastery();
    refreshProgress();
  }, [refreshProgress]);

  const setTopicProgressPercent = useCallback((topicId: string, progressPercent: number, isCompleted?: boolean) => {
    updateTopicProgress(topicId, progressPercent, isCompleted);
    refreshProgress();
  }, [refreshProgress]);

  const value = useMemo<CurriculumProgressContextType>(() => ({
    topics,
    stats,
    markTopicComplete,
    markTopicIncomplete,
    toggleTopicComplete,
    advanceTopicStep,
    resetTopic,
    resetAllTopics,
    setTopicProgressPercent,
    refreshProgress
  }), [
    topics,
    stats,
    markTopicComplete,
    markTopicIncomplete,
    toggleTopicComplete,
    advanceTopicStep,
    resetTopic,
    resetAllTopics,
    setTopicProgressPercent,
    refreshProgress
  ]);

  return (
    <CurriculumProgressContext.Provider value={value}>
      {children}
    </CurriculumProgressContext.Provider>
  );
}

export function useCurriculumProgress(): CurriculumProgressContextType {
  const context = useContext(CurriculumProgressContext);
  if (!context) {
    throw new Error('useCurriculumProgress must be used within a CurriculumProgressProvider');
  }
  return context;
}
