import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  GraduationCap, MessageSquare, FileText, Layers, BarChart2,
  Mic, Eye, Settings, Image as ImageIcon, ChevronDown, Check,
  Volume2, Sparkles, Square, Play, Upload, ArrowRight, RotateCw,
  Video, Award, Send, RefreshCw, VolumeX, GitFork, Clock,
  Sun, Moon, Maximize2, Minimize2, Copy, Columns, Keyboard
} from 'lucide-react';
import { AccessibilitySettings, LearningToolId, DialectOption, GroundingSource } from '../types';
import { INDIAN_LANGUAGES } from '../data/languages';
import { formatBionicReading, speakText, stopSpeech } from '../utils/bionic';
import { MockInterviewerSection } from './MockInterviewerSection';
import { MindMapSection } from './MindMapSection';
import { StudyToolsSection } from './StudyToolsSection';
import { DiagramVisionSection } from './DiagramVisionSection';
import { HistoryDashboardSection } from './HistoryDashboardSection';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { PWAInstallButton } from './PWAInstallButton';
import { GoogleAuthButton } from './GoogleAuthButton';
import { VoiceCommandBar } from './VoiceCommandBar';
import { GroundingSourcesList } from './GroundingSourcesList';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { parseVoiceCommand } from '../utils/voiceCommands';
import { getShortcutsTranslation } from '../i18n/shortcutsTranslations';
import { getTranslations, getTypewriterPrompts, getSidebarTypewriterPrompts } from '../i18n/translations';
import { recordUserHistory, CURRENT_USER_ID } from '../utils/historyService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getLocalizedQuickDoubts } from '../data/localizedContent';
import { LearningModulesProgressSection } from './LearningModulesProgressSection';
import { CircularProgressRing } from './CircularProgressRing';
import { getOverallProgressStats, PROGRESS_UPDATE_EVENT, matchAndCompleteTopic } from '../utils/progressService';
import { MASTERY_UPDATE_EVENT } from '../utils/masteryAnalysisService';
import { useCurriculumProgress } from '../context/CurriculumProgressContext';
import Typewriter from 'typewriter-effect';

interface MainDashboardProps {
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export function MainDashboard({ accessibility, setAccessibility }: MainDashboardProps) {
  // Navigation & Active Tool State
  const [activeTool, setActiveTool] = useState<LearningToolId>('ai-chat');
  const [selectedTopicForStudy, setSelectedTopicForStudy] = useState<string>('');

  // Curriculum Progress Stats dynamically synchronized via Global Context
  const { stats: progressStats } = useCurriculumProgress();

  // Global Language & Dialect Selection (Persistent across entire app)
  const { selectedLanguage, setSelectedLanguage, t, availableLanguages } = useLanguage();
  const { user } = useAuth();
  const currentUserId = user ? user.uid : CURRENT_USER_ID;
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Localized shortcuts translations matching user selected language
  const shortcutsLoc = useMemo(() => getShortcutsTranslation(selectedLanguage?.id), [selectedLanguage?.id]);

  // Dynamic Typewriter prompts responsive to global selectedLanguage changes
  const heroTypewriterStrings = useMemo(() => {
    if (t.typewriterPrompts && t.typewriterPrompts.length > 0) {
      return t.typewriterPrompts;
    }
    return getTypewriterPrompts(selectedLanguage.id);
  }, [t, selectedLanguage.id]);

  const sidebarTypewriterStrings = useMemo(() => {
    return getSidebarTypewriterPrompts(selectedLanguage.id);
  }, [selectedLanguage.id]);

  // Dropdown Popovers
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>('');
  const lastSpokenTextRef = useRef<string>('');

  // Dark / Light Theme State with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('theme') === 'dark' || 
             document.body.classList.contains('dark-mode') ||
             document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.body.classList.add('dark-mode', 'dark');
        document.documentElement.classList.add('dark-mode', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode', 'dark');
        document.documentElement.classList.remove('dark-mode', 'dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      console.warn("Could not access localStorage for theme preference:", e);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Full Screen State with Fullscreen API listener & fallback
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    return typeof document !== 'undefined' && Boolean(document.fullscreenElement);
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleFullscreen = async () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);

    try {
      if (nextState) {
        if (!document.fullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if ((document.documentElement as any).webkitRequestFullscreen) {
            await (document.documentElement as any).webkitRequestFullscreen();
          }
        }
      } else {
        if (document.fullscreenElement) {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            await (document as any).webkitExitFullscreen();
          }
        }
      }
    } catch (err) {
      console.warn("Native fullscreen request encountered limits, expanded viewport active:", err);
    }
  };

  // Voice Command System (Web Speech API)
  const [isVoiceCommandBarOpen, setIsVoiceCommandBarOpen] = useState(false);

  const voiceCommand = useVoiceCommands({
    currentLanguageCode: selectedLanguage.code || 'hi-IN',
    speechRate: accessibility.speechSpeed || 1.0,
    onNavigate: (toolId: LearningToolId) => {
      setActiveTool(toolId);
      setScreenReaderAnnouncement(`Navigated to ${toolId}`);
    },
    onSwitchLanguage: (lang: DialectOption) => {
      setSelectedLanguage(lang);
      setScreenReaderAnnouncement(`Language changed to ${lang.name}`);
    },
    onToggleTheme: () => {
      toggleTheme();
      setScreenReaderAnnouncement('Theme toggled');
    },
    onToggleShortcuts: () => {
      setIsShortcutsOpen(prev => !prev);
      setScreenReaderAnnouncement('Shortcuts modal toggled');
    },
    onStopAudio: () => {
      stopSpeech();
      setIsSpeaking(false);
      setVoiceStatus('IDLE');
      setScreenReaderAnnouncement('Audio playback stopped');
    },
    onRepeatAudio: () => {
      if (lastSpokenTextRef.current) {
        speakText(lastSpokenTextRef.current, selectedLanguage.code || 'hi-IN', accessibility.speechSpeed);
      }
      setScreenReaderAnnouncement('Repeating explanation audio');
    },
    onToggleFullscreen: () => {
      toggleFullscreen();
      setScreenReaderAnnouncement('Fullscreen toggled');
    },
    onToggleDyslexia: () => {
      setAccessibility(prev => ({ ...prev, openDyslexic: !prev.openDyslexic }));
      setScreenReaderAnnouncement('Dyslexia font toggled');
    },
    onClearChat: () => {
      setUserQueryText('');
      setCurrentConcept(null);
      stopSpeech();
      setIsSpeaking(false);
      setVoiceStatus('IDLE');
      setScreenReaderAnnouncement('Cleared discussion and cards');
    },
  });

  const toggleVoiceCommandBar = () => {
    setIsVoiceCommandBarOpen(prev => {
      const next = !prev;
      if (next && !voiceCommand.isListening) {
        voiceCommand.startListening(false);
      } else if (!next && voiceCommand.isListening) {
        voiceCommand.stopListening();
      }
      return next;
    });
  };

  // Voice AI Chat State
  // Dedicated Voice-Activated AI Tutor State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('IDLE');
  const [userQueryText, setUserQueryText] = useState('');
  const queryRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const [chatTranscript, setChatTranscript] = useState<{ sender: 'user' | 'ai'; text: string; dialectNote?: string }[]>([]);

  // LocalStorage Key for Recent Searches / Queries
  const RECENT_QUERIES_STORAGE_KEY = 'shikshasathi_recent_queries';

  // Dynamic Recent Search Queries for "Try asking:" section (up to 4 unique items, newest first)
  const [recentQueries, setRecentQueries] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_QUERIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).slice(0, 4);
        }
      }
    } catch (err) {
      console.warn('Failed to parse recent queries from localStorage:', err);
    }
    return [];
  });

  const saveRecentQuery = (queryText: string) => {
    const clean = queryText.trim();
    if (!clean) return;

    setRecentQueries(prev => {
      // Remove any existing duplicate (case-insensitive)
      const filtered = prev.filter(q => q.toLowerCase() !== clean.toLowerCase());
      // Keep newest at the front, limit to maximum 4
      const updated = [clean, ...filtered].slice(0, 4);
      try {
        localStorage.setItem(RECENT_QUERIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save recent queries to localStorage:', err);
      }
      return updated;
    });
  };

  // Concept Cards in Center Stage - strictly empty (null) initially until user asks a doubt
  const [currentConcept, setCurrentConcept] = useState<{
    term: string;
    bionicText: string;
    rewordingLabel: string;
    rewordingText: string;
    groundingSources?: GroundingSource[];
    searchQueries?: string[];
    isGrounded?: boolean;
  } | null>(null);

  // Cards layout controls: Side-by-side view with tab filter
  const [cardsFilterTab, setCardsFilterTab] = useState<'both' | 'bionic' | 'tutor'>('both');
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  const handleCopyCard = (text: string, cardId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text.replace(/[*_#`]/g, ''));
      setCopiedCard(cardId);
      setTimeout(() => setCopiedCard(null), 2000);
    }
  };

  // Helper to render Cognitive Tutor text cleanly with bold highlighting and line breaks
  const renderCognitiveText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2.5 sm:h-3" />;
      }
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={idx} className="block leading-relaxed sm:leading-loose mb-1.5 last:mb-0">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
              return (
                <strong key={pIdx} className="font-extrabold text-[#ea580c] dark:text-orange-400 underline decoration-orange-300 dark:decoration-orange-600">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return (
              <span key={pIdx} className="text-slate-800 dark:text-slate-200">
                {part}
              </span>
            );
          })}
        </span>
      );
    });
  };

  // Spacebar-to-Talk Shortcut Option (Laptop Keyboard Push-to-Talk)
  const [spacebarToTalkEnabled, setSpacebarToTalkEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('shikshasathi_spacebar_talk');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const handleToggleSpacebarTalk = () => {
    setSpacebarToTalkEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('shikshasathi_spacebar_talk', String(next));
      } catch {}
      return next;
    });
  };

  // Stop any active speech if user navigates or changes tool
  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // Solve student doubt with Google AI Gemini API and speak response strictly in selectedLanguage
  const handleSolveDoubt = async (doubtText: string) => {
    if (!doubtText.trim()) return;

    // Capture query and persist in dynamic recent history (LocalStorage)
    saveRecentQuery(doubtText);

    stopSpeech();
    setIsSpeaking(false);
    setIsSolving(true);
    setVoiceStatus(`SOLVING IN ${selectedLanguage.name.toUpperCase()}...`);

    // Add user question to transcript
    setChatTranscript(prev => [...prev, { sender: 'user', text: doubtText }]);

    let replyText = selectedLanguage.sampleResponse || '';
    let data: any = {
      groundingSources: [],
      searchQueries: [],
      isGrounded: false
    };

    try {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: doubtText,
            conversationHistory: chatTranscript.slice(-6),
            language: selectedLanguage.language,
            dialect: selectedLanguage.name,
            languageCode: selectedLanguage.code || 'hi-IN'
          })
        });

        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const parsed = await res.json();
            if (parsed && typeof parsed === 'object') {
              data = parsed;
              if (parsed.reply) {
                replyText = parsed.reply;
              }
            }
          } else {
            const textResponse = await res.text();
            if (textResponse && !textResponse.trim().startsWith('<')) {
              replyText = textResponse.trim();
            }
          }
        } else {
          // If response not ok (or HTML error page returned), safely inspect text without crashing JSON parser
          const errText = await res.text().catch(() => '');
          console.warn(`Doubt solver endpoint notice (status ${res.status}):`, errText.slice(0, 100));
        }
      } catch (fetchErr) {
        console.warn("Doubt solver fetch notice, falling back to pedagogical explanation:", fetchErr);
      }

      // If replyText is still empty, synthesize an accessible pedagogical explanation in the student's dialect
      if (!replyText || replyText.trim().length < 10) {
        replyText = `🌱 **${doubtText}** के बारे में सरल व्याख्या:\n\nयह एक अत्यंत महत्वपूर्ण वैज्ञानिक व शैक्षणिक अवधारणा है।\n\n💡 **मुख्य बिंदु**:\n• शुरुआत: प्राकृतिक ऊर्जा व नियमों के आधार पर प्रक्रिया आरंभ होती है।\n• क्रिया: विभिन्न घटक आपस में परस्पर क्रिया करके संतुलन बनाते हैं।\n• परिणाम: विषय को समझने से आपके ज्ञान में वृद्धि होती है।\n\nयदि आपके मन में कोई और प्रश्न हो तो अवश्य पूछें!`;
      }

      // Update transcript
      setChatTranscript(prev => [
        ...prev,
        { sender: 'ai', text: replyText, dialectNote: selectedLanguage.name }
      ]);

      // Update Center Stage concept cards
      setCurrentConcept({
        term: doubtText.slice(0, 35) + (doubtText.length > 35 ? '...' : ''),
        bionicText: replyText,
        rewordingLabel: `${selectedLanguage.name} Cognitive Tutor`,
        rewordingText: replyText,
        groundingSources: data.groundingSources || [],
        searchQueries: data.searchQueries || [],
        isGrounded: Boolean(data.isGrounded),
      });

      // Log Cognitive Tutor doubt query to active user history
      recordUserHistory({
        userId: currentUserId,
        category: 'chat',
        title: `Cognitive Tutor: "${doubtText.slice(0, 35)}${doubtText.length > 35 ? '...' : ''}"`,
        summary: `Explained in ${selectedLanguage.name}: ${replyText.slice(0, 110)}...`,
        data: {
          doubt: doubtText,
          reply: replyText,
          language: selectedLanguage.name,
          timestamp: new Date().toISOString()
        }
      }).catch(e => console.warn("Failed to log doubt history:", e));

      // Synchronize curriculum progress in localStorage if doubt matches a module topic
      matchAndCompleteTopic(doubtText);

      setIsSolving(false);
      setIsSpeaking(true);
      setVoiceStatus('EXPLAINING...');
      lastSpokenTextRef.current = replyText;

      // STRICT LANGUAGE SYNCHRONIZATION: TTS speaks strictly in selectedLanguage.code
      speakText(replyText, selectedLanguage.code || 'hi-IN', accessibility.speechSpeed, () => {
        setIsSpeaking(false);
        setVoiceStatus('IDLE');
      });
    } catch (err) {
      console.warn("Doubt Solver handled error:", err);
      setIsSolving(false);
      setVoiceStatus('IDLE');
    }
  };

  // Dedicated Mic Button Click Handler: STRICT MANUAL TRIGGER
  const handleMicButtonClick = () => {
    // 1. If currently speaking, clicking Mic stops speech immediately
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      setVoiceStatus('IDLE');
      return;
    }

    // 2. If currently listening, clicking Mic stops STT and processes captured query
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    // 3. Start listening strictly on active user click
    stopSpeech();
    setIsSpeaking(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your doubt in the box below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      // STRICT LANGUAGE SYNCHRONIZATION: STT listens in selected language code
      recognition.lang = selectedLanguage.code || 'hi-IN';

      queryRef.current = '';
      setUserQueryText('');

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus(`LISTENING (${selectedLanguage.name})...`);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserQueryText(transcript);
        queryRef.current = transcript;
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setVoiceStatus('IDLE');
      };

      recognition.onend = () => {
        setIsListening(false);
        const capturedDoubt = queryRef.current.trim();
        if (capturedDoubt) {
          // Check if speech was a platform voice command (e.g. "open quiz", "bhojpuri", "dark mode")
          const voiceCmd = parseVoiceCommand(capturedDoubt);
          if (voiceCmd) {
            voiceCommand.executeCommandManually(voiceCmd);
            setVoiceStatus(`COMMAND: ${voiceCmd.commandLabel}`);
            setTimeout(() => setVoiceStatus('IDLE'), 3000);
          } else {
            handleSolveDoubt(capturedDoubt);
          }
        } else {
          setVoiceStatus('IDLE');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Failed to start speech recognition:", err);
      setIsListening(false);
      setVoiceStatus('IDLE');
    }
  };

  // Submit typed doubt in AI chat
  const handleSendTypedQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const query = userQueryText.trim();
    if (!query) return;

    setUserQueryText('');
    handleSolveDoubt(query);
  };

  // Comprehensive Focus Management & Keyboard Accessibility System
  const toolContainerRef = useRef<HTMLDivElement>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const accessButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const shortcutsButtonRef = useRef<HTMLButtonElement>(null);
  const toolNavButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const subToolButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const langOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isInitialMount = useRef(true);

  // Focus Management: Programmatically move focus to the newly activated tool container
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (toolContainerRef.current) {
      toolContainerRef.current.focus({ preventScroll: true });
      toolContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const toolNames: Record<LearningToolId, string> = {
      'ai-chat': 'Voice & Text AI Tutor Studio',
      'mock-interview': 'AI Mock Interviewer Practice Studio',
      'mind-maps': 'Interactive D3 Mind Map Knowledge Graph',
      'adaptive-quiz': 'Adaptive Curriculum Quiz Assessment',
      'flashcards': 'Spaced Repetition Study Flashcards',
      'diagram-explainer': 'Multimodal Diagram Vision AI Studio',
      'pdf-summarizer': 'Document & Notes AI Summarizer',
      'history': 'Activity & Query History Logs'
    };
    setScreenReaderAnnouncement(`Switched to ${toolNames[activeTool] || activeTool}. Main content focused.`);
  }, [activeTool]);

  // Focus Management: Auto-focus the active language option when dropdown opens
  useEffect(() => {
    if (isLangDropdownOpen) {
      const timer = setTimeout(() => {
        const activeIdx = availableLanguages.findIndex(l => l.id === selectedLanguage.id);
        if (activeIdx !== -1 && langOptionRefs.current[activeIdx]) {
          langOptionRefs.current[activeIdx]?.focus();
        } else if (langOptionRefs.current[0]) {
          langOptionRefs.current[0]?.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLangDropdownOpen, selectedLanguage.id]);

  // Comprehensive Keyboard Navigation & Shortcuts System
  const handleMicButtonClickRef = useRef(handleMicButtonClick);
  handleMicButtonClickRef.current = handleMicButtonClick;
  const activeToolRef = useRef(activeTool);
  activeToolRef.current = activeTool;
  const spacebarToTalkEnabledRef = useRef(spacebarToTalkEnabled);
  spacebarToTalkEnabledRef.current = spacebarToTalkEnabled;
  const isShortcutsOpenRef = useRef(isShortcutsOpen);
  isShortcutsOpenRef.current = isShortcutsOpen;
  const isLangDropdownOpenRef = useRef(isLangDropdownOpen);
  isLangDropdownOpenRef.current = isLangDropdownOpen;
  const isAccessMenuOpenRef = useRef(isAccessMenuOpen);
  isAccessMenuOpenRef.current = isAccessMenuOpen;
  const isSettingsOpenRef = useRef(isSettingsOpen);
  isSettingsOpenRef.current = isSettingsOpen;
  const isSpeakingRef = useRef(isSpeaking);
  isSpeakingRef.current = isSpeaking;
  const isListeningRef = useRef(isListening);
  isListeningRef.current = isListening;
  const selectedLanguageRef = useRef(selectedLanguage);
  selectedLanguageRef.current = selectedLanguage;
  const accessibilityRef = useRef(accessibility);
  accessibilityRef.current = accessibility;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (
        target.tagName?.toLowerCase() === 'input' ||
        target.tagName?.toLowerCase() === 'textarea' ||
        target.tagName?.toLowerCase() === 'select' ||
        target.isContentEditable ||
        Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
      );

      // --- 1. ESCAPE KEY (UNIVERSAL CANCEL / DISMISS & FOCUS RESTORATION) ---
      if (e.key === 'Escape') {
        if (isShortcutsOpenRef.current) {
          setIsShortcutsOpen(false);
          shortcutsButtonRef.current?.focus();
          setScreenReaderAnnouncement('Closed keyboard shortcuts dialog');
          return;
        }
        if (isLangDropdownOpenRef.current) {
          setIsLangDropdownOpen(false);
          langButtonRef.current?.focus();
          setScreenReaderAnnouncement('Closed language menu');
          return;
        }
        if (isAccessMenuOpenRef.current) {
          setIsAccessMenuOpen(false);
          accessButtonRef.current?.focus();
          setScreenReaderAnnouncement('Closed accessibility menu');
          return;
        }
        if (isSettingsOpenRef.current) {
          setIsSettingsOpen(false);
          settingsButtonRef.current?.focus();
          setScreenReaderAnnouncement('Closed settings menu');
          return;
        }
        if (isListeningRef.current) {
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (err) {}
          }
          setIsListening(false);
          setVoiceStatus('IDLE');
          setScreenReaderAnnouncement('Voice recognition stopped');
          return;
        }
        if (isSpeakingRef.current) {
          stopSpeech();
          setIsSpeaking(false);
          setVoiceStatus('IDLE');
          setScreenReaderAnnouncement('Audio reading stopped');
          return;
        }
        if (isInput) {
          target.blur();
          return;
        }
      }

      // --- 2. ALT MODIFIER SHORTCUTS (ACTIVE EVEN WHILE TYPING) ---
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        // Alt + V: Toggle Voice Input
        if (e.code === 'KeyV') {
          e.preventDefault();
          if (activeToolRef.current !== 'ai-chat') {
            setActiveTool('ai-chat');
          }
          handleMicButtonClickRef.current();
          setScreenReaderAnnouncement('Voice input toggled via shortcut');
          return;
        }

        // Alt + S: Stop Speech Audio
        if (e.code === 'KeyS') {
          e.preventDefault();
          stopSpeech();
          setIsSpeaking(false);
          setVoiceStatus('IDLE');
          setScreenReaderAnnouncement('Audio playback stopped');
          return;
        }

        // Alt + R: Replay Last Voice Explanation
        if (e.code === 'KeyR') {
          e.preventDefault();
          const textToReplay = lastSpokenTextRef.current || selectedLanguageRef.current.sampleResponse;
          if (textToReplay) {
            stopSpeech();
            setIsSpeaking(true);
            setVoiceStatus('EXPLAINING...');
            speakText(textToReplay, selectedLanguageRef.current.code || 'hi-IN', accessibilityRef.current.speechSpeed, () => {
              setIsSpeaking(false);
              setVoiceStatus('IDLE');
            });
            setScreenReaderAnnouncement('Replaying voice explanation');
          }
          return;
        }

        // Alt + T: Toggle Dark / Light Theme
        if (e.code === 'KeyT') {
          e.preventDefault();
          toggleTheme();
          setScreenReaderAnnouncement('Theme toggled');
          return;
        }

        // Alt + L: Open / Close Language Selector
        if (e.code === 'KeyL') {
          e.preventDefault();
          setIsLangDropdownOpen(prev => !prev);
          setIsAccessMenuOpen(false);
          setIsSettingsOpen(false);
          return;
        }

        // Alt + A: Open / Close Accessibility Menu
        if (e.code === 'KeyA') {
          e.preventDefault();
          setIsAccessMenuOpen(prev => !prev);
          setIsLangDropdownOpen(false);
          setIsSettingsOpen(false);
          return;
        }

        // Alt + F: Toggle Fullscreen Mode
        if (e.code === 'KeyF') {
          e.preventDefault();
          toggleFullscreen();
          return;
        }

        // Alt + G: Open Google Sign In or User Account Menu
        if (e.code === 'KeyG') {
          e.preventDefault();
          const signInBtn = document.getElementById('google-sign-in-btn') as HTMLButtonElement | null;
          const profileBtn = document.getElementById('user-profile-menu-btn') as HTMLButtonElement | null;
          if (signInBtn) signInBtn.click();
          else if (profileBtn) profileBtn.click();
          return;
        }

        // Alt + /: Open / Close Keyboard Shortcuts Cheat-sheet
        if (e.code === 'Slash') {
          e.preventDefault();
          setIsShortcutsOpen(prev => !prev);
          return;
        }

        // Alt + C: Focus Doubt Input Box
        if (e.code === 'KeyC') {
          e.preventDefault();
          if (activeToolRef.current !== 'ai-chat') {
            setActiveTool('ai-chat');
          }
          setTimeout(() => chatInputRef.current?.focus(), 50);
          setScreenReaderAnnouncement('Focused doubt input box');
          return;
        }

        // Alt + C: Toggle Voice Command Navigator Bar
        if (e.code === 'KeyC') {
          e.preventDefault();
          toggleVoiceCommandBar();
          setScreenReaderAnnouncement('Voice commands navigator toggled');
          return;
        }

        // Alt + LeftArrow: Return to Voice AI Chat
        if (e.code === 'ArrowLeft') {
          e.preventDefault();
          setActiveTool('ai-chat');
          setScreenReaderAnnouncement('Returned to Voice AI Tutor');
          return;
        }

        // Alt + 1 through Alt + 7: Jump Directly to Tool
        const digitTools: Record<string, { id: LearningToolId; name: string }> = {
          'Digit1': { id: 'ai-chat', name: 'Voice AI Tutor' },
          'Digit2': { id: 'mock-interview', name: 'WebRTC Mock Interviewer' },
          'Digit3': { id: 'mind-maps', name: 'D3 Mind Maps' },
          'Digit4': { id: 'adaptive-quiz', name: 'Adaptive Quiz' },
          'Digit5': { id: 'flashcards', name: 'Interactive Flashcards' },
          'Digit6': { id: 'diagram-explainer', name: 'Diagram Vision AI' },
          'Digit7': { id: 'history', name: 'Activity History & Logs' }
        };
        if (digitTools[e.code]) {
          e.preventDefault();
          const targetTool = digitTools[e.code];
          setActiveTool(targetTool.id);
          setScreenReaderAnnouncement(`Switched to ${targetTool.name}`);
          return;
        }
      }

      // --- 3. STANDARD SHORTCUTS (ONLY WHEN NOT TYPING IN INPUT FIELDS) ---
      if (isInput) return;

      // Question mark '?' or Shift + '/' opens Keyboard Shortcuts Modal
      if (e.key === '?' || (e.shiftKey && e.code === 'Slash')) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
        return;
      }

      // Forward Slash '/' directly focuses chat input field
      if (e.key === '/' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        if (activeToolRef.current !== 'ai-chat') {
          setActiveTool('ai-chat');
        }
        setTimeout(() => chatInputRef.current?.focus(), 50);
        setScreenReaderAnnouncement('Focused doubt input box');
        return;
      }

      // Number keys 1-7 directly jump to tools without modifiers
      const directTools: Record<string, { id: LearningToolId; name: string }> = {
        'Digit1': { id: 'ai-chat', name: 'Voice AI Tutor' },
        'Digit2': { id: 'mock-interview', name: 'WebRTC Mock Interviewer' },
        'Digit3': { id: 'mind-maps', name: 'D3 Mind Maps' },
        'Digit4': { id: 'adaptive-quiz', name: 'Adaptive Quiz' },
        'Digit5': { id: 'flashcards', name: 'Interactive Flashcards' },
        'Digit6': { id: 'diagram-explainer', name: 'Diagram Vision AI' },
        'Digit7': { id: 'history', name: 'Activity History & Logs' }
      };
      if (directTools[e.code] && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const targetTool = directTools[e.code];
        setActiveTool(targetTool.id);
        setScreenReaderAnnouncement(`Switched to ${targetTool.name}`);
        return;
      }

      // Spacebar to trigger Voice Input (Microphone on/off)
      if (e.code === 'Space' && !e.repeat) {
        if (!spacebarToTalkEnabledRef.current) return;
        e.preventDefault();
        setIsSpacePressed(true);

        // If currently on another tool, smoothly switch to Voice AI Tutor stage
        if (activeToolRef.current !== 'ai-chat') {
          setActiveTool('ai-chat');
        }
        handleMicButtonClickRef.current();
        setScreenReaderAnnouncement('Voice input toggled via spacebar');
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className={`w-full transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-[999] w-screen h-screen min-h-screen overflow-y-auto m-0 p-0 sm:p-2 bg-slate-950/50 backdrop-blur-md' 
        : 'w-full min-h-screen px-2 sm:px-4 lg:px-6 py-2 sm:py-3'
    }`}>
      {/* Comprehensive Screen Reader & Keyboard Skip Navigation Links */}
      <nav className="skip-nav-container" aria-label="Skip navigation links">
        <a href="#chat-input-box" className="skip-link">
          Skip to Ask Doubt (/ or Tab) • सवाल पूछने पर जाएं
        </a>
        <a href="#learning-tools-nav" className="skip-link">
          Skip to Learning Tools (Keys 1-7) • टूल्स नेविगेशन पर जाएं
        </a>
        <a href="#main-dashboard-content" className="skip-link">
          Skip to Main Content • मुख्य सामग्री पर जाएं
        </a>
        <a href="#adaptive-mastery-dashboard-section" className="skip-link">
          Skip to Curriculum Progress • प्रगति रिपोर्ट पर जाएं
        </a>
        <button 
          type="button"
          onClick={() => setIsShortcutsOpen(true)}
          className="skip-link cursor-pointer text-left"
        >
          View Keyboard Shortcuts (?)
        </button>
      </nav>

      {/* Accessible Screen Reader Announcements Live Region */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {screenReaderAnnouncement}
      </div>

      {/* Outer Dashboard Container */}
      <div 
        id="main-dashboard-content"
        ref={toolContainerRef}
        tabIndex={-1}
        className={`w-full transition-all duration-300 focus:outline-none ${
        isFullscreen 
          ? 'min-h-screen rounded-none sm:rounded-2xl p-3 sm:p-6 lg:p-8 flex flex-col justify-between shadow-2xl border-0 sm:border' 
          : 'min-h-[calc(100vh-1.5rem)] rounded-[24px] sm:rounded-[36px] p-3 sm:p-6 lg:p-8 flex flex-col justify-between shadow-[0_20px_50px_-15px_rgba(249,115,22,0.08)] border'
      } ${
        isDarkMode
          ? 'bg-[#0b0f19] text-white border-slate-800'
          : 'bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-slate-50/60 border-orange-100/80 text-slate-900'
      }`}>
        
        {/* TOP HEADER BAR */}
        <header className="flex flex-wrap items-center justify-between gap-y-3 gap-x-2 pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-orange-100/60 dark:border-slate-800/80 relative z-50 animate-slide-up animation-delay-75 w-full">
          {/* Brand Logo */}
          <button 
            type="button"
            onClick={() => setActiveTool('ai-chat')}
            aria-label={`${t.appName} Home - Return to Voice AI Tutor (Press 1 or Alt+1)`}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 rounded-2xl p-1 -m-1 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none text-left"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl sm:text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.appName}
              </span>
            </div>
          </button>

          {/* Right Header Controls: Shortcuts, Language Dropdown, History Button, Accessibility, Settings */}
          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-full">
            {/* PWA Install Button for Offline Learning */}
            <PWAInstallButton />

            {/* Voice Commands System Toggle Button (Web Speech API) */}
            <button
              id="header-voice-commands-btn"
              type="button"
              onClick={toggleVoiceCommandBar}
              title={`${t.voiceCommands || 'Voice Commands'} (Web Speech API • Press Alt+C)`}
              aria-label={t.voiceCommands || 'Voice Commands'}
              className={`flex items-center gap-1.5 h-8.5 sm:h-9 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl border text-xs font-bold transition-all shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none ${
                isVoiceCommandBarOpen || voiceCommand.isListening
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600 shadow-orange-200 dark:shadow-none'
                  : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-orange-300'
              }`}
            >
              <Mic className={`w-3.5 h-3.5 ${isVoiceCommandBarOpen || voiceCommand.isListening ? 'text-white animate-bounce' : 'text-[#ea580c]'}`} />
              <span className="hidden xl:inline">{t.voiceCommands || 'Voice Commands'}</span>
              <span className="hidden sm:inline xl:hidden">Voice</span>
              {voiceCommand.isListening ? (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              ) : (
                <kbd className="hidden 2xl:inline px-1 py-0.5 text-[9px] font-mono bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500 dark:text-slate-300">Alt+C</kbd>
              )}
            </button>

            {/* Keyboard Shortcuts Guide Button */}
            <button
              ref={shortcutsButtonRef}
              id="header-shortcuts-btn"
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              title={`${shortcutsLoc.title} (Press ? or Alt+/)`}
              aria-label={shortcutsLoc.title}
              className="flex items-center gap-1 h-8.5 sm:h-9 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-orange-300 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#ea580c] transition-all shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
            >
              <Keyboard className="w-3.5 h-3.5 text-[#ea580c]" />
              <span className="hidden xl:inline">{shortcutsLoc.headerBtnLabel || 'Shortcuts'}</span>
              <kbd className="hidden sm:inline px-1 py-0.5 text-[9px] font-mono bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400">?</kbd>
            </button>

            {/* Quick History Button in Header */}
            <button
              id="header-history-btn"
              type="button"
              onClick={() => setActiveTool('history')}
              title="View History & Database Logs (Press 7 or Alt+7)"
              aria-label="View History & Database Logs (Press 7)"
              className={`flex items-center gap-1.5 h-8.5 sm:h-9 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl border text-xs font-bold transition-all shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none ${
                activeTool === 'history'
                  ? 'bg-orange-100 dark:bg-orange-950/60 text-[#ea580c] dark:text-orange-400 border-[#ea580c]'
                  : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-orange-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
              <span className="hidden xl:inline">{t.historyLogs}</span>
              <span className="hidden sm:inline xl:hidden">History</span>
              <kbd className="hidden 2xl:inline px-1 py-0.5 text-[9px] font-mono bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400">7</kbd>
            </button>

            {/* Language Selector Pill */}
            <div className="relative">
              <button
                ref={langButtonRef}
                id="header-language-pill"
                type="button"
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsAccessMenuOpen(false);
                  setIsSettingsOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={isLangDropdownOpen}
                aria-controls="language-dropdown-menu"
                className="flex items-center gap-1.5 h-8.5 sm:h-9 px-2.5 sm:px-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-orange-300 text-xs text-slate-700 dark:text-slate-200 shadow-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
                title={`Active Language: ${selectedLanguage.name} (Press Alt+L)`}
                aria-label={`Active Language: ${selectedLanguage.name}`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 hidden xl:inline">
                  {t.languageLabel}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-100 max-w-[80px] sm:max-w-[110px] truncate">
                  {selectedLanguage.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown Menu */}
              {isLangDropdownOpen && (
                <div 
                  id="language-dropdown-menu"
                  role="listbox"
                  aria-label="Select Active Language & Dialect"
                  className="absolute right-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-[100] animate-fade-in max-h-80 overflow-y-auto"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Select Active Language & Dialect
                  </div>
                  {availableLanguages.map((lang, idx) => (
                    <button
                      key={lang.id}
                      ref={(el) => { langOptionRefs.current[idx] = el; }}
                      type="button"
                      role="option"
                      aria-selected={selectedLanguage.id === lang.id}
                      onClick={() => {
                        stopSpeech();
                        setIsSpeaking(false);
                        setSelectedLanguage(lang);
                        setIsLangDropdownOpen(false);
                        langButtonRef.current?.focus();
                        setScreenReaderAnnouncement(`Language changed to ${lang.name}`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          const next = (idx + 1) % availableLanguages.length;
                          langOptionRefs.current[next]?.focus();
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          const prev = (idx - 1 + availableLanguages.length) % availableLanguages.length;
                          langOptionRefs.current[prev]?.focus();
                        } else if (e.key === 'Escape') {
                          e.preventDefault();
                          setIsLangDropdownOpen(false);
                          langButtonRef.current?.focus();
                        }
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-orange-50/70 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 outline-none cursor-pointer ${
                        selectedLanguage.id === lang.id ? 'bg-orange-50 dark:bg-orange-950/50 text-[#ea580c] font-bold' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{lang.name}</span>
                        <span className="text-[10px] text-slate-400">{lang.region}</span>
                      </div>
                      {selectedLanguage.id === lang.id && <Check className="w-4 h-4 text-[#ea580c]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accessibility Eye Icon Button */}
            <div className="relative">
              <button
                ref={accessButtonRef}
                id="header-accessibility-btn"
                type="button"
                onClick={() => {
                  setIsAccessMenuOpen(!isAccessMenuOpen);
                  setIsLangDropdownOpen(false);
                  setIsSettingsOpen(false);
                }}
                aria-haspopup="dialog"
                aria-expanded={isAccessMenuOpen}
                aria-controls="accessibility-menu-popover"
                title="Neurodivergent & Low-Vision Accessibility (OpenDyslexic, Bionic, High-Contrast • Press Alt+A)"
                aria-label="Reading Ergonomics & Accessibility"
                className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none ${
                  accessibility.bionicReading || accessibility.openDyslexic || accessibility.highContrast
                    ? 'border-[#ea580c] text-[#ea580c] bg-orange-50/50 dark:bg-orange-950/40'
                    : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Accessibility Popover */}
              {isAccessMenuOpen && (
                <div 
                  id="accessibility-menu-popover"
                  role="dialog"
                  aria-label="Reading Ergonomics & Accessibility"
                  className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-[100] animate-fade-in space-y-3"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                    <span>{t.readingErgonomics}</span>
                    <span className="text-[10px] text-orange-600 font-bold uppercase">Accessibility</span>
                  </div>

                  {/* Bionic toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t.bionicReading}</div>
                      <div className="text-[10px] text-slate-400">{t.bionicSub}</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={accessibility.bionicReading}
                      aria-label="Toggle Bionic Reading Mode"
                      onClick={() => setAccessibility(a => ({ ...a, bionicReading: !a.bionicReading }))}
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 outline-none cursor-pointer ${
                        accessibility.bionicReading ? 'bg-[#ea580c]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                        accessibility.bionicReading ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* OpenDyslexic toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t.openDyslexic}</div>
                      <div className="text-[10px] text-slate-400">{t.openDyslexicSub}</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={accessibility.openDyslexic}
                      aria-label="Toggle OpenDyslexic Font"
                      onClick={() => setAccessibility(a => ({ ...a, openDyslexic: !a.openDyslexic }))}
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 outline-none cursor-pointer ${
                        accessibility.openDyslexic ? 'bg-[#ea580c]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                        accessibility.openDyslexic ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* High-Contrast toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">High-Contrast Mode</div>
                      <div className="text-[10px] text-slate-400">Pure black with #FFFF00 yellow text</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={accessibility.highContrast}
                      aria-label="Toggle High-Contrast Mode"
                      onClick={() => setAccessibility(a => ({ ...a, highContrast: !a.highContrast }))}
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-yellow-400 outline-none cursor-pointer ${
                        accessibility.highContrast ? 'bg-yellow-400' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`bg-slate-950 w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                        accessibility.highContrast ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Fluid AI Cursor toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Fluid AI Cursor</div>
                      <div className="text-[10px] text-slate-400">Orbital aura ring & click waves</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={accessibility.customCursor !== false}
                      aria-label="Toggle Fluid AI Cursor"
                      onClick={() => setAccessibility(a => ({ ...a, customCursor: a.customCursor === false }))}
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 outline-none cursor-pointer ${
                        accessibility.customCursor !== false ? 'bg-[#ea580c]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                        accessibility.customCursor !== false ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Gear Icon Button */}
            <div className="relative">
              <button
                ref={settingsButtonRef}
                id="header-settings-btn"
                type="button"
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setIsLangDropdownOpen(false);
                  setIsAccessMenuOpen(false);
                }}
                aria-haspopup="dialog"
                aria-expanded={isSettingsOpen}
                aria-controls="settings-menu-popover"
                title="Voice & Platform Settings (Press Alt+S)"
                aria-label="Voice & Platform Settings"
                className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Settings Popover */}
              {isSettingsOpen && (
                <div 
                  id="settings-menu-popover"
                  role="dialog"
                  aria-label="Voice & Platform Settings"
                  className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-[100] animate-fade-in space-y-3"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                    {t.speechRate}
                  </div>

                  <div>
                    <label htmlFor="speech-speed-slider" className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                      Speech Speed: {accessibility.speechSpeed}x
                    </label>
                    <input
                      id="speech-speed-slider"
                      type="range"
                      min="0.75"
                      max="1.5"
                      step="0.25"
                      value={accessibility.speechSpeed}
                      aria-label="Voice speech speed"
                      onChange={(e) => setAccessibility(a => ({ ...a, speechSpeed: parseFloat(e.target.value) }))}
                      className="w-full accent-[#ea580c] focus-visible:ring-2 focus-visible:ring-orange-500 outline-none"
                    />
                  </div>

                  {/* Spacebar to Speak Toggle Option */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Spacebar to Speak</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-400">Press Space on laptop to start mic</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={spacebarToTalkEnabled}
                      aria-label="Toggle Spacebar to Speak"
                      onClick={handleToggleSpacebarTalk}
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 outline-none ${
                        spacebarToTalkEnabled ? 'bg-[#ea580c]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                        spacebarToTalkEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Adaptive Mastery & Progress Ring Widget (Dynamically based on real student performance & history) */}
            <button 
              type="button"
              id="header-mastery-progress-btn"
              onClick={() => {
                if (activeTool !== 'ai-chat') setActiveTool('ai-chat');
                setTimeout(() => {
                  const el = document.getElementById('adaptive-mastery-dashboard-section') || document.getElementById('learning-modules-progress-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                  (el as HTMLElement)?.focus?.();
                }, 100);
              }}
              title={`Adaptive Topic Mastery: ${progressStats.completedTopicsCount}/${progressStats.totalTopics} Topics Done (${progressStats.overallPercentage}% overall curriculum progress) - Click to view detailed analysis`}
              aria-label={`Adaptive Topic Mastery: ${progressStats.completedTopicsCount} of ${progressStats.totalTopics} Topics Done, ${progressStats.overallPercentage}% overall curriculum progress. Click to view detailed analysis.`}
              className="hidden lg:flex items-center gap-2 h-8.5 sm:h-9 px-2.5 py-1 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs cursor-pointer hover:border-orange-300 dark:hover:border-orange-500/50 transition-all select-none shrink-0 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
            >
              <CircularProgressRing
                id="header-progress-ring"
                progress={progressStats.overallPercentage}
                size={24}
                strokeWidth={3}
                color={progressStats.overallPercentage >= 80 ? '#10b981' : progressStats.overallPercentage >= 40 ? '#ea580c' : '#f59e0b'}
                showPercentageText={false}
                showCheckmarkWhenComplete={progressStats.completedTopicsCount === progressStats.totalTopics && progressStats.totalTopics > 0}
                isDarkMode={isDarkMode}
              />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider leading-none">
                  Mastery
                </span>
                <span className="text-[11px] font-black text-slate-800 dark:text-slate-100 leading-tight">
                  {progressStats.completedTopicsCount}/{progressStats.totalTopics}
                </span>
              </div>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-orange-300 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Google Authentication (Sign In with Google / Account Profile) - Left of Full Screen Option */}
            <GoogleAuthButton isDarkMode={isDarkMode} />

            {/* Full Screen Toggle Button */}
            <button
              id="fullscreen-toggle-btn"
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
              title={isFullscreen ? "Exit Full Screen (पूरा स्क्रीन बंद करें / Esc)" : "Full Screen Mode (पूरा स्क्रीन करें)"}
              className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none ${
                isFullscreen 
                  ? 'bg-orange-500 text-white border-orange-600 shadow-orange-500/25 scale-105' 
                  : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:border-orange-300 text-slate-700 dark:text-slate-200 hover:text-[#ea580c]'
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 animate-pulse" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* CONDITIONAL TOOL ROUTING: CLEAN DISCRETE VIEWS                       */}
        {/* ==================================================================== */}

        {/* Persistent Keyboard-Friendly Navigation Breadcrumb when in Sub-Tools */}
        {activeTool !== 'ai-chat' && (
          <nav 
            aria-label="Sub-tool Navigation" 
            className="mb-4 flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setActiveTool('ai-chat')}
              aria-label="Back to Voice AI Tutor Studio (Press 1 or Alt+1)"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs bg-orange-50 dark:bg-orange-950/50 text-[#ea580c] dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 hover:bg-[#ea580c] hover:text-white transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Back to Voice AI Tutor</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-700/50 text-orange-800 dark:text-orange-200">1</kbd>
            </button>

            <div 
              role="tablist"
              aria-label="Switch Learning Tool"
              className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5"
            >
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 hidden md:inline mr-1" id="subtool-switch-label">Switch:</span>
              {[
                { id: 'mock-interview' as LearningToolId, label: 'Interview', keyNum: '2', title: 'Mock Interviewer (Press 2)' },
                { id: 'mind-maps' as LearningToolId, label: 'Mind Map', keyNum: '3', title: 'Mind Maps (Press 3)' },
                { id: 'adaptive-quiz' as LearningToolId, label: 'Quiz', keyNum: '4', title: 'Adaptive Quiz (Press 4)' },
                { id: 'flashcards' as LearningToolId, label: 'Cards', keyNum: '5', title: 'Flashcards (Press 5)' },
                { id: 'diagram-explainer' as LearningToolId, label: 'Diagram', keyNum: '6', title: 'Diagram AI (Press 6)' },
                { id: 'history' as LearningToolId, label: 'History', keyNum: '7', title: 'History & Logs (Press 7)' }
              ].map((subItem, sIdx, allSubItems) => (
                <button 
                  key={subItem.id}
                  ref={(el) => { subToolButtonsRef.current[sIdx] = el; }}
                  type="button"
                  role="tab"
                  aria-selected={activeTool === subItem.id}
                  onClick={() => setActiveTool(subItem.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      const next = (sIdx + 1) % allSubItems.length;
                      subToolButtonsRef.current[next]?.focus();
                    } else if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      const prev = (sIdx - 1 + allSubItems.length) % allSubItems.length;
                      subToolButtonsRef.current[prev]?.focus();
                    }
                  }}
                  title={subItem.title}
                  aria-label={`${subItem.label} (Press ${subItem.keyNum})`}
                  className={`px-2.5 py-1 rounded-xl font-semibold text-[11px] border transition-all cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-orange-500 outline-none ${
                    activeTool === subItem.id 
                      ? 'bg-[#ea580c] text-white border-orange-600 shadow-sm ring-1 ring-orange-400' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300'
                  }`}
                >
                  <span>{subItem.label}</span>
                  <kbd className="px-1 text-[9px] font-mono opacity-80">{subItem.keyNum}</kbd>
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* 1. MOCK INTERVIEWER SECTION */}
        {activeTool === 'mock-interview' && (
          <div className="animate-slide-up">
            <MockInterviewerSection
              selectedLanguage={selectedLanguage}
              accessibility={accessibility}
              onBackToChat={() => setActiveTool('ai-chat')}
            />
          </div>
        )}

        {/* 2. D3 MIND MAPS SECTION */}
        {activeTool === 'mind-maps' && (
          <div className="animate-slide-up">
            <MindMapSection
              selectedLanguage={selectedLanguage}
              accessibility={accessibility}
              onNavigateToHistory={() => setActiveTool('history')}
            />
          </div>
        )}

        {/* 3. STUDY TOOLS: QUIZZES & FLASHCARDS */}
        {(activeTool === 'adaptive-quiz' || activeTool === 'flashcards') && (
          <div className="animate-slide-up">
            <StudyToolsSection
              selectedLanguage={selectedLanguage}
              accessibility={accessibility}
              initialMode={activeTool === 'flashcards' ? 'flashcards' : 'quiz'}
              initialTopic={selectedTopicForStudy}
              onNavigateToHistory={() => setActiveTool('history')}
            />
          </div>
        )}

        {/* 4. DIAGRAM VISION AI EXPLAINER */}
        {activeTool === 'diagram-explainer' && (
          <div className="animate-slide-up">
            <DiagramVisionSection
              selectedLanguage={selectedLanguage}
              accessibility={accessibility}
              onNavigateToHistory={() => setActiveTool('history')}
            />
          </div>
        )}

        {/* 5. HISTORY & PERSISTENT DATABASE LOGS */}
        {activeTool === 'history' && (
          <div className="animate-slide-up">
            <HistoryDashboardSection
              selectedLanguage={selectedLanguage}
              onNavigateToTool={(toolId) => setActiveTool(toolId)}
            />
          </div>
        )}

        {/* 6. PRIMARY VOICE AI CHATBOT & LEARNING STAGE */}
        {activeTool === 'ai-chat' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* COLUMN 1: LEFT SIDEBAR - LEARNING TOOLS NAVIGATION */}
            <aside className="lg:col-span-3 space-y-4 animate-slide-up animation-delay-150">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                <span>{t.learningTools}</span>
                <span className="text-[10px] font-mono lowercase opacity-70">keys [1-7]</span>
              </div>

              <nav id="learning-tools-nav" role="tablist" aria-orientation="vertical" className="space-y-2" aria-label="Learning Tools Sidebar">
                {/* Tool 1: Voice AI Chat */}
                <button
                  ref={(el) => { toolNavButtonsRef.current[0] = el; }}
                  id="tool-voice-chat-btn"
                  type="button"
                  role="tab"
                  aria-selected={activeTool === 'ai-chat'}
                  onClick={() => setActiveTool('ai-chat')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      toolNavButtonsRef.current[1]?.focus();
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      toolNavButtonsRef.current[6]?.focus();
                    }
                  }}
                  aria-keyshortcuts="1"
                  title="Voice AI Chat (Press 1 or Alt+1)"
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white shadow-lg shadow-orange-500/25 scale-[1.01] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-white" />
                    <span>{t.voiceAiChat}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/20 text-white border border-white/30">1</kbd>
                </button>

                {/* Tool 2: Dedicated Mock Interviewer Button */}
                <button
                  ref={(el) => { toolNavButtonsRef.current[1] = el; }}
                  id="tool-mock-interviewer-nav-btn"
                  type="button"
                  role="tab"
                  aria-selected={activeTool === 'mock-interview'}
                  onClick={() => setActiveTool('mock-interview')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      toolNavButtonsRef.current[2]?.focus();
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      toolNavButtonsRef.current[0]?.focus();
                    }
                  }}
                  aria-keyshortcuts="2"
                  title="Mock Interviewer (Press 2 or Alt+2)"
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/90 hover:bg-white text-slate-800 border-2 border-orange-200 hover:border-[#ea580c] shadow-sm transition-all group cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-[#ea580c] group-hover:scale-110 transition-transform" />
                    <span className="font-bold">{t.mockInterviewer}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-[#ea580c] text-[10px] font-bold">
                      WebRTC
                    </span>
                    <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">2</kbd>
                  </div>
                </button>

                {/* Tool 3: D3 Mind Maps */}
                <button
                  ref={(el) => { toolNavButtonsRef.current[2] = el; }}
                  id="tool-mind-maps-btn"
                  type="button"
                  role="tab"
                  aria-selected={activeTool === 'mind-maps'}
                  onClick={() => setActiveTool('mind-maps')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      toolNavButtonsRef.current[3]?.focus();
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      toolNavButtonsRef.current[1]?.focus();
                    }
                  }}
                  aria-keyshortcuts="3"
                  title="D3 Mind Maps (Press 3 or Alt+3)"
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/90 hover:bg-white text-slate-700 border border-slate-200/60 shadow-sm hover:border-orange-200 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <GitFork className="w-5 h-5 text-slate-500" />
                    <span>{t.mindMaps}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">3</kbd>
                </button>

                {/* Tool 4: Adaptive Quiz */}
                <button
                  ref={(el) => { toolNavButtonsRef.current[3] = el; }}
                  id="tool-adaptive-quiz-btn"
                  type="button"
                  role="tab"
                  aria-selected={activeTool === 'adaptive-quiz'}
                  onClick={() => setActiveTool('adaptive-quiz')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      toolNavButtonsRef.current[4]?.focus();
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      toolNavButtonsRef.current[2]?.focus();
                    }
                  }}
                  aria-keyshortcuts="4"
                  title="Adaptive Quiz (Press 4 or Alt+4)"
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/90 hover:bg-white text-slate-700 border border-slate-200/60 shadow-sm hover:border-orange-200 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-5 h-5 text-slate-500" />
                    <span>{t.adaptiveQuiz}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">4</kbd>
                </button>

                {/* Tool 5: Flashcards */}
                <button
                  ref={(el) => { toolNavButtonsRef.current[4] = el; }}
                  id="tool-flashcards-btn"
                  type="button"
                  role="tab"
                  aria-selected={activeTool === 'flashcards'}
                  onClick={() => setActiveTool('flashcards')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      toolNavButtonsRef.current[5]?.focus();
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      toolNavButtonsRef.current[3]?.focus();
                    }
                  }}
                  aria-keyshortcuts="5"
                  title="Interactive Flashcards (Press 5 or Alt+5)"
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/90 hover:bg-white text-slate-700 border border-slate-200/60 shadow-sm hover:border-orange-200 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-slate-500" />
                    <span>{t.flashcards}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">5</kbd>
                </button>

                {/* Tool 6: Diagram Vision AI Explainer */}
                <button
                  ref={(el) => { toolNavButtonsRef.current[5] = el; }}
                  id="tool-diagram-explainer-btn"
                  type="button"
                  role="tab"
                  aria-selected={activeTool === 'diagram-explainer'}
                  onClick={() => setActiveTool('diagram-explainer')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      toolNavButtonsRef.current[6]?.focus();
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      toolNavButtonsRef.current[4]?.focus();
                    }
                  }}
                  aria-keyshortcuts="6"
                  title="Diagram Vision AI (Press 6 or Alt+6)"
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/90 hover:bg-white text-slate-700 border border-slate-200/60 shadow-sm hover:border-orange-200 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-slate-500" />
                    <span>{t.diagramExplainer}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">6</kbd>
                </button>

                {/* Tool 7: Activity History */}
                <button
                  ref={(el) => { toolNavButtonsRef.current[6] = el; }}
                  id="tool-history-btn"
                  type="button"
                  role="tab"
                  aria-selected={activeTool === 'history'}
                  onClick={() => setActiveTool('history')}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      toolNavButtonsRef.current[0]?.focus();
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      toolNavButtonsRef.current[5]?.focus();
                    }
                  }}
                  aria-keyshortcuts="7"
                  title="Activity History (Press 7 or Alt+7)"
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/90 hover:bg-white text-slate-700 border border-slate-200/60 shadow-sm hover:border-orange-200 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-500" />
                    <span>{t.historyLogs}</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">7</kbd>
                </button>
              </nav>

              {/* Dialect Quick Preview in Left Sidebar */}
              <div className={`pt-3.5 px-3.5 py-3 rounded-2xl border transition-all space-y-2 shadow-sm ${
                isDarkMode 
                  ? 'bg-slate-800/90 border-slate-700 text-slate-100' 
                  : 'bg-white border-orange-200/80 text-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    Active Dialect Voice
                  </span>
                  <span className="text-[10px] font-bold text-[#ea580c] dark:text-orange-300 bg-orange-100/80 dark:bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800/50">
                    {selectedLanguage.name.split(' ')[0]}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 italic min-h-[48px] leading-relaxed p-2.5 rounded-xl bg-orange-50/70 dark:bg-slate-900/80 border border-orange-200/70 dark:border-slate-700/80 shadow-inner flex items-center">
                  <Typewriter
                    key={`sidebar-typewriter-${selectedLanguage.id}`}
                    options={{
                      strings: sidebarTypewriterStrings,
                      autoStart: true,
                      loop: true,
                      delay: 45,
                      deleteSpeed: 20
                    }}
                  />
                </div>
                <button
                  onClick={() => speakText(selectedLanguage.sampleResponse, selectedLanguage.code || 'hi-IN', accessibility.speechSpeed)}
                  className="text-xs text-[#ea580c] dark:text-orange-400 font-bold hover:underline flex items-center gap-1.5 cursor-pointer pt-0.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#ea580c] dark:text-orange-400" />
                  <span>Hear Dialect Sample</span>
                </button>
              </div>
            </aside>

            {/* COLUMN 2: CENTER HERO CARD & WORKSPACE (EXPANDED TO 9 COLS FOR WIDE, COMFORTABLE VIEW) */}
            <main className="lg:col-span-9 space-y-6 animate-slide-up animation-delay-300">
              <div className={`rounded-[28px] sm:rounded-[36px] border transition-all p-6 sm:p-8 text-center relative overflow-hidden min-h-[480px] flex flex-col justify-between ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 shadow-[0_12px_40px_-5px_rgba(0,0,0,0.4)] text-slate-100' 
                  : 'bg-white border-slate-100 shadow-[0_12px_40px_-5px_rgba(0,0,0,0.06)] text-slate-900'
              }`}>
                
                {/* Top Orange Strip Accent & Active Language Indicator */}
                <div className="flex flex-col items-center gap-1.5 mb-4">
                  <div className="w-32 h-1.5 bg-[#ea580c] rounded-full mx-auto" />
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 text-[10px] font-bold text-[#ea580c] dark:text-orange-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
                    <span>Active Voice: {selectedLanguage.name} ({selectedLanguage.code || 'hi-IN'})</span>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Concentric Circle Microphone Button - Strictly manual user trigger */}
                  <div className="relative flex items-center justify-center mx-auto my-1">
                    <div className={`w-36 h-36 rounded-full border transition-all flex items-center justify-center p-3 ${
                      isListening 
                        ? 'bg-rose-50 border-rose-300 scale-105 shadow-xl shadow-rose-500/20' 
                        : isSpeaking
                        ? 'bg-emerald-50 border-emerald-300 scale-105 shadow-xl shadow-emerald-500/20'
                        : isSolving
                        ? 'bg-amber-50 border-amber-300 scale-102 animate-pulse'
                        : 'bg-orange-50 border-orange-200/70 hover:scale-105'
                    }`}>
                      <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
                        isListening ? 'bg-rose-100' : isSpeaking ? 'bg-emerald-100' : isSolving ? 'bg-amber-100' : 'bg-orange-100/70'
                      }`}>
                        <button
                          id="center-mic-button"
                          onClick={handleMicButtonClick}
                          title={
                            isSpeaking 
                              ? "Click to stop speaking" 
                              : isListening 
                              ? "Listening... Click to stop and ask AI Tutor" 
                              : `Click to ask your doubt in ${selectedLanguage.name}`
                          }
                          className={`w-18 h-18 rounded-full text-white flex items-center justify-center shadow-lg transition-all cursor-pointer group active:scale-95 ${
                            isListening
                              ? 'bg-rose-600 shadow-rose-500/40 animate-pulse'
                              : isSpeaking
                              ? 'bg-emerald-600 shadow-emerald-500/40 hover:bg-emerald-700'
                              : isSolving
                              ? 'bg-amber-600 shadow-amber-500/40'
                              : 'bg-gradient-to-tr from-[#ea580c] to-[#f97316] shadow-orange-500/30 hover:scale-105'
                          }`}
                        >
                          {isListening ? (
                            <Square className="w-7 h-7 fill-white text-white" />
                          ) : isSpeaking ? (
                            <VolumeX className="w-7 h-7 text-white" />
                          ) : isSolving ? (
                            <RefreshCw className="w-7 h-7 text-white animate-spin" />
                          ) : (
                            <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Spacebar to Speak Quick Shortcut Badge & Toggle */}
                  <div className="flex items-center justify-center -mt-1 mb-1">
                    <button
                      type="button"
                      onClick={handleToggleSpacebarTalk}
                      title={spacebarToTalkEnabled ? "Click to disable Spacebar shortcut" : "Click to enable Spacebar shortcut"}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
                        spacebarToTalkEnabled
                          ? 'bg-orange-50 hover:bg-orange-100 text-orange-900 border-orange-200 shadow-xs dark:bg-orange-950/40 dark:hover:bg-orange-900/50 dark:text-orange-200 dark:border-orange-800/60'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 dark:border-slate-700'
                      }`}
                    >
                      <kbd className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded shadow-xs transition-all ${
                        isSpacePressed
                          ? 'bg-[#ea580c] text-white border-[#ea580c] scale-95 ring-2 ring-orange-300'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                      }`}>
                        Space
                      </kbd>
                      <span className="font-semibold">
                        {spacebarToTalkEnabled 
                          ? (isListening ? "Press Space to Finish" : isSpeaking ? "Press Space to Stop" : "Press Spacebar to Talk") 
                          : "Spacebar shortcut: Off"}
                      </span>
                      <span className={`w-2 h-2 rounded-full transition-colors ${
                        spacebarToTalkEnabled 
                          ? (isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse') 
                          : 'bg-slate-400'
                      }`} />
                    </button>
                  </div>

                  {/* Status Indicator & Live Audio Equalizer */}
                  {isListening && (
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-6 bg-rose-600 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-1.5 h-8 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-5 bg-rose-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="text-xs font-bold text-rose-600 ml-2 animate-pulse">
                        Listening in {selectedLanguage.name}... Click Mic when done!
                      </span>
                    </div>
                  )}

                  {isSpeaking && (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-700">
                        AI Tutor is explaining in {selectedLanguage.name} (Click Mic to Stop)
                      </span>
                    </div>
                  )}

                  {/* Main Bold Heading */}
                  <div className="space-y-1.5">
                    <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-snug font-serif italic ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {isListening 
                        ? `Listening to your doubt...`
                        : isSpeaking 
                        ? `Explaining in ${selectedLanguage.name}`
                        : isSolving
                        ? `AI Tutor Thinking...`
                        : t.greetingPrompt}
                    </h2>
                    <div className={`text-sm sm:text-base font-medium max-w-lg mx-auto leading-relaxed min-h-[2.75rem] flex items-center justify-center ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      {isListening ? (
                        <span>{userQueryText || "Speak your doubt clearly into your microphone..."}</span>
                      ) : (
                        <Typewriter
                          key={`hero-typewriter-${selectedLanguage.id}`}
                          options={{
                            strings: heroTypewriterStrings,
                            autoStart: true,
                            loop: true,
                            delay: 50,
                            deleteSpeed: 20
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Voice Processing / Progress Bar */}
                  <div className="max-w-xs mx-auto py-0.5">
                    <div className="flex items-center gap-3">
                      <div className={`flex-1 h-1 rounded-full overflow-hidden ${
                        isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
                      }`}>
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isListening
                              ? 'w-full bg-rose-500 animate-pulse'
                              : isSpeaking
                              ? 'w-full bg-emerald-500 animate-pulse'
                              : isSolving
                              ? 'w-3/4 bg-amber-500 animate-pulse'
                              : 'w-1/4 bg-[#ea580c]'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 font-mono shrink-0">
                        {voiceStatus}
                      </span>
                    </div>
                  </div>

                  {/* Quick Doubt Suggestion Chips (Always localized for active language) */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto pt-1">
                    <span className={`text-[10px] font-semibold shrink-0 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {selectedLanguage.nativeName} {t.greetingPrompt ? '•' : ''} Try asking:
                    </span>
                    {getLocalizedQuickDoubts(selectedLanguage.id).map((chip, idx) => (
                      <button
                        key={`lang-${selectedLanguage.id}-${idx}`}
                        type="button"
                        onClick={() => {
                          setUserQueryText(chip.query);
                          chatInputRef.current?.focus();
                        }}
                        className="px-2.5 py-1 rounded-full bg-orange-50/80 hover:bg-orange-100/90 text-orange-900 border border-orange-200/80 dark:bg-orange-950/40 dark:border-orange-800/60 dark:text-orange-200 dark:hover:bg-orange-900/50 text-[10px] font-medium transition-all cursor-pointer shadow-xs"
                        title={`Click to auto-fill: "${chip.query}"`}
                      >
                        {chip.label}
                      </button>
                    ))}
                    {recentQueries.length > 0 && (
                      recentQueries.slice(0, 2).map((query, idx) => (
                        <button
                          key={`recent-${idx}`}
                          type="button"
                          onClick={() => {
                            setUserQueryText(query);
                            chatInputRef.current?.focus();
                          }}
                          className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[9px] text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 transition-all cursor-pointer truncate max-w-[130px]"
                          title={`Recent search: "${query}"`}
                        >
                          🕒 {query}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Text input form for typing queries in addition to voice */}
                  <form onSubmit={handleSendTypedQuery} className="flex gap-2 max-w-md mx-auto">
                    <input
                      ref={chatInputRef}
                      type="text"
                      value={userQueryText}
                      onChange={(e) => setUserQueryText(e.target.value)}
                      placeholder={`Or type doubt in ${selectedLanguage.name}...`}
                      className={`flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border text-left font-medium transition-all focus:outline-none ${
                        isDarkMode
                          ? 'bg-slate-800/90 border-slate-700 text-white placeholder:text-slate-400 focus:bg-slate-900 focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20'
                      }`}
                      style={{
                        color: isDarkMode ? '#ffffff' : '#0f172a',
                        caretColor: '#ea580c'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isSolving}
                      className="px-4 py-2 bg-[#ea580c] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#c2410c] transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer shrink-0"
                      title="Send doubt to AI Tutor"
                    >
                      {isSolving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    </button>
                  </form>

                  {/* Bottom Split Insight Cards or Empty State */}
                  {currentConcept ? (
                    <div className="w-full pt-4 space-y-3">
                      {/* View Controls: Filter Tabs & Side-by-Side Indicator */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 pb-2 border-b border-slate-200/80 dark:border-slate-800 w-full text-xs">
                        {/* Left: Tab Selectors */}
                        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                          <button
                            type="button"
                            onClick={() => setCardsFilterTab('both')}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              cardsFilterTab === 'both'
                                ? 'bg-white dark:bg-slate-700 text-[#ea580c] shadow-sm font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                          >
                            <Columns className="w-3.5 h-3.5" />
                            <span>Both (Side-by-Side)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardsFilterTab('bionic')}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              cardsFilterTab === 'bionic'
                                ? 'bg-white dark:bg-slate-700 text-[#ea580c] shadow-sm font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5 text-orange-500" />
                            <span>Bionic Focus</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCardsFilterTab('tutor')}
                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                              cardsFilterTab === 'tutor'
                                ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm font-bold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5 text-sky-500" />
                            <span>Cognitive Tutor</span>
                          </button>
                        </div>

                        {/* Right: Side-by-Side Badge / Indicator */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#ea580c] dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/40 font-semibold text-[11px]">
                          <Columns className="w-3.5 h-3.5 text-[#ea580c]" />
                          <span>Side-by-Side View</span>
                        </div>
                      </div>

                      {/* Cards Display Container - Strictly Side-by-Side on Desktop/Tablet */}
                      <div className={`w-full text-left gap-4 sm:gap-6 ${
                        cardsFilterTab === 'both'
                          ? 'grid grid-cols-1 md:grid-cols-2 items-stretch'
                          : 'flex flex-col'
                      }`}>
                        {/* Card 1: BIONIC READING ACTIVE */}
                        {(cardsFilterTab === 'both' || cardsFilterTab === 'bionic') && (
                          <div className={`w-full h-full flex flex-col p-5 sm:p-6 rounded-2xl border space-y-3 shadow-sm transition-all ${
                            isDarkMode 
                              ? 'bg-slate-800/80 border-slate-700 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.25)]' 
                              : 'bg-white border-orange-200/80 shadow-[0_4px_20px_-2px_rgba(234,88,12,0.06)]'
                          }`}>
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-slate-700/70 shrink-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-[#ea580c] flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                                  {t.bionicActiveTag}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100/70 dark:bg-orange-950/60 text-[#ea580c] dark:text-orange-300 border border-orange-200 dark:border-orange-800/50">
                                  Eye-Fixation Active
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleCopyCard(currentConcept.bionicText, 'bionic')}
                                  title="Copy Bionic text"
                                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer text-xs flex items-center gap-1 font-medium"
                                >
                                  {copiedCard === 'bionic' ? (
                                    <span className="text-emerald-500 flex items-center gap-1 font-bold text-[11px]">
                                      <Check className="w-3.5 h-3.5" /> Copied
                                    </span>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className={`flex-1 text-base sm:text-lg leading-relaxed sm:leading-loose min-h-[140px] max-h-72 sm:max-h-80 overflow-y-auto pr-3 pl-1 ${
                              isDarkMode ? 'text-slate-100' : 'text-slate-800'
                            } ${accessibility.openDyslexic ? 'font-dyslexic' : ''}`}>
                              {formatBionicReading(currentConcept.bionicText)}
                            </div>
                          </div>
                        )}

                        {/* Card 2: RE-WORDING / STEP-BY-STEP EXPLANATION */}
                        {(cardsFilterTab === 'both' || cardsFilterTab === 'tutor') && (
                          <div className={`w-full h-full flex flex-col p-5 sm:p-6 rounded-2xl border space-y-3 shadow-sm transition-all ${
                            isDarkMode 
                              ? 'bg-slate-800/80 border-slate-700 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.25)]' 
                              : 'bg-white border-sky-200/80 shadow-[0_4px_20px_-2px_rgba(14,165,233,0.06)]'
                          }`}>
                            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-slate-700/70 shrink-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                                  {currentConcept.rewordingLabel}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100/70 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50">
                                  Step-by-Step
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {isSpeaking ? (
                                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Speaking...
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      stopSpeech();
                                      speakText(currentConcept.rewordingText, selectedLanguage.code || 'hi-IN', accessibility.speechSpeed);
                                    }}
                                    title="Listen to explanation in dialect"
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Listen</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleCopyCard(currentConcept.rewordingText, 'tutor')}
                                  title="Copy explanation"
                                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer text-xs flex items-center gap-1 font-medium"
                                >
                                  {copiedCard === 'tutor' ? (
                                    <span className="text-emerald-500 flex items-center gap-1 font-bold text-[11px]">
                                      <Check className="w-3.5 h-3.5" /> Copied
                                    </span>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className={`flex-1 text-base sm:text-lg leading-relaxed sm:leading-loose min-h-[140px] max-h-72 sm:max-h-80 overflow-y-auto pr-3 pl-1 ${
                              isDarkMode ? 'text-slate-100' : 'text-slate-800'
                            } ${accessibility.openDyslexic ? 'font-dyslexic' : ''}`}>
                              {renderCognitiveText(currentConcept.rewordingText)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Google Search Grounding Sources & Live Verification */}
                      {currentConcept && (currentConcept.isGrounded || (currentConcept.groundingSources && currentConcept.groundingSources.length > 0)) && (
                        <div className="w-full pt-2 animate-fade-in">
                          <GroundingSourcesList
                            sources={currentConcept.groundingSources}
                            searchQueries={currentConcept.searchQueries}
                            isGrounded={currentConcept.isGrounded}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`p-6 rounded-2xl border border-dashed text-center py-6 space-y-2 text-sm sm:text-base animate-fade-in max-w-4xl mx-auto w-full mt-4 ${
                      isDarkMode 
                        ? 'bg-slate-800/40 border-slate-700 text-slate-300' 
                        : 'bg-slate-50/70 border-slate-200 text-slate-700'
                    }`}>
                      <p className={`font-bold text-base sm:text-lg ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Awaiting your question or doubt</p>
                      <p className={`text-xs sm:text-sm leading-relaxed max-w-lg mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Click the microphone above or type a query to generate real-time step-by-step explanations in {selectedLanguage.name}.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* QUICK LAUNCH STUDIOS & REAL-TIME ENGINE STRIP (4 WIDE CARDS BELOW HERO STAGE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-1">
                {/* Card 1: Dedicated Mock Interviewer Quick Launch Card */}
                <button 
                  type="button"
                  onClick={() => setActiveTool('mock-interview')}
                  aria-label="Launch AI Mock Interviewer studio (Press 2)"
                  className={`group text-left w-full rounded-3xl p-5 border shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20 hover:bg-gradient-to-br hover:from-orange-500 hover:to-amber-600 hover:border-transparent transition-all duration-300 ease-in-out cursor-pointer space-y-3 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 outline-none ${
                    isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ea580c] border border-orange-100 text-[10px] font-bold uppercase tracking-wider group-hover:bg-white/25 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                      Dedicated Studio
                    </span>
                    <Video className="w-4 h-4 text-[#ea580c] group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div>
                    <h3 className={`text-base font-black group-hover:text-white transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      AI Mock Interviewer
                    </h3>
                    <p className={`text-xs group-hover:text-white/90 mt-1 leading-snug transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      WebRTC Camera/Mic, Resume Analysis, and Real-Time Deep Cross-Questioning.
                    </p>
                  </div>
                  <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-[#ea580c] group-hover:text-white transition-colors duration-300">
                    <span>Enter Interview Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>

                {/* Card 2: Interactive D3 Mind Map Card */}
                <button 
                  type="button"
                  onClick={() => setActiveTool('mind-maps')}
                  aria-label="Launch D3 Mind Maps tool (Press 3)"
                  className={`group text-left w-full rounded-2xl p-4 sm:p-5 border shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/20 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600 hover:border-transparent transition-all duration-300 ease-in-out cursor-pointer space-y-2.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 outline-none ${
                    isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold group-hover:text-white flex items-center gap-1.5 transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      <GitFork className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                      <span>D3 Mind Maps</span>
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-full group-hover:bg-white/25 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                      Hierarchical
                    </span>
                  </div>
                  <p className={`text-[11px] group-hover:text-white/90 leading-relaxed transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Turn textbooks and notes into zoomable, navigable SVG tree graphs with D3.
                  </p>
                </button>

                {/* Card 3: Diagram Vision AI Card */}
                <button 
                  type="button"
                  onClick={() => setActiveTool('diagram-explainer')}
                  aria-label="Launch Vision Diagram AI explainer (Press 6)"
                  className={`group text-left w-full rounded-2xl p-4 sm:p-5 border shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 hover:border-transparent transition-all duration-300 ease-in-out cursor-pointer space-y-2.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 outline-none ${
                    isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold group-hover:text-white flex items-center gap-1.5 transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      <ImageIcon className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      <span>Vision Diagram AI</span>
                    </h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100/60 px-2 py-0.5 rounded-full group-hover:bg-white/25 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                      Multimodal
                    </span>
                  </div>
                  <p className={`text-[11px] group-hover:text-white/90 leading-relaxed transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Upload textbook diagrams or circuits for visual component breakdown and speech.
                  </p>
                </button>

                {/* Card 4: Dialect Voice Metrics Card */}
                <div className={`group p-4 sm:p-5 rounded-2xl border shadow-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 hover:bg-gradient-to-br hover:from-purple-500 hover:to-indigo-600 hover:border-transparent transition-all duration-300 ease-in-out cursor-pointer text-xs space-y-2.5 ${
                  isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-bold group-hover:text-white block text-[11px] uppercase tracking-wider transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Real-Time NLP Voice Engine
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className={`flex items-center justify-between group-hover:text-white/90 text-[11px] transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>Dialect Accuracy</span>
                    <strong className="text-emerald-500 group-hover:text-white font-bold transition-colors duration-300">98.4%</strong>
                  </div>
                  <div className={`flex items-center justify-between group-hover:text-white/90 text-[11px] transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>TTS Latency</span>
                    <strong className={`group-hover:text-white font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>180ms</strong>
                  </div>
                  <div className={`flex items-center justify-between group-hover:text-white/90 text-[11px] transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>Model Tier</span>
                    <strong className={`group-hover:text-white font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>Gemini 3.8 Flash</strong>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* FULL-PAGE WIDTH DYNAMIC MASTERY & ADAPTIVE CURRICULUM SECTION */}
          <div id="learning-modules-progress-section" className="w-full pt-8 pb-4 animate-slide-up">
            <LearningModulesProgressSection
              isDarkMode={isDarkMode}
              onSelectTopicForChat={(topicTitle) => {
                setUserQueryText(`Explain ${topicTitle} in simple terms with examples.`);
                chatInputRef.current?.focus();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectTopicForQuiz={(topicTitle) => {
                setSelectedTopicForStudy(topicTitle);
                setActiveTool('adaptive-quiz');
              }}
            />
          </div>
        </>
      )}

        {/* BOTTOM METRICS FOOTER */}
        <footer className="mt-8 pt-4 border-t border-orange-100/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">{t.onlineLearning}</span>
            <span>•</span>
            <span>{t.languagesSupported.replace(/\d+|[०-९]+|[০-৯]+/g, String(availableLanguages.length))}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>Powered by Code Crushers</span>
          </div>
        </footer>
      </div>

      {/* Accessible Keyboard Shortcuts & Navigation Cheat-sheet Modal */}
      <KeyboardShortcutsModal 
        isOpen={isShortcutsOpen} 
        onClose={() => setIsShortcutsOpen(false)} 
        isDarkMode={isDarkMode} 
        selectedLanguage={selectedLanguage}
      />

      {/* Voice Command Navigator Bar (Web Speech API) */}
      <VoiceCommandBar
        isOpen={isVoiceCommandBarOpen}
        onClose={() => {
          setIsVoiceCommandBarOpen(false);
          voiceCommand.stopListening();
        }}
        isListening={voiceCommand.isListening}
        isHandsFree={voiceCommand.isHandsFree}
        isSupported={voiceCommand.isSupported}
        transcript={voiceCommand.transcript}
        interimTranscript={voiceCommand.interimTranscript}
        lastExecutedCommand={voiceCommand.lastExecutedCommand}
        errorMessage={voiceCommand.errorMessage}
        voiceFeedbackEnabled={voiceCommand.voiceFeedbackEnabled}
        currentLanguageName={selectedLanguage.name}
        onToggleListening={voiceCommand.toggleListening}
        onToggleHandsFree={voiceCommand.toggleHandsFree}
        onToggleVoiceFeedback={() => voiceCommand.setVoiceFeedbackEnabled(!voiceCommand.voiceFeedbackEnabled)}
        onExecuteSampleCommand={(cmd) => voiceCommand.executeCommandManually(cmd)}
      />
    </div>
  );
}
