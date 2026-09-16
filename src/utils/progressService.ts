/**
 * ShikshaSathi Local Storage Progress Service
 * 
 * Provides resilient, offline-first client tracking for student progress
 * through structured learning modules and curriculum topics.
 * 
 * Capabilities:
 * 1. Tracks lesson milestones, progress percentages (0-100%), and completion state in localStorage.
 * 2. Provides default curricular modules matching ShikshaSathi's high-yield STEM subjects.
 * 3. Reactive event-driven synchronization (`shikshasathi-progress-updated`) across all components.
 * 4. Enables marking topics complete, stepping lessons, and querying completion metrics.
 */

export interface LearningTopic {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  nativeTitle: string;
  description: string;
  category: 'Physics' | 'Biology' | 'Chemistry' | 'Mathematics' | 'General';
  totalLessons: number;
  completedLessons: number;
  progress: number; // 0 - 100
  isCompleted: boolean;
  completedAt?: string | null;
  lastAccessedAt?: string;
  accentColor: string;
}

export interface LearningModule {
  id: string;
  title: string;
  nativeTitle: string;
  iconName: string;
  category: 'Physics' | 'Biology' | 'Chemistry' | 'Mathematics' | 'General';
  description: string;
  accentColor: string;
  topicIds: string[];
}

export interface StoredTopicProgress {
  completedLessons: number;
  progress: number;
  isCompleted: boolean;
  completedAt?: string | null;
  lastAccessedAt?: string;
  resetAt?: string | null;
}

export interface ProgressState {
  topics: Record<string, StoredTopicProgress>;
  lastUpdated: string;
}

export interface OverallProgressStats {
  totalTopics: number;
  completedTopicsCount: number;
  inProgressTopicsCount: number;
  notStartedTopicsCount: number;
  overallPercentage: number;
  masteryScore: number;
}

const STORAGE_KEY = 'shikshasathi_learning_progress_v2';
const V1_STORAGE_KEY = 'shikshasathi_learning_progress_v1';
export const PROGRESS_UPDATE_EVENT = 'shikshasathi-progress-updated';

// Master list of Curricular Modules
export const DEFAULT_MODULES: LearningModule[] = [
  {
    id: 'mod-physics',
    title: 'Physics & Natural Laws',
    nativeTitle: 'भौतिक विज्ञान और प्राकृतिक नियम',
    iconName: 'Zap',
    category: 'Physics',
    description: 'Fundamental principles of motion, energy, mechanics, and quantum reality.',
    accentColor: '#ea580c', // Orange
    topicIds: ['top-newton', 'top-ohms', 'top-quantum', 'top-archimedes']
  },
  {
    id: 'mod-biology',
    title: 'Biology & Life Systems',
    nativeTitle: 'जीव विज्ञान और जीवन तंत्र',
    iconName: 'Activity',
    category: 'Biology',
    description: 'Plant biology, cellular structures, human physiology, and genetics.',
    accentColor: '#10b981', // Emerald
    topicIds: ['top-photosynthesis', 'top-cell-structure', 'top-circulation', 'top-genetics']
  },
  {
    id: 'mod-chemistry',
    title: 'Chemistry & Matter',
    nativeTitle: 'रसायन विज्ञान और द्रव्य',
    iconName: 'FlaskConical',
    category: 'Chemistry',
    description: 'Acids, bases, atomic structures, molecular bonding, and periodic elements.',
    accentColor: '#0ea5e9', // Sky Blue
    topicIds: ['top-acids-bases', 'top-periodic-table', 'top-reactions']
  },
  {
    id: 'mod-math',
    title: 'Mathematics & Logic',
    nativeTitle: 'गणित और तार्किक विश्लेषण',
    iconName: 'Calculator',
    category: 'Mathematics',
    description: 'Algebraic equations, trigonometry, statistical data, and logical geometry.',
    accentColor: '#8b5cf6', // Violet
    topicIds: ['top-linear-equations', 'top-probability', 'top-trigonometry']
  }
];

// Master list of Learning Topics
export const DEFAULT_TOPICS: LearningTopic[] = [
  // Physics Topics
  {
    id: 'top-photosynthesis',
    moduleId: 'mod-biology',
    moduleTitle: 'Biology & Life Systems',
    title: 'Photosynthesis & Solar Energy',
    nativeTitle: 'प्रकाश संश्लेषण (Photosynthesis)',
    description: 'How chlorophyll captures sunlight to convert water and CO2 into chemical glucose and oxygen.',
    category: 'Biology',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#10b981'
  },
  {
    id: 'top-newton',
    moduleId: 'mod-physics',
    moduleTitle: 'Physics & Natural Laws',
    title: 'Newton\'s Laws of Motion',
    nativeTitle: 'न्यूटन के गति के नियम (Newton\'s Laws)',
    description: 'Inertia, momentum acceleration (F=ma), and equal and opposite action-reaction dynamics.',
    category: 'Physics',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#ea580c'
  },
  {
    id: 'top-ohms',
    moduleId: 'mod-physics',
    moduleTitle: 'Physics & Natural Laws',
    title: 'Ohm\'s Law & Resistance',
    nativeTitle: 'ओम का नियम (Ohm\'s Law: V = I × R)',
    description: 'The relationship between electric potential, current flow, and circuit resistance.',
    category: 'Physics',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#ea580c'
  },
  {
    id: 'top-quantum',
    moduleId: 'mod-physics',
    moduleTitle: 'Physics & Natural Laws',
    title: 'Quantum Mechanics Basics',
    nativeTitle: 'क्वांटम यांत्रिकी की मूल बातें',
    description: 'Wave-particle duality, uncertainty principle, and microscopic atomic behavior.',
    category: 'Physics',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#ea580c'
  },
  {
    id: 'top-archimedes',
    moduleId: 'mod-physics',
    moduleTitle: 'Physics & Natural Laws',
    title: 'Archimedes\' Principle & Buoyancy',
    nativeTitle: 'आर्किमिडीज का सिद्धांत (उत्प्लावन बल)',
    description: 'Buoyant forces, fluid displacement, and why massive steel ships float on water.',
    category: 'Physics',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#ea580c'
  },

  // Biology Topics
  {
    id: 'top-cell-structure',
    moduleId: 'mod-biology',
    moduleTitle: 'Biology & Life Systems',
    title: 'Cell Structure & Organelles',
    nativeTitle: 'कोशिका की संरचना और अंगक',
    description: 'Nucleus, mitochondria powerhouses, ribosomes, and the protective cell membrane.',
    category: 'Biology',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#10b981'
  },
  {
    id: 'top-circulation',
    moduleId: 'mod-biology',
    moduleTitle: 'Biology & Life Systems',
    title: 'Human Circulatory System',
    nativeTitle: 'मानव परिसंचरण तंत्र (हृदय व रक्त वाहिकाएं)',
    description: 'Four-chambered heart anatomy, pulmonary circulation, and arterial oxygen delivery.',
    category: 'Biology',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#10b981'
  },
  {
    id: 'top-genetics',
    moduleId: 'mod-biology',
    moduleTitle: 'Biology & Life Systems',
    title: 'Genetics & DNA Code',
    nativeTitle: 'आनुवंशिकी और डीएनए (DNA & Genetics)',
    description: 'Double helix nucleotide base pairs, chromosome heredity, and gene expressions.',
    category: 'Biology',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#10b981'
  },

  // Chemistry Topics
  {
    id: 'top-acids-bases',
    moduleId: 'mod-chemistry',
    moduleTitle: 'Chemistry & Matter',
    title: 'Acids, Bases & pH Indicators',
    nativeTitle: 'अम्ल, क्षार और लिटमस परीक्षण',
    description: 'Hydronium ions, litmus paper coloration, neutralization reactions, and practical pH scale.',
    category: 'Chemistry',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#0ea5e9'
  },
  {
    id: 'top-periodic-table',
    moduleId: 'mod-chemistry',
    moduleTitle: 'Chemistry & Matter',
    title: 'Periodic Table & Valency',
    nativeTitle: 'आवर्त सारणी और संयोजकता (Valency)',
    description: 'Atomic numbers, periods, groups, electron shells, and metallic reactivity trends.',
    category: 'Chemistry',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#0ea5e9'
  },
  {
    id: 'top-reactions',
    moduleId: 'mod-chemistry',
    moduleTitle: 'Chemistry & Matter',
    title: 'Chemical Reactions & Catalysis',
    nativeTitle: 'रासायनिक अभिक्रियाएं व उत्प्रेरक',
    description: 'Endothermic vs exothermic transformations, conservation of mass, and reaction rates.',
    category: 'Chemistry',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#0ea5e9'
  },

  // Mathematics Topics
  {
    id: 'top-linear-equations',
    moduleId: 'mod-math',
    moduleTitle: 'Mathematics & Logic',
    title: 'Linear Equations & Graphs',
    nativeTitle: 'रैखिक समीकरण और आलेख (y = mx + c)',
    description: 'Single and dual variable equations, slope-intercept forms, and Cartesian coordinates.',
    category: 'Mathematics',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#8b5cf6'
  },
  {
    id: 'top-probability',
    moduleId: 'mod-math',
    moduleTitle: 'Mathematics & Logic',
    title: 'Probability & Statistical Data',
    nativeTitle: 'प्रायिकता और सांख्यिकी (Probability)',
    description: 'Favorable outcomes, sample spaces, mean/median distributions, and combinatorial analysis.',
    category: 'Mathematics',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#8b5cf6'
  },
  {
    id: 'top-trigonometry',
    moduleId: 'mod-math',
    moduleTitle: 'Mathematics & Logic',
    title: 'Trigonometry & Spatial Angles',
    nativeTitle: 'त्रिकोणमिति अनुपात (sin, cos, tan)',
    description: 'Right-angled triangles, Pythagorean theorem, and real-world heights & distances.',
    category: 'Mathematics',
    totalLessons: 3,
    completedLessons: 0,
    progress: 0,
    isCompleted: false,
    completedAt: null,
    accentColor: '#8b5cf6'
  }
];

/**
 * Check if stored state contains invalid, seeded, or unearned completed flags
 * and ensure that topics default strictly to incomplete (isCompleted: false)
 * unless genuine user action or verified quiz mastery occurred.
 */
function sanitizeProgressState(rawState: ProgressState): { state: ProgressState; modified: boolean } {
  const legacyDates = [
    '2026-09-08T18:30:00.000Z',
    '2026-09-08T19:45:00.000Z',
    '2026-09-08T20:10:00.000Z',
    '2026-09-08T20:45:00.000Z',
    '2026-09-08T21:15:00.000Z'
  ];

  let modified = false;
  if (!rawState || !rawState.topics) {
    return { state: { topics: {}, lastUpdated: new Date().toISOString() }, modified: true };
  }

  // Ensure every default topic exists in state with strict defaults
  DEFAULT_TOPICS.forEach(topic => {
    const existing = rawState.topics[topic.id];
    if (!existing) {
      rawState.topics[topic.id] = {
        completedLessons: 0,
        progress: 0,
        isCompleted: false,
        completedAt: null,
        lastAccessedAt: undefined
      };
      modified = true;
    } else if (existing.completedAt && legacyDates.includes(existing.completedAt)) {
      // Purge old hardcoded template mock dates
      rawState.topics[topic.id] = {
        completedLessons: 0,
        progress: 0,
        isCompleted: false,
        completedAt: null,
        lastAccessedAt: undefined
      };
      modified = true;
    }
  });

  return { state: rawState, modified };
}

/**
 * Retrieve raw saved state from localStorage with safe default initialization
 */
function getStoredState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Clean up legacy v1 key if present to eliminate older buggy completions
      try {
        localStorage.removeItem(V1_STORAGE_KEY);
      } catch (e) {}

      // Seed initial clean state with 0% progress and isCompleted: false for all topics
      const initialTopics: Record<string, StoredTopicProgress> = {};
      DEFAULT_TOPICS.forEach(topic => {
        initialTopics[topic.id] = {
          completedLessons: 0,
          progress: 0,
          isCompleted: false,
          completedAt: null,
          lastAccessedAt: undefined
        };
      });
      const initialState: ProgressState = {
        topics: initialTopics,
        lastUpdated: new Date().toISOString()
      };
      saveState(initialState);
      return initialState;
    }

    const parsed: ProgressState = JSON.parse(raw);
    const { state: sanitizedState, modified } = sanitizeProgressState(parsed);
    if (modified) {
      saveState(sanitizedState);
    }
    return sanitizedState;
  } catch (err) {
    console.warn('[ProgressService] Failed to read localStorage:', err);
    return { topics: {}, lastUpdated: new Date().toISOString() };
  }
}

/**
 * Save state to localStorage and emit synchronization event
 */
function saveState(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PROGRESS_UPDATE_EVENT, { detail: state }));
    }
  } catch (err) {
    console.warn('[ProgressService] Failed to write localStorage:', err);
  }
}

/**
 * Synchronize curriculum topic progress strictly with verified user performance.
 * 
 * Rules:
 * 1. Default state is strictly INCOMPLETE (isCompleted: false, progress: 0).
 * 2. Only marks a topic complete if the student scored >= 70% on a quiz targeting that exact topic
 *    or explicitly marked it complete.
 * 3. Does NOT complete topics from loose substring matches or general chat interactions.
 */
export function syncProgressWithUserActivity(): ProgressState {
  const state = getStoredState();
  if (typeof window === 'undefined') return state;

  // 1. Read real user performance data
  let userPerf: Record<string, any> = {};
  try {
    const rawPerf = localStorage.getItem('shikshasathi_user_activity_performance_v2');
    if (rawPerf) {
      userPerf = JSON.parse(rawPerf);
    }
  } catch (e) {
    console.warn('[ProgressService] Error reading performance data:', e);
  }

  // 2. Read explicit user quiz history records
  let historyItems: any[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('shikshasathi_history_')) {
        const rawHist = localStorage.getItem(key);
        if (rawHist) {
          const parsed = JSON.parse(rawHist);
          if (Array.isArray(parsed)) {
            historyItems.push(...parsed);
          }
        }
      }
    }
  } catch (e) {
    console.warn('[ProgressService] Error reading user history:', e);
  }

  let hasChanges = false;

  DEFAULT_TOPICS.forEach(topic => {
    const current = state.topics[topic.id] || {
      completedLessons: 0,
      progress: 0,
      isCompleted: false,
      completedAt: null
    };

    let calculatedProgress = current.progress || 0;
    let calculatedCompleted = current.isCompleted || false;
    let calculatedLessons = current.completedLessons || 0;
    let completedAt = current.completedAt;

    // A. Check verified user quiz performance records strictly by exact topicId
    const perf = userPerf[topic.id];
    if (perf && perf.attempts > 0) {
      const resetTime = current.resetAt ? new Date(current.resetAt).getTime() : 0;
      const attemptTime = perf.lastAttemptAt ? new Date(perf.lastAttemptAt).getTime() : 0;

      // Ignore performance if it occurred prior to or at the reset timestamp
      if (resetTime === 0 || attemptTime > resetTime) {
        const acc = Math.round(perf.accuracy || 0);
        if (acc >= 70) {
          calculatedProgress = 100;
          calculatedCompleted = true;
          calculatedLessons = topic.totalLessons;
          completedAt = perf.lastAttemptAt || completedAt || new Date().toISOString();
        } else if (acc > 0 && !calculatedCompleted) {
          calculatedProgress = Math.max(calculatedProgress, acc);
          calculatedLessons = Math.max(calculatedLessons, Math.round((calculatedProgress / 100) * topic.totalLessons));
        }
      }
    }

    // B. Check verified quiz records in history targeting this specific topic
    const topicQuizHist = historyItems.filter(h => {
      if (!h || h.category !== 'quiz') return false;
      if (current.resetAt && h.createdAt) {
        const resetTime = new Date(current.resetAt).getTime();
        const itemTime = new Date(h.createdAt).getTime();
        if (itemTime <= resetTime) return false;
      }
      const hTopicId = (h.data?.topicId || '').toLowerCase().trim();
      const hTopicTitle = (h.data?.topicTitle || '').toLowerCase().trim();
      return hTopicId === topic.id.toLowerCase() || (hTopicTitle && hTopicTitle === topic.title.toLowerCase());
    });

    if (topicQuizHist.length > 0) {
      const passedQuiz = topicQuizHist.find(h => {
        const acc = h.data?.accuracy ?? (h.data?.totalQuestions ? Math.round((h.data.score / h.data.totalQuestions) * 100) : 0);
        return acc >= 70;
      });

      if (passedQuiz) {
        calculatedProgress = 100;
        calculatedCompleted = true;
        calculatedLessons = topic.totalLessons;
        completedAt = completedAt || passedQuiz.createdAt || new Date().toISOString();
      }
    }

    // Apply updates if values differ
    if (
      calculatedProgress !== current.progress ||
      calculatedCompleted !== current.isCompleted ||
      calculatedLessons !== current.completedLessons ||
      completedAt !== current.completedAt
    ) {
      state.topics[topic.id] = {
        ...current,
        progress: calculatedProgress,
        isCompleted: calculatedCompleted,
        completedLessons: calculatedLessons,
        completedAt,
        lastAccessedAt: new Date().toISOString()
      };
      hasChanges = true;
    }
  });

  if (hasChanges) {
    state.lastUpdated = new Date().toISOString();
    saveState(state);
  }

  return state;
}

/**
 * Get all topics merged with user localStorage progress and performance synchronization
 */
export function getAllTopics(): LearningTopic[] {
  const state = getStoredState();
  return DEFAULT_TOPICS.map(def => {
    const saved = state.topics[def.id];
    if (saved) {
      return {
        ...def,
        completedLessons: saved.completedLessons,
        progress: saved.progress,
        isCompleted: saved.isCompleted,
        completedAt: saved.completedAt,
        lastAccessedAt: saved.lastAccessedAt
      };
    }
    return def;
  });
}

/**
 * Get only completed topics
 */
export function getCompletedTopics(): LearningTopic[] {
  return getAllTopics().filter(t => t.isCompleted);
}

/**
 * Get topic by ID with user progress merged
 */
export function getTopicById(topicId: string): LearningTopic | undefined {
  return getAllTopics().find(t => t.id === topicId);
}

/**
 * Set explicit topic progress percentage and completion
 */
export function updateTopicProgress(
  topicId: string, 
  progressPercent: number, 
  isCompleted?: boolean
): LearningTopic | null {
  const state = getStoredState();
  const def = DEFAULT_TOPICS.find(t => t.id === topicId);
  if (!def) return null;

  const boundedProgress = Math.max(0, Math.min(100, Math.round(progressPercent)));
  const completed = isCompleted !== undefined ? isCompleted : boundedProgress >= 100;
  const completedLessons = Math.round((boundedProgress / 100) * def.totalLessons);

  state.topics[topicId] = {
    completedLessons,
    progress: boundedProgress,
    isCompleted: completed,
    completedAt: completed ? (state.topics[topicId]?.completedAt || new Date().toISOString()) : null,
    lastAccessedAt: new Date().toISOString()
  };
  state.lastUpdated = new Date().toISOString();

  saveState(state);
  return getTopicById(topicId) || null;
}

/**
 * Explicitly mark a topic as completed (100% progress and isCompleted: true)
 */
export function markTopicAsCompleted(topicId: string): LearningTopic | null {
  return updateTopicProgress(topicId, 100, true);
}

/**
 * Explicitly mark a topic as incomplete (0% progress and isCompleted: false)
 */
export function markTopicAsIncomplete(topicId: string): LearningTopic | null {
  return updateTopicProgress(topicId, 0, false);
}

/**
 * Toggle topic completion state between 100% completed and 0% incomplete
 */
export function toggleTopicCompleted(topicId: string): LearningTopic | null {
  const current = getTopicById(topicId);
  if (!current) return null;

  if (current.isCompleted) {
    // Reset to 0%
    return updateTopicProgress(topicId, 0, false);
  } else {
    // Complete 100%
    return updateTopicProgress(topicId, 100, true);
  }
}

/**
 * Reset a single topic's curriculum progress completely to 0%
 */
export function resetSingleTopicProgress(topicId: string): LearningTopic | null {
  const state = getStoredState();
  const resetTimestamp = new Date().toISOString();
  if (state.topics[topicId]) {
    state.topics[topicId] = {
      completedLessons: 0,
      progress: 0,
      isCompleted: false,
      completedAt: null,
      lastAccessedAt: resetTimestamp,
      resetAt: resetTimestamp
    };
    state.lastUpdated = resetTimestamp;
    saveState(state);
  }
  return updateTopicProgress(topicId, 0, false);
}

/**
 * Advance one lesson step in a topic
 */
export function advanceTopicLesson(topicId: string): LearningTopic | null {
  const current = getTopicById(topicId);
  if (!current) return null;

  const nextLessons = Math.min(current.totalLessons, current.completedLessons + 1);
  const newProgress = Math.round((nextLessons / current.totalLessons) * 100);
  const isDone = nextLessons >= current.totalLessons;

  return updateTopicProgress(topicId, newProgress, isDone);
}

/**
 * Automatically record topic progress or completion by query/keyword (e.g. from Quiz or Study Tools)
 * - If accuracy is provided (from Quiz):
 *   - If accuracy >= 70%: marks the topic 100% complete
 *   - If accuracy < 70%: updates topic progress to match accuracy score (in-progress)
 * - If accuracy is omitted (from interactive chat/doubt solving):
 *   - Advances lesson by 1 step (e.g. +33%)
 */
export function matchAndCompleteTopic(searchQuery: string, accuracy?: number): LearningTopic | null {
  const q = searchQuery.toLowerCase().trim();
  if (!q) return null;

  const all = getAllTopics();
  const match = all.find(t => 
    t.title.toLowerCase().includes(q) || 
    t.nativeTitle.toLowerCase().includes(q) || 
    q.includes(t.title.toLowerCase()) ||
    t.id.toLowerCase().includes(q)
  );

  if (match) {
    if (accuracy !== undefined) {
      const isDone = accuracy >= 70;
      const progress = isDone ? 100 : Math.max(25, accuracy);
      return updateTopicProgress(match.id, progress, isDone);
    } else {
      // Advance by 1 step for interactive doubt/study sessions
      return advanceTopicLesson(match.id);
    }
  }
  return null;
}

/**
 * Reset all progress to clean 0% state
 */
export function resetAllProgress(): void {
  try {
    const resetTimestamp = new Date().toISOString();
    const cleanTopics: Record<string, StoredTopicProgress> = {};
    DEFAULT_TOPICS.forEach(topic => {
      cleanTopics[topic.id] = {
        completedLessons: 0,
        progress: 0,
        isCompleted: false,
        completedAt: null,
        lastAccessedAt: resetTimestamp,
        resetAt: resetTimestamp
      };
    });

    const cleanState: ProgressState = {
      topics: cleanTopics,
      lastUpdated: resetTimestamp
    };

    saveState(cleanState);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(PROGRESS_UPDATE_EVENT, { detail: cleanState }));
    }
  } catch (err) {
    console.warn('[ProgressService] Error resetting progress:', err);
  }
}

/**
 * Overall user study statistics dynamically synchronized with performance & history
 */
export function getOverallProgressStats(): {
  totalTopics: number;
  completedTopicsCount: number;
  inProgressTopicsCount: number;
  notStartedTopicsCount: number;
  overallPercentage: number;
  masteryScore: number;
} {
  // Synchronize progress with the user's latest performance data and history records
  syncProgressWithUserActivity();

  const topics = getAllTopics();
  const total = topics.length;
  const completed = topics.filter(t => t.isCompleted).length;
  const inProgress = topics.filter(t => !t.isCompleted && t.progress > 0).length;
  const notStarted = topics.filter(t => t.progress === 0).length;
  
  const sumPercentage = topics.reduce((acc, t) => acc + t.progress, 0);
  const overallPercentage = total > 0 ? Math.round(sumPercentage / total) : 0;

  // Calculate real student accuracy / mastery score from performance records
  let masteryScore = 0;
  try {
    const rawPerf = typeof window !== 'undefined' ? localStorage.getItem('shikshasathi_user_activity_performance_v2') : null;
    if (rawPerf) {
      const perf = JSON.parse(rawPerf);
      const attempted = (Object.values(perf) as any[]).filter((p: any) => p && p.attempts > 0);
      if (attempted.length > 0) {
        const totalAccuracy = attempted.reduce((acc: number, p: any) => acc + Number(p.accuracy || 0), 0);
        masteryScore = Math.round(totalAccuracy / attempted.length);
      }
    }
  } catch (e) {}

  return {
    totalTopics: total,
    completedTopicsCount: completed,
    inProgressTopicsCount: inProgress,
    notStartedTopicsCount: notStarted,
    overallPercentage,
    masteryScore
  };
}
