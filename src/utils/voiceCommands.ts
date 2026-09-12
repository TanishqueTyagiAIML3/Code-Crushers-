import { LearningToolId } from '../types';
import { INDIAN_LANGUAGES } from '../data/languages';

export type VoiceActionType =
  | 'NAVIGATE_TOOL'
  | 'SWITCH_LANGUAGE'
  | 'TOGGLE_THEME'
  | 'TOGGLE_SHORTCUTS'
  | 'STOP_AUDIO'
  | 'REPEAT_AUDIO'
  | 'TOGGLE_FULLSCREEN'
  | 'TOGGLE_DYSLEXIA'
  | 'CLEAR_CHAT'
  | 'START_DOUBT'
  | 'HELP';

export interface VoiceCommandResult {
  action: VoiceActionType;
  payload?: any;
  feedbackText: string;
  commandLabel: string;
  matchedPhrase: string;
}

export interface VoiceCommandExample {
  category: string;
  phrases: string[];
  actionDescription: string;
}

/**
 * Normalized string helper: strips punctuation, lowercase, extra spaces
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?।!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse an incoming speech transcript and match it to a platform action.
 * Supports English, Hindi, Bhojpuri, Awadhi, Marathi, Bengali, Tamil, Telugu, Gujarati, and Spanish.
 */
export function parseVoiceCommand(transcript: string): VoiceCommandResult | null {
  const text = normalize(transcript);
  if (!text) return null;

  // 1. STOP AUDIO / MUTE
  if (
    text.includes('stop audio') ||
    text.includes('stop speech') ||
    text.includes('stop speaking') ||
    text.includes('mute') ||
    text.includes('shut up') ||
    text.includes('pause audio') ||
    text.includes('shant') ||
    text.includes('chup') ||
    text.includes('ruko') ||
    text.includes('ruk jao') ||
    text.includes('bolna band') ||
    text.includes('aawaz band') ||
    text.includes('awaaz band') ||
    text.includes('aawaj band') ||
    text.includes('band karo') ||
    text.includes('आवाज बंद') ||
    text.includes('आवाज़ बंद') ||
    text.includes('शांत') ||
    text.includes('चुप') ||
    text.includes('रुको') ||
    text.includes('बंद करा') ||
    text.includes('থামো') ||
    text.includes('நிறுத்து') ||
    text.includes('ఆపు') ||
    text.includes('રોકો') ||
    text.includes('detener') ||
    text.includes('silencio')
  ) {
    return {
      action: 'STOP_AUDIO',
      feedbackText: 'Audio stopped',
      commandLabel: 'Stop Audio / Speech',
      matchedPhrase: text,
    };
  }

  // 2. REPEAT / READ OUT LOUD
  if (
    text.includes('repeat') ||
    text.includes('replay') ||
    text.includes('read again') ||
    text.includes('read out loud') ||
    text.includes('speak again') ||
    text.includes('listen again') ||
    text.includes('phir se bolo') ||
    text.includes('dobara bolo') ||
    text.includes('dohrao') ||
    text.includes('fir se') ||
    text.includes('phir se sunao') ||
    text.includes('fir se sunao') ||
    text.includes('padho') ||
    text.includes('padh ke sunao') ||
    text.includes('फिर से बोलो') ||
    text.includes('दोबारा बोलो') ||
    text.includes('पढ़ो') ||
    text.includes('वाचून दाखवा') ||
    text.includes('আবার বলো') ||
    text.includes('மீண்டும் சொல்') ||
    text.includes('మళ్ళీ చెప్పు') ||
    text.includes('ફરી બોલો') ||
    text.includes('repetir')
  ) {
    return {
      action: 'REPEAT_AUDIO',
      feedbackText: 'Repeating last response',
      commandLabel: 'Replay / Read Out Loud',
      matchedPhrase: text,
    };
  }

  // 3. NAVIGATION: ADAPTIVE QUIZ
  if (
    text.includes('quiz') ||
    text.includes('quize') ||
    text.includes('mcq') ||
    text.includes('test') ||
    text.includes('exam') ||
    text.includes('pariksha') ||
    text.includes('parikshya') ||
    text.includes('क्विज') ||
    text.includes('क्विज़') ||
    text.includes('परीक्षा') ||
    text.includes('चाचणी') ||
    text.includes('কুইজ') ||
    text.includes('வினாடி வினா') ||
    text.includes('క్విజ్') ||
    text.includes('પ્રશ્નોત્તરી') ||
    text.includes('cuestionario')
  ) {
    return {
      action: 'NAVIGATE_TOOL',
      payload: 'adaptive-quiz' as LearningToolId,
      feedbackText: 'Opening Adaptive Quiz',
      commandLabel: 'Open Adaptive Quiz',
      matchedPhrase: text,
    };
  }

  // 4. NAVIGATION: MOCK INTERVIEW
  if (
    text.includes('interview') ||
    text.includes('mock interview') ||
    text.includes('viva') ||
    text.includes('interviewer') ||
    text.includes('job interview') ||
    text.includes('sakshatkar') ||
    text.includes('इंटरव्यू') ||
    text.includes('साक्षात्कार') ||
    text.includes('मुलाखत') ||
    text.includes('সাক্ষাৎকার') ||
    text.includes('நேர்காணல்') ||
    text.includes('ఇంటర్వ్యూ') ||
    text.includes('રૂબરૂ મુલાકાત') ||
    text.includes('entrevista')
  ) {
    return {
      action: 'NAVIGATE_TOOL',
      payload: 'mock-interview' as LearningToolId,
      feedbackText: 'Opening Mock Interviewer',
      commandLabel: 'Open Mock Interviewer',
      matchedPhrase: text,
    };
  }

  // 5. NAVIGATION: MIND MAPS
  if (
    text.includes('mind map') ||
    text.includes('mindmap') ||
    text.includes('concept map') ||
    text.includes('flowchart') ||
    text.includes('tree') ||
    text.includes('diagram map') ||
    text.includes('माइंड मैप') ||
    text.includes('संकल्पना नकाशा') ||
    text.includes('কনসেপ্ট ম্যাপ') ||
    text.includes('மன வரைபடம்') ||
    text.includes('మైండ్ మ్యాప్') ||
    text.includes('માઇન્ડ મેપ') ||
    text.includes('mapa mental')
  ) {
    return {
      action: 'NAVIGATE_TOOL',
      payload: 'mind-maps' as LearningToolId,
      feedbackText: 'Opening Interactive Mind Maps',
      commandLabel: 'Open Mind Maps',
      matchedPhrase: text,
    };
  }

  // 6. NAVIGATION: FLASHCARDS
  if (
    text.includes('flash card') ||
    text.includes('flashcard') ||
    text.includes('flash cards') ||
    text.includes('cards') ||
    text.includes('memory card') ||
    text.includes('study card') ||
    text.includes('yaad karne wale card') ||
    text.includes('फ्लैशकार्ड') ||
    text.includes('स्मृति कार्ड') ||
    text.includes('ফ্ল্যাশকার্ড') ||
    text.includes('மின் அட்டை') ||
    text.includes('ఫ్లాష్ కార్డ్స్') ||
    text.includes('ફ્લેશકાર્ડ') ||
    text.includes('tarjetas')
  ) {
    return {
      action: 'NAVIGATE_TOOL',
      payload: 'flashcards' as LearningToolId,
      feedbackText: 'Opening Spaced Repetition Flashcards',
      commandLabel: 'Open Flashcards',
      matchedPhrase: text,
    };
  }

  // 7. NAVIGATION: DIAGRAM VISION
  if (
    text.includes('diagram') ||
    text.includes('vision') ||
    text.includes('chart') ||
    text.includes('diagram explainer') ||
    text.includes('image explainer') ||
    text.includes('photo samjho') ||
    text.includes('chitra') ||
    text.includes('diagram samjhao') ||
    text.includes('डायग्राम') ||
    text.includes('चित्र') ||
    text.includes('चित्र स्पष्टीकरण') ||
    text.includes('চিত্র') ||
    text.includes('வரைபடம்') ||
    text.includes('చిత్రం') ||
    text.includes('આકૃતિ') ||
    text.includes('diagrama')
  ) {
    return {
      action: 'NAVIGATE_TOOL',
      payload: 'diagram-explainer' as LearningToolId,
      feedbackText: 'Opening Diagram Vision Explainer',
      commandLabel: 'Open Diagram Vision',
      matchedPhrase: text,
    };
  }

  // 8. NAVIGATION: PDF / SMART NOTES
  if (
    text.includes('pdf') ||
    text.includes('notes') ||
    text.includes('summarizer') ||
    text.includes('summary') ||
    text.includes('document') ||
    text.includes('kitab') ||
    text.includes('pustak') ||
    text.includes('smart notes') ||
    text.includes('पीडीएफ') ||
    text.includes('नोट्स') ||
    text.includes('सारांश') ||
    text.includes('নোট') ||
    text.includes('குறிப்புகள்') ||
    text.includes('నోట్స్') ||
    text.includes('નોંધ') ||
    text.includes('resumen')
  ) {
    return {
      action: 'NAVIGATE_TOOL',
      payload: 'pdf-summarizer' as LearningToolId,
      feedbackText: 'Opening PDF Notes & Summarizer',
      commandLabel: 'Open PDF Summarizer',
      matchedPhrase: text,
    };
  }

  // 9. NAVIGATION: HISTORY & SAVED LESSONS
  if (
    text.includes('history') ||
    text.includes('log') ||
    text.includes('saved') ||
    text.includes('saved lessons') ||
    text.includes('record') ||
    text.includes('database') ||
    text.includes('offline lessons') ||
    text.includes('purana padhai') ||
    text.includes('itihas') ||
    text.includes('इतिहास') ||
    text.includes('रिकॉर्ड') ||
    text.includes('सेव्ड') ||
    text.includes('जतन केलेले') ||
    text.includes('ইতিহাস') ||
    text.includes('வரலாறு') ||
    text.includes('చరిత్ర') ||
    text.includes('ઇતિહાસ') ||
    text.includes('historial')
  ) {
    return {
      action: 'NAVIGATE_TOOL',
      payload: 'history' as LearningToolId,
      feedbackText: 'Opening Learning History & Offline Logs',
      commandLabel: 'Open Learning History',
      matchedPhrase: text,
    };
  }

  // 10. NAVIGATION: AI CHAT / DOUBT SOLVER / HOME
  if (
    text.includes('chat') ||
    text.includes('tutor') ||
    text.includes('doubt') ||
    text.includes('home') ||
    text.includes('main') ||
    text.includes('ask') ||
    text.includes('ai teacher') ||
    text.includes('guru') ||
    text.includes('shikshak') ||
    text.includes('chhat') ||
    text.includes('sandeh') ||
    text.includes('चैट') ||
    text.includes('संदेह') ||
    text.includes('डाउट') ||
    text.includes('होम') ||
    text.includes('मुख्य पान') ||
    text.includes('প্রশ্ন') ||
    text.includes('முகப்பு') ||
    text.includes('సందేహం') ||
    text.includes('શંકા') ||
    text.includes('inicio')
  ) {
    return {
      action: 'NAVIGATE_TOOL',
      payload: 'ai-chat' as LearningToolId,
      feedbackText: 'Opening AI Doubt Solver',
      commandLabel: 'Open AI Doubt Solver',
      matchedPhrase: text,
    };
  }

  // 11. LANGUAGE SWITCHING: BHOJPURI
  if (
    text.includes('bhojpuri') ||
    text.includes('bhojpur') ||
    text.includes('bihar') ||
    text.includes('purvanchal') ||
    text.includes('भोजपुरी')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'hi-bhojpuri')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to Bhojpuri',
      commandLabel: 'Switch to Bhojpuri (भोजपुरी)',
      matchedPhrase: text,
    };
  }

  // 12. LANGUAGE SWITCHING: AWADHI
  if (
    text.includes('awadhi') ||
    text.includes('avadhi') ||
    text.includes('avadh') ||
    text.includes('अवधी')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'hi-awadhi')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to Awadhi',
      commandLabel: 'Switch to Awadhi (अवधी)',
      matchedPhrase: text,
    };
  }

  // 13. LANGUAGE SWITCHING: MARATHI (VARHADI)
  if (
    text.includes('marathi') ||
    text.includes('varhadi') ||
    text.includes('vidarbha') ||
    text.includes('मराठी') ||
    text.includes('वऱ्हाडी')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'mr-varhadi')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to Marathi',
      commandLabel: 'Switch to Marathi (वऱ्हाडी)',
      matchedPhrase: text,
    };
  }

  // 14. LANGUAGE SWITCHING: BENGALI / BANGLA
  if (
    text.includes('bengali') ||
    text.includes('bangla') ||
    text.includes('kolkata') ||
    text.includes('bangla bhasha') ||
    text.includes('বাংলা') ||
    text.includes('বাঙালি')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'bn-rarh')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to Bengali',
      commandLabel: 'Switch to Bengali (বাংলা)',
      matchedPhrase: text,
    };
  }

  // 15. LANGUAGE SWITCHING: TAMIL
  if (
    text.includes('tamil') ||
    text.includes('tamizh') ||
    text.includes('madurai') ||
    text.includes('chennai') ||
    text.includes('தமிழ்')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'ta-madurai')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to Tamil',
      commandLabel: 'Switch to Tamil (தமிழ்)',
      matchedPhrase: text,
    };
  }

  // 16. LANGUAGE SWITCHING: TELUGU
  if (
    text.includes('telugu') ||
    text.includes('telangana') ||
    text.includes('andhra') ||
    text.includes('తెలుగు')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'te-telangana')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to Telugu',
      commandLabel: 'Switch to Telugu (తెలుగు)',
      matchedPhrase: text,
    };
  }

  // 17. LANGUAGE SWITCHING: GUJARATI
  if (
    text.includes('gujarati') ||
    text.includes('gujrati') ||
    text.includes('kathiyawadi') ||
    text.includes('ગુજરાતી')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'gu-kathiyawadi')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to Gujarati',
      commandLabel: 'Switch to Gujarati (ગુજરાતી)',
      matchedPhrase: text,
    };
  }

  // 18. LANGUAGE SWITCHING: HINDI (STANDARD)
  if (
    text.includes('standard hindi') ||
    text.includes('hindi') ||
    text.includes('shuddh hindi') ||
    text.includes('हिन्दी') ||
    text.includes('हिंदी')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'hi-standard')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to Standard Hindi',
      commandLabel: 'Switch to Standard Hindi (मानक हिन्दी)',
      matchedPhrase: text,
    };
  }

  // 19. LANGUAGE SWITCHING: ENGLISH
  if (
    text.includes('english') ||
    text.includes('angrezi') ||
    text.includes('angreji') ||
    text.includes('अंग्रेजी') ||
    text.includes('inglés')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'en')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to English',
      commandLabel: 'Switch to English',
      matchedPhrase: text,
    };
  }

  // 20. LANGUAGE SWITCHING: SPANISH
  if (
    text.includes('spanish') ||
    text.includes('espanol') ||
    text.includes('español') ||
    text.includes('स्पैनिश')
  ) {
    const lang = INDIAN_LANGUAGES.find(l => l.id === 'es')!;
    return {
      action: 'SWITCH_LANGUAGE',
      payload: lang,
      feedbackText: 'Switched language to Spanish',
      commandLabel: 'Switch to Spanish (Español)',
      matchedPhrase: text,
    };
  }

  // 21. THEME TOGGLE: DARK / LIGHT MODE
  if (
    text.includes('dark mode') ||
    text.includes('light mode') ||
    text.includes('toggle theme') ||
    text.includes('change theme') ||
    text.includes('night mode') ||
    text.includes('day mode') ||
    text.includes('theme badlo') ||
    text.includes('kala rang') ||
    text.includes('safed rang') ||
    text.includes('डार्क मोड') ||
    text.includes('लाइट मोड') ||
    text.includes('थीम बदलो') ||
    text.includes('काळोख') ||
    text.includes('অন্ধকার মোড') ||
    text.includes('இருண்ட பயன்முறை') ||
    text.includes('డార్క్ మోడ్') ||
    text.includes('ડાર્ક મોડ') ||
    text.includes('modo oscuro') ||
    text.includes('modo claro')
  ) {
    return {
      action: 'TOGGLE_THEME',
      feedbackText: 'Toggled theme mode',
      commandLabel: 'Toggle Dark / Light Theme',
      matchedPhrase: text,
    };
  }

  // 22. KEYBOARD SHORTCUTS / HELP
  if (
    text.includes('shortcut') ||
    text.includes('shortcuts') ||
    text.includes('keyboard shortcut') ||
    text.includes('help') ||
    text.includes('commands') ||
    text.includes('command list') ||
    text.includes('madad') ||
    text.includes('sahayata') ||
    text.includes('shortcut dikhao') ||
    text.includes('शॉर्टकट') ||
    text.includes('मदद') ||
    text.includes('सहायता') ||
    text.includes('मदत') ||
    text.includes('সাহায্য') ||
    text.includes('உதவி') ||
    text.includes('సహాయం') ||
    text.includes('મદદ') ||
    text.includes('ayuda')
  ) {
    return {
      action: 'TOGGLE_SHORTCUTS',
      feedbackText: 'Opening Shortcuts & Navigation Guide',
      commandLabel: 'Open Keyboard Shortcuts',
      matchedPhrase: text,
    };
  }

  // 23. FULLSCREEN TOGGLE
  if (
    text.includes('full screen') ||
    text.includes('fullscreen') ||
    text.includes('maximize') ||
    text.includes('badi screen') ||
    text.includes('puri screen') ||
    text.includes('exit fullscreen') ||
    text.includes('पूरी स्क्रीन') ||
    text.includes('पूर्ण स्क्रीन') ||
    text.includes('সম্পূর্ণ পর্দা') ||
    text.includes('முழுத்திரை') ||
    text.includes('పూర్తి స్క్రీన్') ||
    text.includes('pantalla completa')
  ) {
    return {
      action: 'TOGGLE_FULLSCREEN',
      feedbackText: 'Toggled full screen mode',
      commandLabel: 'Toggle Fullscreen',
      matchedPhrase: text,
    };
  }

  // 24. DYSLEXIA FONT TOGGLE
  if (
    text.includes('dyslexia') ||
    text.includes('opendyslexic') ||
    text.includes('dyslexia font') ||
    text.includes('font badlo') ||
    text.includes('reading font') ||
    text.includes('डिस्लेक्सिया') ||
    text.includes('फॉन्ट')
  ) {
    return {
      action: 'TOGGLE_DYSLEXIA',
      feedbackText: 'Toggled Dyslexia-friendly typography',
      commandLabel: 'Toggle Dyslexia Font',
      matchedPhrase: text,
    };
  }

  // 25. CLEAR CHAT / RESET
  if (
    text.includes('clear chat') ||
    text.includes('reset chat') ||
    text.includes('new chat') ||
    text.includes('saf karo') ||
    text.includes('naya shuru karo') ||
    text.includes('saaf karo') ||
    text.includes('चैट साफ करो') ||
    text.includes('नया शुरू करो') ||
    text.includes('पुसा') ||
    text.includes('মুছে ফেলুন') ||
    text.includes('அழி') ||
    text.includes('తుడిచివేయి') ||
    text.includes('સાફ કરો') ||
    text.includes('limpiar')
  ) {
    return {
      action: 'CLEAR_CHAT',
      feedbackText: 'Chat cleared',
      commandLabel: 'Clear Chat History',
      matchedPhrase: text,
    };
  }

  return null;
}

/**
 * Common spoken command examples grouped for user education and tooltips
 */
export const VOICE_COMMAND_EXAMPLES: VoiceCommandExample[] = [
  {
    category: 'Navigation (नेविगेशन)',
    phrases: ['"Open Quiz"', '"Go to Interview"', '"Mind Maps kholo"', '"Flashcards"', '"Diagram Vision"', '"PDF Notes"', '"Home / Doubt Solver"', '"History"'],
    actionDescription: 'Hands-free instant switching between all 7 learning tools & history'
  },
  {
    category: 'Language Switch (भाषा बदलो)',
    phrases: ['"Switch to Bhojpuri"', '"Hindi me badlo"', '"Switch to Marathi"', '"Bengali"', '"Tamil"', '"Telugu"', '"Gujarati"', '"English"'],
    actionDescription: 'Instantly changes entire platform dialect, prompts, and TTS voice'
  },
  {
    category: 'Audio Controls (आवाज़ नियंत्रण)',
    phrases: ['"Stop Audio / Chup"', '"Repeat / Phir se bolo"', '"Read out loud"'],
    actionDescription: 'Stops or replays AI explanations for students with visual impairments'
  },
  {
    category: 'Display & Access (प्रदर्शन एवं सुलभता)',
    phrases: ['"Dark Mode"', '"Toggle Theme"', '"Fullscreen"', '"Shortcuts / Help"', '"Dyslexia Font"'],
    actionDescription: 'Control accessibility, contrast, and guides with natural voice'
  }
];
