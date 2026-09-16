/**
 * ShikshaSathi Dynamic Adaptive Mastery Analysis Service
 * 
 * Strictly user-activity-driven mastery analysis engine.
 * Calculates scores, attempt counts, accuracy, mistakes, and recommendations
 * dynamically based on real student quiz and learning interactions.
 * 
 * DOES NOT use static, random, or hardcoded scores.
 * All metrics start at 0 and update live as the student takes tests.
 */

import { getAllTopics, LearningTopic, resetAllProgress, PROGRESS_UPDATE_EVENT } from './progressService';
import { clearUserHistory, CURRENT_USER_ID } from './historyService';

export type MasteryLevel = 'mastered' | 'progressing' | 'needs_improvement' | 'unattempted';

export interface PerformanceRecord {
  topicId: string;
  topicTitle?: string;
  attempts: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // 0 - 100%
  mistakes: string[];
  recentScore: number; // 0 - 100%
  timeSpentMinutes: number;
  lastAttemptAt: string;
}

export interface DynamicTopicInsight {
  topicId: string;
  title: string;
  nativeTitle: string;
  category: 'Physics' | 'Biology' | 'Chemistry' | 'Mathematics' | 'General';
  masteryLevel: MasteryLevel;
  accuracy: number;
  attempts: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentMinutes: number;
  mistakesCount: number;
  // Dynamic Localized Insights
  whatDidWell: string;
  whereStruggled: string;
  recommendedAction: {
    type: 'review' | 'practice' | 'advanced';
    label: string;
    description: string;
    promptQuery: string;
  };
}

export interface OverallMasterySummary {
  overallScore: number;
  totalAttempts: number;
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  totalTopicsAnalyzed: number;
  masteredCount: number;
  progressingCount: number;
  needsImprovementCount: number;
  unattemptedCount: number;
  topStrength: string;
  criticalFocusArea: string;
  summaryText: string;
}

export const PERFORMANCE_STORAGE_KEY = 'shikshasathi_user_activity_performance_v2';
export const LEGACY_STORAGE_KEY = 'shikshasathi_user_performance_v1';
export const MASTERY_UPDATE_EVENT = 'shikshasathi-mastery-updated';

/**
 * Migration & cleanup: Ensure no old static dummy data (26 attempts) persists.
 */
function cleanLegacyDummyData(): void {
  try {
    if (typeof window === 'undefined') return;
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      // If legacy data has 26 attempts matching the old mock default, remove it
      const attempts = Object.values(parsed || {}).reduce((s: number, p: any) => s + (p?.attempts || 0), 0);
      if (attempts === 26 || parsed['top-photosynthesis']?.attempts === 4) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Get stored user performance strictly from real student activity.
 * Returns empty object if no activities have occurred yet.
 */
export function getUserPerformanceData(): Record<string, PerformanceRecord> {
  try {
    if (typeof window === 'undefined') return {};
    cleanLegacyDummyData();

    const raw = localStorage.getItem(PERFORMANCE_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.warn('[MasteryService] Error reading performance data:', err);
    return {};
  }
}

/**
 * Reset student activity performance data to 0 (clean state)
 */
export function clearUserPerformance(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify({}));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(MASTERY_UPDATE_EVENT, { detail: {} }));
    }
  } catch (err) {
    console.warn('[MasteryService] Error clearing performance:', err);
  }
}

/**
 * Completely resets and clears all user activity data, including:
 * 1. Performance records (scores, attempts, questions, correct answers, accuracy, mistakes)
 * 2. Activity history (all quiz history in localStorage and server-side)
 * 3. Curriculum progress (all lesson completions, progress percentages)
 * 4. Dispatches all sync events to trigger immediate UI re-rendering.
 */
export async function resetAllUserActivityAndMastery(): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      // 1. Clear performance in localStorage
      localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify({}));
      localStorage.removeItem(LEGACY_STORAGE_KEY);

      // Clean all localStorage keys related to performance, quiz attempts, or history
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('shikshasathi_history_') ||
          key.startsWith('shikshasathi_user_activity_performance') ||
          key.startsWith('shikshasathi_user_performance') ||
          key.includes('quiz_attempt') ||
          key === 'shikshasathi_learning_progress_v1'
        )) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      // 2. Clear server and local history records
      try {
        await clearUserHistory(CURRENT_USER_ID);
      } catch (err) {
        console.warn('[MasteryService] Error clearing user history:', err);
      }

      // 3. Reset curriculum progress
      resetAllProgress();

      // 4. Dispatch events for immediate UI update
      window.dispatchEvent(new CustomEvent(MASTERY_UPDATE_EVENT, { detail: {} }));
      window.dispatchEvent(new CustomEvent(PROGRESS_UPDATE_EVENT, { detail: {} }));
      window.dispatchEvent(new CustomEvent('app:history_cleared', { detail: { userId: CURRENT_USER_ID } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (err) {
    console.warn('[MasteryService] Error in resetAllUserActivityAndMastery:', err);
  }
}

/**
 * Reset a single topic's performance back to clean state (0 attempts, 0% accuracy, clean mistakes)
 */
export function resetSingleTopicPerformance(topicId: string): void {
  try {
    const current = getUserPerformanceData();
    if (current[topicId]) {
      delete current[topicId];
    }
    // Also check if any key matches topicId loosely
    const normalizedKey = topicId.toLowerCase().trim();
    Object.keys(current).forEach(k => {
      if (k.toLowerCase().trim() === normalizedKey) {
        delete current[k];
      }
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(MASTERY_UPDATE_EVENT, { detail: current }));
    }
  } catch (err) {
    console.warn('[MasteryService] Error resetting topic performance:', err);
  }
}

/**
 * Record performance dynamically when a student completes a quiz or test.
 * Updates attempt counts, accuracy, and logged mistakes in real-time.
 */
export function recordTopicPerformance(
  topicId: string,
  totalQuestions: number,
  correctAnswers: number,
  newMistakes: string[] = [],
  timeMinutes: number = 5,
  customTopicTitle?: string
): PerformanceRecord {
  const current = getUserPerformanceData();
  const existing = current[topicId] || {
    topicId,
    topicTitle: customTopicTitle,
    attempts: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    mistakes: [],
    recentScore: 0,
    timeSpentMinutes: 0,
    lastAttemptAt: new Date().toISOString()
  };

  const updatedAttempts = existing.attempts + 1;
  const updatedTotalQ = existing.totalQuestions + totalQuestions;
  const updatedCorrect = existing.correctAnswers + correctAnswers;
  const accuracy = updatedTotalQ > 0 ? Math.round((updatedCorrect / updatedTotalQ) * 100) : 0;
  const recentScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Combine unique mistakes, capped at recent 6
  const combinedMistakes = Array.from(
    new Set([...newMistakes, ...existing.mistakes])
  ).slice(0, 6);

  const record: PerformanceRecord = {
    topicId,
    topicTitle: customTopicTitle || existing.topicTitle,
    attempts: updatedAttempts,
    totalQuestions: updatedTotalQ,
    correctAnswers: updatedCorrect,
    accuracy,
    mistakes: combinedMistakes,
    recentScore,
    timeSpentMinutes: existing.timeSpentMinutes + timeMinutes,
    lastAttemptAt: new Date().toISOString()
  };

  current[topicId] = record;

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERFORMANCE_STORAGE_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(MASTERY_UPDATE_EVENT, { detail: current }));
    }
  } catch (e) {
    console.warn('[MasteryService] Save performance failed:', e);
  }

  return record;
}

/**
 * Mastery Calculation: dynamically categorizes by student's real performance
 */
export function computeMasteryLevel(accuracy: number, attempts: number): MasteryLevel {
  if (attempts === 0) return 'unattempted';
  if (accuracy >= 80) return 'mastered';
  if (accuracy >= 50) return 'progressing';
  return 'needs_improvement';
}

/**
 * Localized Strings & UI labels for Adaptive Mastery
 */
export function getLocalizedMasteryContent(langId: string = 'hi-bhojpuri') {
  const norm = (langId || '').toLowerCase();
  const isHindi = norm.startsWith('hi');
  const isBengali = norm.startsWith('bn');
  const isMarathi = norm.startsWith('mr');
  const isTamil = norm.startsWith('ta');
  const isTelugu = norm.startsWith('te');
  const isGujarati = norm.startsWith('gu');
  const isSpanish = norm.startsWith('es');

  if (isHindi) {
    return {
      headerTitle: 'आपकी वास्तविक विषय दक्षता समीक्षा (Mastery Overview)',
      headerSubtitle: 'आपके द्वारा दिए गए क्विज़, हल किए गए प्रश्नों और वास्तविक गलतियों पर आधारित लाइव स्कोर',
      overallScoreLabel: 'कुल दक्षता स्कोर',
      activeTopicsLabel: 'परखे गए विषय',
      masteredTag: 'सिद्ध (Mastered)',
      progressingTag: 'प्रगति पर (Progressing)',
      needsImprovementTag: 'सुधार आवश्यक (Needs Help)',
      unattemptedTag: 'अमूल्यांकित (Pending)',
      accuracyLabel: 'सटीकता (Accuracy)',
      attemptsLabel: 'प्रयास (Attempts)',
      mistakesLabel: 'पहचानी गई गलतियाँ',
      whatDidWellLabel: 'आपकी मजबूती (Strengths)',
      whereStruggledLabel: 'जहाँ समस्या हुई (Areas to Improve)',
      recommendedActionLabel: 'अगला सुझाई गई कार्रवाई',
      actionReviewBtn: 'वॉइस AI से समझें',
      actionPracticeBtn: 'क्विज़ शुरू करें',
      actionAdvancedBtn: 'कठिन स्तर शुरू करें',
      actionResetBtn: 'रीसेट करें (Reset)',
      resetConfirmTopic: (topicTitle: string) => `क्या आप "${topicTitle}" की प्रगति और स्कोर को रीसेट करके नया (0) करना चाहते हैं?`,
      resetAllModalTitle: 'सभी दक्षता व प्रगति रीसेट करें?',
      resetAllModalDesc: 'यह सभी क्विज़ स्कोर, सटीकता के आंकड़े, दर्ज की गई गलतियाँ और विषय की प्रगति को पूरी तरह 0 पर रीसेट कर देगा।',
      resetTopicModalTitle: (title: string) => `"${title}" को रीसेट करें?`,
      resetTopicModalDesc: 'इस विषय के सभी टेस्ट प्रयास, सटीकता और पाठ प्रगति को शून्य (0%) पर रीसेट कर दिया जाएगा।',
      confirmResetBtn: 'हाँ, रीसेट करें',
      cancelBtn: 'रद्द करें',
      resetSuccessToast: 'दक्षता स्कोर और प्रगति को सफलतापूर्वक रीसेट कर दिया गया है।',
      filters: {
        all: 'सभी विषय',
        mastered: 'सिद्ध (Mastered)',
        progressing: 'प्रगतिशील (Progressing)',
        needsImprovement: 'सुधार योग्य (Needs Help)',
        unattempted: 'अमूल्यांकित (Pending)'
      },
      emptyStateTitle: 'अभी तक कोई टेस्ट नहीं दिया गया',
      emptyStateDesc: 'आपका स्कोर और प्रयास आपकी वास्तविक गतिविधि के अनुसार अपडेट होंगे। किसी भी विषय पर "क्विज़ शुरू करें" दबाएं और तुरंत अपना लाइव स्कोर देखें।',
      summaryTemplate: (overall: number, attempts: number, mastered: number, prog: number, needs: number, totalQ: number, correctQ: number) => {
        if (attempts === 0) {
          return 'अभी तक आपने कोई क्विज़ पूरा नहीं किया है। अपना लाइव स्कोर, वास्तविक प्रयास और गलतियों का विश्लेषण देखने के लिए नीचे दिए गए किसी भी विषय पर क्विज़ शुरू करें।';
        }
        return `आपने कुल ${attempts} क्विज़ प्रयास पूरे किए हैं, जिसमें आपकी औसत सटीकता ${overall}% (${correctQ}/${totalQ} सही) है। ${mastered} विषय सिद्ध, ${prog} प्रगति पर हैं, और ${needs} विषयों में अभ्यास आवश्यक है।`;
      }
    };
  }

  if (isBengali) {
    return {
      headerTitle: 'আপনার বাস্তব দক্ষতা পর্যালোচনা (Mastery Overview)',
      headerSubtitle: 'আপনার কুইজ স্কোর, প্রচেষ্টা এবং বাস্তব ভুল উত্তরের উপর ভিত্তি করে লাইভ বিশ্লেষণ',
      overallScoreLabel: 'সামগ্রিক দক্ষতা স্কোর',
      activeTopicsLabel: 'পরীক্ষিত বিষয়',
      masteredTag: 'মাস্টার্ড (Mastered)',
      progressingTag: 'অগ্রগতি হচ্ছে (Progressing)',
      needsImprovementTag: 'উন্নতি প্রয়োজন (Needs Help)',
      unattemptedTag: 'বাকি আছে (Pending)',
      accuracyLabel: 'সঠিকতা (Accuracy)',
      attemptsLabel: 'চেষ্টা (Attempts)',
      mistakesLabel: 'চিহ্নিত ভুলসমূহ',
      whatDidWellLabel: 'আপনার শক্তি (Strengths)',
      whereStruggledLabel: 'যেখানে উন্নতি প্রয়োজন',
      recommendedActionLabel: 'পরবর্তী পদক্ষেপ',
      actionReviewBtn: 'ভয়েস AI-এর সাথে বুঝুন',
      actionPracticeBtn: 'কুইজ শুরু করুন',
      actionAdvancedBtn: 'উন্নত পর্যায় শুরু',
      actionResetBtn: 'রিসেট করুন (Reset)',
      resetConfirmTopic: (topicTitle: string) => `আপনি কি "${topicTitle}" এর অগ্রগতি ও স্কোর রিসেট করে নতুন করতে চান?`,
      resetAllModalTitle: 'সব বিষয়ের দক্ষতা ও অগ্রগতি রিসেট করবেন?',
      resetAllModalDesc: 'এটি আপনার সমস্ত কুইজ স্কোর, নির্ভুলতার পরিসংখ্যান, চিহ্নিত ভুল এবং বিষয়ের অগ্রগতি সম্পূর্ণভাবে 0 এ রিসেট করবে।',
      resetTopicModalTitle: (title: string) => `"${title}" রিসেট করবেন?`,
      resetTopicModalDesc: 'এই বিষয়ের সমস্ত কুইজের প্রচেষ্টা, নির্ভুলতা এবং পাঠের অগ্রগতি শূন্য (০%) এ রিসেট করা হবে।',
      confirmResetBtn: 'হ্যাঁ, রিসেট করুন',
      cancelBtn: 'বাতিল করুন',
      resetSuccessToast: 'দক্ষতার স্কোর ও অগ্রগতি সফলভাবে রিসেট করা হয়েছে।',
      filters: {
        all: 'সমস্ত বিষয়',
        mastered: 'মাস্টার্ড',
        progressing: 'অগ্রগতিশীল',
        needsImprovement: 'উন্নতি প্রয়োজন',
        unattempted: 'বাকি আছে'
      },
      emptyStateTitle: 'এখনও কোনো কুইজ নেওয়া হয়নি',
      emptyStateDesc: 'আপনার স্কোর এবং চেষ্টা আপনার বাস্তব ক্রিয়াকলাপের ভিত্তিতে আপডেট হবে। লাইভ স্কোর দেখতে যেকোনো বিষয়ে কুইজ শুরু করুন।',
      summaryTemplate: (overall: number, attempts: number, mastered: number, prog: number, needs: number, totalQ: number, correctQ: number) => {
        if (attempts === 0) {
          return 'এখনও পর্যন্ত আপনি কোনো কুইজ সম্পন্ন করেননি। আপনার লাইভ স্কোর দেখতে নিচের যেকোনো বিষয়ে কুইজ শুরু করুন।';
        }
        return `আপনি মোট ${attempts}টি প্রচেষ্টা সম্পন্ন করেছেন। আপনার সামগ্রিক নির্ভুলতা ${overall}% (${correctQ}/${totalQ} সঠিক)। ${mastered}টি বিষয় আয়ত্তে এসেছে, ${prog}টি অগ্রগতিতে রয়েছে।`;
      }
    };
  }

  if (isMarathi) {
    return {
      headerTitle: 'तुमचे प्रत्यक्ष विषय प्रभुत्व पुनरावलोकन (Mastery Overview)',
      headerSubtitle: 'तुमच्या सोडवलेल्या चाचण्या, अचूकता आणि प्रत्यक्ष चुकांवर आधारित लाइव्ह डॅशबोर्ड',
      overallScoreLabel: 'एकूण प्रभुत्व गुण',
      activeTopicsLabel: 'तपासलेले विषय',
      masteredTag: 'प्रवीण (Mastered)',
      progressingTag: 'प्रगतीपथावर (Progressing)',
      needsImprovementTag: 'सुधारणा आवश्यक (Needs Help)',
      unattemptedTag: 'बाकी (Pending)',
      accuracyLabel: 'अचूकता (Accuracy)',
      attemptsLabel: 'प्रयत्न (Attempts)',
      mistakesLabel: 'झालेल्या चुका',
      whatDidWellLabel: 'तुमची ताकद (Strengths)',
      whereStruggledLabel: 'येथे सुधारणा हवी',
      recommendedActionLabel: 'पुढील कृती',
      actionReviewBtn: 'व्हॉइस AI सह समजून घ्या',
      actionPracticeBtn: 'चाचणी सुरू करा',
      actionAdvancedBtn: 'कठीण पातळी',
      actionResetBtn: 'रीसेट करा (Reset)',
      resetConfirmTopic: (topicTitle: string) => `तुम्हाला "${topicTitle}" ची प्रगती आणि गुण रीसेट करून नव्याने सुरू करायचे आहेत का?`,
      resetAllModalTitle: 'सर्व विषयांचे प्रभुत्व आणि प्रगती रीसेट करायची?',
      resetAllModalDesc: 'हे सर्व चाचणी गुण, अचूकतेची आकडेवारी, झालेल्या चुका आणि विषयांची प्रगती पूर्णपणे शून्य (0) वर रीसेट करेल.',
      resetTopicModalTitle: (title: string) => `"${title}" रीसेट करायचे?`,
      resetTopicModalDesc: 'या विषयाचे सर्व चाचणी प्रयत्न, अचूकता आणि अभ्यासक्रम प्रगती 0% वर रीसेट केली जाईल.',
      confirmResetBtn: 'होय, रीसेट करा',
      cancelBtn: 'रद्द करा',
      resetSuccessToast: 'प्रभुत्व गुण आणि प्रगती यशस्वीरीत्या रीसेट करण्यात आली आहे.',
      filters: {
        all: 'सर्व विषय',
        mastered: 'प्रवीण (Mastered)',
        progressing: 'प्रगतीपथावर',
        needsImprovement: 'सुधारणा आवश्यक',
        unattempted: 'बाकी'
      },
      emptyStateTitle: 'अद्याप कोणतीही चाचणी दिली नाही',
      emptyStateDesc: 'तुमचे गुण आणि प्रयत्न तुमच्या खऱ्या कृतींवर आधारित लाइव्ह अपडेट होतील. चाचणी देऊन त्वरित तुमचे गुण पहा.',
      summaryTemplate: (overall: number, attempts: number, mastered: number, prog: number, needs: number, totalQ: number, correctQ: number) => {
        if (attempts === 0) {
          return 'तुम्ही अद्याप कोणतीही चाचणी सोडवलेली नाही. थेट प्रभुत्व गुण आणि चुकांचे विश्लेषण पाहण्यासाठी खालील विषयावर चाचणी सुरू करा.';
        }
        return `तुम्ही एकूण ${attempts} चाचणी प्रयत्न पूर्ण केले आहेत. तुमची सरासरी अचूकता ${overall}% (${correctQ}/${totalQ} बरोबर) आहे. ${mastered} विषय प्रवीण आहेत.`;
      }
    };
  }

  if (isTamil) {
    return {
      headerTitle: 'உங்கள் நேரடி பாட தேர்ச்சி மேலோட்டம் (Mastery Overview)',
      headerSubtitle: 'உங்கள் வினாடி வினா மதிப்பெண்கள், முயற்சிகள் மற்றும் தவறுகளின் அடிப்படையில் நேரடி பகுப்பாய்வு',
      overallScoreLabel: 'ஒட்டுமொத்த தேர்ச்சி மதிப்பெண்',
      activeTopicsLabel: 'சோதிக்கப்பட்ட தலைப்புகள்',
      masteredTag: 'தேர்ச்சி பெற்றது (Mastered)',
      progressingTag: 'முன்னேறுகிறது (Progressing)',
      needsImprovementTag: 'உதவி தேவை (Needs Help)',
      unattemptedTag: 'நிலுவையில் (Pending)',
      accuracyLabel: 'துல்லியம் (Accuracy)',
      attemptsLabel: 'முயற்சிகள் (Attempts)',
      mistakesLabel: 'கண்டறியப்பட்ட தவறுகள்',
      whatDidWellLabel: 'உங்கள் பலம் (Strengths)',
      whereStruggledLabel: 'முன்னேற்றத்திற்கான பகுதிகள்',
      recommendedActionLabel: 'பரிந்துரைக்கப்பட்ட அடுத்த படி',
      actionReviewBtn: 'குரல் AI உடன் புரிந்துகொள்ளுங்கள்',
      actionPracticeBtn: 'வினாடி வினா தொடங்கு',
      actionAdvancedBtn: 'கடின நிலை தொடங்கு',
      actionResetBtn: 'மீட்டமை (Reset)',
      resetConfirmTopic: (topicTitle: string) => `"${topicTitle}" முன்னேற்றம் மற்றும் மதிப்பெண்ணை மீட்டமைக்க விரும்புகிறீர்களா?`,
      resetAllModalTitle: 'அனைத்து தேர்ச்சி மற்றும் முன்னேற்றத்தை மீட்டமைக்கவா?',
      resetAllModalDesc: 'இது உங்கள் அனைத்து வினாடி வினா மதிப்பெண்கள், துல்லிய புள்ளிவிவரங்கள் மற்றும் தவறுகளை 0 க்கு மீட்டமைக்கும்.',
      resetTopicModalTitle: (title: string) => `"${title}" மீட்டமைக்கவா?`,
      resetTopicModalDesc: 'இந்த தலைப்பின் அனைத்து வினாடி வினா முயற்சிகள் மற்றும் பாட முன்னேற்றம் 0% ஆக மீட்டமைக்கப்படும்.',
      confirmResetBtn: 'ஆம், மீட்டமை',
      cancelBtn: 'ரத்து செய்',
      resetSuccessToast: 'தேர்ச்சி மதிப்பெண்களும் முன்னேற்றமும் வெற்றிகரமாக மீட்டமைக்கப்பட்டது.',
      filters: {
        all: 'அனைத்து தலைப்புகள்',
        mastered: 'தேர்ச்சி பெற்றது',
        progressing: 'முன்னேறுகிறது',
        needsImprovement: 'உதவி தேவை',
        unattempted: 'நிலுவையில்'
      },
      emptyStateTitle: 'இன்னும் எந்த தேர்வும் எடுக்கப்படவில்லை',
      emptyStateDesc: 'உங்கள் உண்மையான செயல்பாட்டின் அடிப்படையில் உங்கள் மதிப்பெண் புதுப்பிக்கப்படும். நேரடி மதிப்பெண்ணைக் காண கீழே உள்ள ஏதேனும் தலைப்பில் வினாடி வினாவைத் தொடங்கவும்.',
      summaryTemplate: (overall: number, attempts: number, mastered: number, prog: number, needs: number, totalQ: number, correctQ: number) => {
        if (attempts === 0) {
          return 'நீங்கள் இன்னும் எந்த வினாடி வினாவையும் முடிக்கவில்லை. நேரடி மதிப்பெண் மற்றும் தவறுகளைக் காண கீழே உள்ள தலைப்பில் வினாடி வினாவைத் தொடங்குங்கள்.';
        }
        return `நீங்கள் மொத்தம் ${attempts} முயற்சிகளை முடித்துள்ளீர்கள். உங்கள் ஒட்டுமொத்த துல்லியம் ${overall}% (${correctQ}/${totalQ} சரி). ${mastered} தலைப்புகளில் தேர்ச்சி பெற்றுள்ளீர்கள்.`;
      }
    };
  }

  if (isTelugu) {
    return {
      headerTitle: 'మీ ప్రత్యక్ష నైపుణ్య సమీక్ష (Mastery Overview)',
      headerSubtitle: 'మీరు పూర్తి చేసిన క్విజ్‌లు, ఖచ్చితత్వం మరియు ప్రత్యక్ష తప్పుల ఆధారంగా లైవ్ స్కోర్',
      overallScoreLabel: 'మొత్తం నైపుణ్య స్కోరు',
      activeTopicsLabel: 'పరీక్షించిన అంశాలు',
      masteredTag: 'నైపుణ్యం సాధించారు (Mastered)',
      progressingTag: 'పురోగతిలో ఉంది (Progressing)',
      needsImprovementTag: 'సహాయం కావాలి (Needs Help)',
      unattemptedTag: 'పెండింగ్ (Pending)',
      accuracyLabel: 'ఖచ్చితత్వం (Accuracy)',
      attemptsLabel: 'ప్రయత్నాలు (Attempts)',
      mistakesLabel: 'గుర్తించిన తప్పులు',
      whatDidWellLabel: 'మీ బలాలు (Strengths)',
      whereStruggledLabel: 'మెరుగుపరచుకోవాల్సిన రంగాలు',
      recommendedActionLabel: 'సిఫార్సు చేసిన తదుపరి చర్య',
      actionReviewBtn: 'వాయిస్ AI తో అర్థం చేసుకోండి',
      actionPracticeBtn: 'క్విజ్ ప్రారంభించండి',
      actionAdvancedBtn: 'కఠిన స్థాయి ప్రారంభించండి',
      actionResetBtn: 'రీసెట్ చేయండి (Reset)',
      resetConfirmTopic: (topicTitle: string) => `"${topicTitle}" పురోగతి మరియు స్కోరును రీసెట్ చేసి కొత్తగా ప్రారంభించాలనుకుంటున్నారా?`,
      resetAllModalTitle: 'అన్ని నైపుణ్యాలు & పురోగతిని రీసెట్ చేయాలా?',
      resetAllModalDesc: 'ఇది అన్ని క్విజ్ స్కోర్‌లు, ఖచ్చితత్వ గణాంకాలు మరియు రికార్డ్ చేసిన తప్పులను పూర్తిగా 0కి రీసెట్ చేస్తుంది.',
      resetTopicModalTitle: (title: string) => `"${title}" ని రీసెట్ చేయాలా?`,
      resetTopicModalDesc: 'ఈ అంశం యొక్క అన్ని టెస్ట్ ప్రయత్నాలు, ఖచ్చితత్వం మరియు పాఠ్యాంశ పురోగతి 0%కి రీసెట్ చేయబడతాయి.',
      confirmResetBtn: 'అవును, రీసెట్ చేయండి',
      cancelBtn: 'రద్దు చేయండి',
      resetSuccessToast: 'నైపుణ్య స్కోరు మరియు పురోగతి విజయవంతంగా రీసెట్ చేయబడింది.',
      filters: {
        all: 'అన్ని అంశాలు',
        mastered: 'నైపుణ్యం సాధించారు',
        progressing: 'పురోగతిలో ఉంది',
        needsImprovement: 'సహాయం కావాలి',
        unattempted: 'పెండింగ్'
      },
      emptyStateTitle: 'ఇంకా ఎలాంటి పరీక్షలు రాయలేదు',
      emptyStateDesc: 'మీ నిజమైన అభ్యాసం ఆధారంగా మీ స్కోరు అప్‌డేట్ అవుతుంది. లైవ్ స్కోర్ చూడటానికి కింద ఉన్న ఏదైనా అంశంపై క్విజ్ ప్రారంభించండి.',
      summaryTemplate: (overall: number, attempts: number, mastered: number, prog: number, needs: number, totalQ: number, correctQ: number) => {
        if (attempts === 0) {
          return 'మీరు ఇంకా ఏ క్విజ్‌ను పూర్తి చేయలేదు. లైవ్ ఖచ్చితత్వం మరియు తప్పుల విశ్లేషణను చూడటానికి దిగువన ఏదైనా అంశంపై క్విజ్ ప్రారంభించండి.';
        }
        return `మీరు మొత్తం ${attempts} ప్రయత్నాలను పూర్తి చేశారు, మీ సగటు ఖచ్చితత్వం ${overall}% (${correctQ}/${totalQ} సరైనవి). ${mastered} అంశాలలో నైపుణ్యం సాధించారు.`;
      }
    };
  }

  if (isGujarati) {
    return {
      headerTitle: 'તમારી વાસ્તવિક વિષય નિપુણતા સમીક્ષા (Mastery Overview)',
      headerSubtitle: 'તમારી ક્વિઝ, સચોટતા અને વાસ્તવિક ભૂલો પર આધારિત લાઈવ ડેશબોર્ડ',
      overallScoreLabel: 'કુલ નિપુણતા સ્કોર',
      activeTopicsLabel: 'તપાસેલા વિષયો',
      masteredTag: 'નિપુણ (Mastered)',
      progressingTag: 'પ્રગતિમાં (Progressing)',
      needsImprovementTag: 'સુધારણા જરૂરી (Needs Help)',
      unattemptedTag: 'બાકી (Pending)',
      accuracyLabel: 'સચોટતા (Accuracy)',
      attemptsLabel: 'પ્રયાસો (Attempts)',
      mistakesLabel: 'ઓળખાયેલી ભૂલો',
      whatDidWellLabel: 'તમારી શક્તિઓ (Strengths)',
      whereStruggledLabel: 'જ્યાં સુધારો જરૂરી છે',
      recommendedActionLabel: 'ભલામણ કરેલ આગલું પગલું',
      actionReviewBtn: 'વોઇસ AI સાથે સમજો',
      actionPracticeBtn: 'ક્વિઝ શરૂ કરો',
      actionAdvancedBtn: 'અઘરું સ્તર શરૂ કરો',
      actionResetBtn: 'રીસેટ કરો (Reset)',
      resetConfirmTopic: (topicTitle: string) => `શું તમે "${topicTitle}" ની પ્રગતિ અને સ્કોર રીસેટ કરવા માંગો છો?`,
      resetAllModalTitle: 'બધી નિપુણતા અને પ્રગતિ રીસેટ કરવી?',
      resetAllModalDesc: 'આ બધા ક્વિઝ સ્કોર, સચોટતાના આંકડા અને ભૂલોને સંપૂર્ણપણે 0 પર રીસેટ કરશે.',
      resetTopicModalTitle: (title: string) => `"${title}" રીસેટ કરવું?`,
      resetTopicModalDesc: 'આ વિષયના તમામ પ્રયાસો, સચોટતા અને પાઠ પ્રગતિ 0% પર રીસેટ કરવામાં આવશે.',
      confirmResetBtn: 'હા, રીસેટ કરો',
      cancelBtn: 'રદ કરો',
      resetSuccessToast: 'નિપુણતા સ્કોર અને પ્રગતિ સફળતાપૂર્વક રીસેટ કરવામાં આવી છે.',
      filters: {
        all: 'બધા વિષયો',
        mastered: 'નિપુણ (Mastered)',
        progressing: 'પ્રગતિમાં',
        needsImprovement: 'સુધારણા જરૂરી',
        unattempted: 'બાકી'
      },
      emptyStateTitle: 'હજી સુધી કોઈ પરીક્ષા આપી નથી',
      emptyStateDesc: 'તમારો સ્કોર તમારા વાસ્તવિક પ્રયાસો પરથી અપડેટ થશે. લાઈવ સ્કોર જોવા માટે નીચેના કોઈપણ વિષય પર ક્વિઝ શરૂ કરો.',
      summaryTemplate: (overall: number, attempts: number, mastered: number, prog: number, needs: number, totalQ: number, correctQ: number) => {
        if (attempts === 0) {
          return 'તમે હજી સુધી કોઈ ક્વિઝ પૂર્ણ કરી નથી. લાઈવ સચોટતા અને ભૂલોનું વિશ્લેષણ જોવા માટે કોઈપણ વિષય પર ક્વિઝ શરૂ કરો.';
        }
        return `તમે કુલ ${attempts} પ્રયાસો પૂર્ણ કર્યા છે. તમારી સરેરાશ સચોટતા ${overall}% (${correctQ}/${totalQ} સાચા) છે. ${mastered} વિષયો નિપુણ છે.`;
      }
    };
  }

  if (isSpanish) {
    return {
      headerTitle: 'Resumen de Dominio Adaptativo en Vivo (Mastery Overview)',
      headerSubtitle: 'Rendimiento en vivo calculado a partir de tus cuestionarios, aciertos y errores reales',
      overallScoreLabel: 'Puntuación Total de Dominio',
      activeTopicsLabel: 'Temas Evaluados',
      masteredTag: 'Dominado (Mastered)',
      progressingTag: 'En Progreso (Progressing)',
      needsImprovementTag: 'Necesita Ayuda (Needs Help)',
      unattemptedTag: 'Pendiente (Pending)',
      accuracyLabel: 'Precisión (Accuracy)',
      attemptsLabel: 'Intentos (Attempts)',
      mistakesLabel: 'Errores Identificados',
      whatDidWellLabel: 'Tus Fortalezas (Strengths)',
      whereStruggledLabel: 'Áreas de Mejora',
      recommendedActionLabel: 'Siguiente Paso Recomendado',
      actionReviewBtn: 'Repasar con IA de Voz',
      actionPracticeBtn: 'Iniciar Cuestionario',
      actionAdvancedBtn: 'Nivel Avanzado',
      actionResetBtn: 'Reiniciar Tema',
      resetConfirmTopic: (topicTitle: string) => `¿Deseas reiniciar el progreso y puntuación de "${topicTitle}" a 0?`,
      resetAllModalTitle: '¿Reiniciar todo el dominio y progreso?',
      resetAllModalDesc: 'Esto restablecerá todos los cuestionarios, estadísticas de precisión y lecciones a 0.',
      resetTopicModalTitle: (title: string) => `¿Reiniciar "${title}"?`,
      resetTopicModalDesc: 'Se restablecerán todos los intentos, precisión y lecciones de este tema a 0%.',
      confirmResetBtn: 'Sí, reiniciar',
      cancelBtn: 'Cancelar',
      resetSuccessToast: 'Las métricas de dominio y el progreso se han restablecido a 0.',
      filters: {
        all: 'Todos los Temas',
        mastered: 'Dominado',
        progressing: 'En Progreso',
        needsImprovement: 'Necesita Ayuda',
        unattempted: 'Pendiente'
      },
      emptyStateTitle: 'Aún no has realizado pruebas',
      emptyStateDesc: 'Tu panel se actualiza con cada cuestionario. Haz clic en "Iniciar Cuestionario" en cualquier tema para ver tu puntuación en tiempo real.',
      summaryTemplate: (overall: number, attempts: number, mastered: number, prog: number, needs: number, totalQ: number, correctQ: number) => {
        if (attempts === 0) {
          return 'No has completado ningún cuestionario aún. Inicia un cuestionario abajo para ver tu precisión y análisis de errores.';
        }
        return `Has completado ${attempts} intento(s) con una precisión de ${overall}% (${correctQ}/${totalQ} correctas). ${mastered} temas dominados.`;
      }
    };
  }

  // English Default
  return {
    headerTitle: 'Your Live Adaptive Mastery Overview',
    headerSubtitle: 'Live performance computed strictly from your actual quiz attempts, scores, and answered questions',
    overallScoreLabel: 'Overall Mastery Score',
    activeTopicsLabel: 'Evaluated Topics',
    masteredTag: 'Mastered',
    progressingTag: 'Progressing',
    needsImprovementTag: 'Needs Help',
    unattemptedTag: 'Pending',
    accuracyLabel: 'Accuracy',
    attemptsLabel: 'Attempts',
    mistakesLabel: 'Identified Mistakes',
    whatDidWellLabel: 'Your Strengths',
    whereStruggledLabel: 'Areas for Improvement',
    recommendedActionLabel: 'Recommended Next Step',
    actionReviewBtn: 'Review with Voice AI',
    actionPracticeBtn: 'Start Practice Quiz',
    actionAdvancedBtn: 'Start Advanced Test',
    actionResetBtn: 'Reset Topic',
    resetConfirmTopic: (topicTitle: string) => `Reset progress and quiz history for "${topicTitle}" back to 0 (clean state)?`,
    resetAllModalTitle: 'Reset All Mastery & Progress Data?',
    resetAllModalDesc: 'This will reset all quiz attempts, accuracy statistics, identified mistakes, and completed lessons across all topics back to a clean initial state (0%).',
    resetTopicModalTitle: (title: string) => `Reset "${title}"?`,
    resetTopicModalDesc: 'This will reset all quiz attempts, accuracy score, mistakes, and lesson milestones for this topic back to 0 (clean state).',
    confirmResetBtn: 'Yes, Reset',
    cancelBtn: 'Cancel',
    resetSuccessToast: 'Mastery metrics and progress have been successfully reset to 0.',
    filters: {
      all: 'All Topics',
      mastered: 'Mastered',
      progressing: 'Progressing',
      needsImprovement: 'Needs Help',
      unattempted: 'Pending'
    },
    emptyStateTitle: 'No Tests Attempted Yet',
    emptyStateDesc: 'Your dashboard updates dynamically with every quiz or test you take. Click "Start Quiz" on any topic below to view your real-time score.',
    summaryTemplate: (overall: number, attempts: number, mastered: number, prog: number, needs: number, totalQ: number, correctQ: number) => {
      if (attempts === 0) {
        return 'No quiz attempts recorded yet. Start a quiz on any subject below to calculate your live accuracy, track your mistakes, and view your adaptive mastery analysis.';
      }
      return `You have completed ${attempts} test attempt(s) with an overall accuracy of ${overall}% (${correctQ}/${totalQ} correct answers). ${mastered} topics Mastered, ${prog} Progressing, and ${needs} requiring targeted practice.`;
    }
  };
}

/**
 * Generate dynamic topic insights based on ACTUAL user performance record
 */
function buildTopicInsight(
  topic: LearningTopic | { id: string; title: string; nativeTitle: string; category: any },
  perf: PerformanceRecord | undefined,
  langId: string
): DynamicTopicInsight {
  const norm = (langId || '').toLowerCase();
  const isHindi = norm.startsWith('hi');
  const isBengali = norm.startsWith('bn');
  const isMarathi = norm.startsWith('mr');
  const isTamil = norm.startsWith('ta');
  const isTelugu = norm.startsWith('te');
  const isGujarati = norm.startsWith('gu');
  const isSpanish = norm.startsWith('es');

  const attempts = perf?.attempts || 0;
  const accuracy = perf?.accuracy || 0;
  const totalQuestions = perf?.totalQuestions || 0;
  const correctAnswers = perf?.correctAnswers || 0;
  const timeSpentMinutes = perf?.timeSpentMinutes || 0;
  const mistakes = perf?.mistakes || [];
  const masteryLevel = computeMasteryLevel(accuracy, attempts);

  let whatDidWell = '';
  let whereStruggled = '';

  const getLocalizedAction = (type: 'review' | 'practice' | 'advanced') => {
    if (type === 'advanced') {
      if (isHindi) return { label: 'कठिन स्तर शुरू करें', desc: 'विषय सिद्ध हो चुका है। प्रतियोगी परीक्षा स्तर के प्रश्न आज़माएं।' };
      if (isBengali) return { label: 'উন্নত পর্যায় শুরু', desc: 'বিষয়টি আয়ত্ত হয়েছে। এখন উন্নত প্রশ্ন অনুশীলন করুন।' };
      if (isMarathi) return { label: 'कठीण पातळी सुरू करा', desc: 'विषय प्रवीण झाला आहे. आता कठीण प्रश्नांचा सराव करा।' };
      if (isTamil) return { label: 'கடின நிலை தொடங்கு', desc: 'பாடம் தேர்ச்சி பெற்றது. மேம்பட்ட கேள்விகளை பயிற்சி செய்யுங்கள்.' };
      if (isTelugu) return { label: 'కఠిన స్థాయి ప్రారంభించండి', desc: 'నైపుణ్యం సాధించారు. ఇప్పుడు అధునాతన ప్రశ్నలను ప్రాక్టీస్ చేయండి.' };
      if (isGujarati) return { label: 'અઘરું સ્તર શરૂ કરો', desc: 'વિષયમાં નિપુણતા મેળવી. હવે અદ્યતન પ્રશ્નો અજમાવો.' };
      if (isSpanish) return { label: 'Nivel Avanzado', desc: 'Dominio confirmado. Avanza a preguntas de nivel desafiante.' };
      return { label: 'Ready for Advanced Level', desc: 'Mastery confirmed. Advance to high-difficulty challenge questions.' };
    }
    if (type === 'practice') {
      if (isHindi) return { label: 'क्विज़ शुरू करें', desc: 'अपनी समझ जांचने के लिए 4-5 प्रश्नों का क्विज़ हल करें।' };
      if (isBengali) return { label: 'কুইজ শুরু করুন', desc: 'আপনার বোঝাপড়া যাচাই করতে কুইজ সমাধান করুন।' };
      if (isMarathi) return { label: 'चाचणी सुरू करा', desc: 'आपली समज तपासण्यासाठी 4-5 प्रश्नांची चाचणी सोडवा.' };
      if (isTamil) return { label: 'வினாடி வினா தொடங்கு', desc: 'உங்கள் புரிதலை சோதிக்க வினாடி வினாவைத் தொடங்குங்கள்.' };
      if (isTelugu) return { label: 'క్విజ్ ప్రారంభించండి', desc: 'మీ అవగాహనను అంచనా వేయడానికి క్విజ్ ప్రారంభించండి.' };
      if (isGujarati) return { label: 'ક્વિઝ શરૂ કરો', desc: 'તમારી સમજ ચકાસવા માટે 4-5 પ્રશ્નોની ક્વિઝ આપો.' };
      if (isSpanish) return { label: 'Iniciar Cuestionario', desc: 'Evalúa tu comprensión con un cuestionario de 4 preguntas.' };
      return { label: 'Start Practice Quiz', desc: 'Evaluate your understanding with an adaptive quiz.' };
    }
    // review
    if (isHindi) return { label: 'वॉइस AI से दोहराएं', desc: 'सटीकता कम है। वॉइस ट्यूटर से मूल सिद्धांत आसान भाषा में समझें।' };
    if (isBengali) return { label: 'ভয়েস AI-এর সাথে বুঝুন', desc: 'সঠিকতা কম। ভয়েস টিউটরের সাথে সহজ ভাষায় পুনরায় বুঝুন।' };
    if (isMarathi) return { label: 'व्हॉइस AI सह समजून घ्या', desc: 'अचूकता कमी आहे. व्हॉइस ट्यूटरकडून मूलभूत संकल्पना सोप्या भाषेत समजावून घ्या.' };
    if (isTamil) return { label: 'குரல் AI உடன் புரிந்துகொள்ளுங்கள்', desc: 'துல்லியம் குறைவு. அடிப்படைக் கருத்துகளை குரல் மூலம் எளிதாகக் கேளுங்கள்.' };
    if (isTelugu) return { label: 'వాయిస్ AI తో అర్థం చేసుకోండి', desc: 'ఖచ్చితత్వం తక్కువగా ఉంది. ప్రాథమిక అంశాలను వాయిస్ ట్యూటర్‌తో సులభంగా అర్థం చేసుకోండి.' };
    if (isGujarati) return { label: 'વોઇસ AI સાથે સમજો', desc: 'સચોटતા ઓછી છે. વોઇસ ટ્યુટર સાથે મૂળ વિભાવનાઓ સરળ ભાષામાં સમજો.' };
    if (isSpanish) return { label: 'Repasar con IA de Voz', desc: 'La precisión es baja. Escucha los conceptos fundamentales explicados de forma sencilla.' };
    return { label: 'Review with Voice AI', desc: 'Accuracy is low. Hear foundational concepts explained simply.' };
  };

  let recommendedAction = {
    type: 'practice' as 'review' | 'practice' | 'advanced',
    label: getLocalizedAction('practice').label,
    description: getLocalizedAction('practice').desc,
    promptQuery: `Start a practice quiz on ${topic.title}`
  };

  if (attempts === 0) {
    if (isHindi) {
      whatDidWell = 'अभी तक कोई प्रयास नहीं किया गया';
      whereStruggled = 'अपनी वास्तविक समझ और स्कोर जानने के लिए पहला क्विज़ दें।';
    } else if (isBengali) {
      whatDidWell = 'এখনও কোনো চেষ্টা করা হয়নি';
      whereStruggled = 'আপনার বাস্তব বোঝাপড়া জানতে প্রথম কুইজটি দিন।';
    } else if (isMarathi) {
      whatDidWell = 'अद्याप कोणताही प्रयत्न केलेला नाही';
      whereStruggled = 'आपली समज आणि गुण जाणून घेण्यासाठी पहिली चाचणी द्या.';
    } else if (isTamil) {
      whatDidWell = 'இன்னும் எந்த முயற்சியும் செய்யப்படவில்லை';
      whereStruggled = 'உங்கள் மதிப்பெண்ணை அறிய முதல் வினாடி வினாவை எடுக்கவும்.';
    } else if (isTelugu) {
      whatDidWell = 'ఇంకా ఎలాంటి ప్రయత్నం చేయలేదు';
      whereStruggled = 'మీ అవగాహనను తెలుసుకోవడానికి మొదటి క్విజ్ రాయండి.';
    } else if (isGujarati) {
      whatDidWell = 'હજી સુધી કોઈ પ્રયાસ કર્યો નથી';
      whereStruggled = 'તમારી સમજ ચકાસવા માટે પ્રથમ ક્વિઝ આપો.';
    } else if (isSpanish) {
      whatDidWell = 'Aún no se ha realizado ningún intento';
      whereStruggled = 'Realiza tu primer cuestionario para identificar fortalezas y debilidades.';
    } else {
      whatDidWell = 'Not attempted yet';
      whereStruggled = 'Take your first quiz to identify strengths and weaknesses.';
    }
  } else {
    // Strengths
    if (accuracy === 100) {
      if (isHindi) whatDidWell = `हालिया प्रयास में 100% पूर्ण सटीकता (${correctAnswers}/${totalQuestions} सही)! शून्य गलतियाँ।`;
      else if (isBengali) whatDidWell = `১০০% নিখুঁত স্কোর (${correctAnswers}/${totalQuestions} সঠিক)! কোনো ভুল নেই।`;
      else if (isMarathi) whatDidWell = `१००% अचूक निकाल (${correctAnswers}/${totalQuestions} बरोबर)! एकही चूक नाही.`;
      else if (isTamil) whatDidWell = `100% முழுமையான துல்லியம் (${correctAnswers}/${totalQuestions} சரி)! பூஜ்ஜிய தவறுகள்.`;
      else if (isTelugu) whatDidWell = `100% పరిపూర్ణ ఖచ్చితత్వం (${correctAnswers}/${totalQuestions} సరైనవి)! ఎలాంటి తప్పులు లేవు.`;
      else if (isGujarati) whatDidWell = `100% સંપૂર્ણ સચોટતા (${correctAnswers}/${totalQuestions} સાચા)! કોઈ ભૂલ નથી.`;
      else if (isSpanish) whatDidWell = `100% puntuación perfecta (${correctAnswers}/${totalQuestions} correctas)! Sin errores.`;
      else whatDidWell = `100% perfect score in your test (${correctAnswers}/${totalQuestions} correct)! Flawless execution.`;
    } else if (accuracy >= 80) {
      if (isHindi) whatDidWell = `${attempts} प्रयास में ${correctAnswers}/${totalQuestions} सही उत्तर (${accuracy}% सटीकता)। विषय पर मजबूत पकड़।`;
      else if (isBengali) whatDidWell = `${correctAnswers}/${totalQuestions} সঠিক উত্তর (${accuracy}% নির্ভুলতা)। বিষয়ে চমৎকার দখল।`;
      else if (isMarathi) whatDidWell = `${correctAnswers}/${totalQuestions} बरोबर उत्तर (${accuracy}% अचूकता)। विषयावर उत्तम पकड.`;
      else if (isTamil) whatDidWell = `${correctAnswers}/${totalQuestions} சரியான பதில்கள் (${accuracy}% துல்லியம்). பாடத்தில் வலுவான பிடிப்பு.`;
      else if (isTelugu) whatDidWell = `${correctAnswers}/${totalQuestions} సరైన సమాధానాలు (${accuracy}% ఖచ్చితత్వం). అంశంపై పట్టు సాధించారు.`;
      else if (isGujarati) whatDidWell = `${correctAnswers}/${totalQuestions} સાચા જવાબો (${accuracy}% સચોટતા). વિષય પર મજબૂત પકડ.`;
      else if (isSpanish) whatDidWell = `Sólido dominio: ${correctAnswers}/${totalQuestions} correctas (${accuracy}% de precisión).`;
      else whatDidWell = `Strong mastery: ${correctAnswers}/${totalQuestions} correct (${accuracy}% accuracy) across ${attempts} attempt(s).`;
    } else if (accuracy >= 50) {
      if (isHindi) whatDidWell = `${correctAnswers}/${totalQuestions} प्रश्न सही (${accuracy}% सटीकता)। मूल बातें समझ आ रही हैं।`;
      else if (isBengali) whatDidWell = `${correctAnswers}/${totalQuestions} প্রশ্ন সঠিক (${accuracy}% সঠিকতা)। মূল ধারণা তৈরি হচ্ছে।`;
      else if (isMarathi) whatDidWell = `${correctAnswers}/${totalQuestions} प्रश्न बरोबर (${accuracy}% अचूकता)। पाया चांगला आहे.`;
      else if (isTamil) whatDidWell = `${correctAnswers}/${totalQuestions} கேள்விகள் சரி (${accuracy}% துல்லியம்). அடிப்படைகள் நன்றாக உள்ளன.`;
      else if (isTelugu) whatDidWell = `${correctAnswers}/${totalQuestions} సరైనవి (${accuracy}% ఖచ్చితత్వం). ప్రాథమిక అంశాలు తెలుస్తున్నాయి.`;
      else if (isGujarati) whatDidWell = `${correctAnswers}/${totalQuestions} પ્રશ્નો સાચા (${accuracy}% સચોટતા). પાયો મજબૂત છે.`;
      else if (isSpanish) whatDidWell = `Buena base: ${correctAnswers}/${totalQuestions} correctas (${accuracy}% de precisión).`;
      else whatDidWell = `Solid baseline: ${correctAnswers}/${totalQuestions} correct (${accuracy}% accuracy). Good foundation.`;
    } else {
      if (isHindi) whatDidWell = `${attempts} बार प्रयास किया गया (${correctAnswers}/${totalQuestions} सही)। निरंतरता बनी हुई है।`;
      else if (isBengali) whatDidWell = `${attempts}টি প্রচেষ্টা সম্পন্ন (${correctAnswers}/${totalQuestions} সঠিক)। চেষ্টা অব্যাহত রাখুন।`;
      else if (isMarathi) whatDidWell = `${attempts} वेळा प्रयत्न केला (${correctAnswers}/${totalQuestions} बरोबर). सतत सराव आवश्यक.`;
      else if (isTamil) whatDidWell = `${attempts} முயற்சிகள் செய்யப்பட்டன (${correctAnswers}/${totalQuestions} சரி). பயிற்சி தொடரவும்.`;
      else if (isTelugu) whatDidWell = `${attempts} ప్రయత్నాలు పూర్తయ్యాయి (${correctAnswers}/${totalQuestions} సరైనవి). మరింత సాధన చేయండి.`;
      else if (isGujarati) whatDidWell = `${attempts} પ્રયાસો પૂર્ણ થયા (${correctAnswers}/${totalQuestions} સાચા). સાતત્ય જાળવી રાખો.`;
      else if (isSpanish) whatDidWell = `Completados ${attempts} intentos (${correctAnswers}/${totalQuestions} correctas). Buen esfuerzo de aprendizaje.`;
      else whatDidWell = `Completed ${attempts} attempt(s) with ${correctAnswers}/${totalQuestions} correct. Good effort to test knowledge.`;
    }

    // Mistakes
    if (mistakes.length > 0) {
      const topMistakes = mistakes.slice(0, 2).join('; ');
      if (isHindi) whereStruggled = `गलतियाँ: ${topMistakes}`;
      else if (isBengali) whereStruggled = `চিহ্নিত ভুল: ${topMistakes}`;
      else if (isMarathi) whereStruggled = `झालेल्या चुका: ${topMistakes}`;
      else if (isTamil) whereStruggled = `தவறுகள்: ${topMistakes}`;
      else if (isTelugu) whereStruggled = `గుర్తించిన తప్పులు: ${topMistakes}`;
      else if (isGujarati) whereStruggled = `ભૂલો: ${topMistakes}`;
      else if (isSpanish) whereStruggled = `Errores identificados: ${topMistakes}`;
      else whereStruggled = `Identified mistake: ${topMistakes}`;
    } else if (accuracy === 100) {
      if (isHindi) whereStruggled = 'कोई गलती दर्ज नहीं हुई! इस विषय पर उत्कृष्ट पकड़।';
      else if (isBengali) whereStruggled = 'কোনো ভুল হয়নি! চমৎকার ধারণা।';
      else if (isMarathi) whereStruggled = 'एकही चूक नाही! संकल्पना उत्तम समजली आहे.';
      else if (isTamil) whereStruggled = 'எந்த தவறும் பதிவு செய்யப்படவில்லை! சிறந்த புரிதல்.';
      else if (isTelugu) whereStruggled = 'ఎలాంటి తప్పులు నమోదు కాలేదు! అద్భుతమైన అవగాహన.';
      else if (isGujarati) whereStruggled = 'કોઈ ભૂલ નોંધાઈ નથી! ઉત્કૃષ્ટ પકડ.';
      else if (isSpanish) whereStruggled = '¡Sin errores registrados en tu prueba! Excelente comprensión.';
      else whereStruggled = 'No mistakes recorded in your test! Excellent conceptual understanding.';
    } else {
      const wrongCount = totalQuestions - correctAnswers;
      if (isHindi) whereStruggled = `${wrongCount} प्रश्नों के उत्तर गलत हुए। सुधार के लिए समीक्षा करें।`;
      else if (isBengali) whereStruggled = `${wrongCount}টি প্রশ্নের উত্তর ভুল হয়েছে। পর্যালোচনার পরামর্শ দেওয়া হচ্ছে।`;
      else if (isMarathi) whereStruggled = `${wrongCount} प्रश्नांची उत्तरे चुकली. पुनरावलोकन आवश्यक आहे.`;
      else if (isTamil) whereStruggled = `${wrongCount} கேள்விகள் தவறாகிவிட்டன. மதிப்பாய்வு தேவை.`;
      else if (isTelugu) whereStruggled = `${wrongCount} ప్రశ్నలు తప్పుగా గుర్తించబడ్డాయి. సమీక్ష చేయండి.`;
      else if (isGujarati) whereStruggled = `${wrongCount} પ્રશ્નો ખોટા પડ્યા. સુધારણા માટે સમીક્ષા કરો.`;
      else if (isSpanish) whereStruggled = `${wrongCount} pregunta(s) incorrecta(s). Se recomienda repasar.`;
      else whereStruggled = `Missed ${wrongCount} question(s) in your assessment. Review recommended.`;
    }

    // Action
    const actionData = getLocalizedAction(masteryLevel === 'mastered' ? 'advanced' : (masteryLevel === 'progressing' ? 'practice' : 'review'));
    recommendedAction = {
      type: masteryLevel === 'mastered' ? 'advanced' : (masteryLevel === 'progressing' ? 'practice' : 'review'),
      label: actionData.label,
      description: actionData.desc,
      promptQuery: masteryLevel === 'mastered'
        ? `Give me 3 advanced critical-thinking questions on ${topic.title}`
        : (masteryLevel === 'progressing'
          ? `Explain the key mistakes in ${topic.title} and give me 3 practice questions with solutions`
          : `Explain ${topic.title} in very simple terms with everyday vernacular examples.`)
    };
  }

  return {
    topicId: topic.id,
    title: topic.title,
    nativeTitle: topic.nativeTitle || topic.title,
    category: topic.category || 'General',
    masteryLevel,
    accuracy,
    attempts,
    totalQuestions,
    correctAnswers,
    timeSpentMinutes,
    mistakesCount: mistakes.length,
    whatDidWell,
    whereStruggled,
    recommendedAction
  };
}

/**
 * Generate full dynamic mastery analysis for all topics strictly from real user activity
 */
export function getFullDynamicMasteryAnalysis(langId: string = 'hi-bhojpuri'): {
  summary: OverallMasterySummary;
  topics: DynamicTopicInsight[];
} {
  const perfData = getUserPerformanceData();
  const curriculumTopics = getAllTopics();
  
  // Combine curriculum topics and any custom topics created by user
  const topicMap = new Map<string, LearningTopic | { id: string; title: string; nativeTitle: string; category: any }>();
  
  curriculumTopics.forEach(t => topicMap.set(t.id, t));

  // Add any custom topics that have user attempts
  Object.keys(perfData).forEach(id => {
    if (!topicMap.has(id)) {
      const p = perfData[id];
      const title = p.topicTitle || id.replace(/^top-/, '').replace(/-/g, ' ');
      topicMap.set(id, {
        id,
        title: title.charAt(0).toUpperCase() + title.slice(1),
        nativeTitle: title,
        category: 'General'
      });
    }
  });

  const allTopics = Array.from(topicMap.values());

  // Generate dynamic insights
  const topicsList: DynamicTopicInsight[] = allTopics.map(topic => {
    const perf = perfData[topic.id];
    return buildTopicInsight(topic, perf, langId);
  });

  // Calculate overall metrics strictly from REAL activity
  const attemptedTopics = topicsList.filter(t => t.attempts > 0);
  const totalAttempts = Object.values(perfData).reduce((acc, p) => acc + (p.attempts || 0), 0);
  const totalQuestionsAttempted = Object.values(perfData).reduce((acc, p) => acc + (p.totalQuestions || 0), 0);
  const totalCorrectAnswers = Object.values(perfData).reduce((acc, p) => acc + (p.correctAnswers || 0), 0);

  const overallScore = totalQuestionsAttempted > 0 
    ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
    : 0;

  const masteredCount = topicsList.filter(t => t.masteryLevel === 'mastered').length;
  const progressingCount = topicsList.filter(t => t.masteryLevel === 'progressing').length;
  const needsImprovementCount = topicsList.filter(t => t.masteryLevel === 'needs_improvement').length;
  const unattemptedCount = topicsList.filter(t => t.masteryLevel === 'unattempted').length;

  // Identify real top strength & focus area
  let topStrength = 'None yet (Start a quiz to evaluate)';
  let criticalFocusArea = 'None yet';

  if (attemptedTopics.length > 0) {
    const sorted = [...attemptedTopics].sort((a, b) => b.accuracy - a.accuracy);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    topStrength = `${best.title} (${best.accuracy}% accuracy)`;
    if (worst.accuracy < 80) {
      criticalFocusArea = `${worst.title} (${worst.accuracy}% accuracy)`;
    } else {
      criticalFocusArea = 'All evaluated topics above 80%';
    }
  }

  const loc = getLocalizedMasteryContent(langId);

  return {
    summary: {
      overallScore,
      totalAttempts,
      totalQuestionsAttempted,
      totalCorrectAnswers,
      totalTopicsAnalyzed: attemptedTopics.length,
      masteredCount,
      progressingCount,
      needsImprovementCount,
      unattemptedCount,
      topStrength,
      criticalFocusArea,
      summaryText: loc.summaryTemplate(
        overallScore,
        totalAttempts,
        masteredCount,
        progressingCount,
        needsImprovementCount,
        totalQuestionsAttempted,
        totalCorrectAnswers
      )
    },
    topics: topicsList
  };
}
