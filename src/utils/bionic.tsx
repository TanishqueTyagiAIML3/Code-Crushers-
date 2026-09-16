import React from 'react';

/**
 * Transforms standard text into Bionic Reading format by bolding the initial fixation letters of each word.
 */
export function formatBionicReading(text: string): React.ReactNode {
  if (!text) return text;

  // Split text by lines to preserve micro-paragraphs and whitespace
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    if (!line.trim()) {
      return <div key={`line-${lineIdx}`} className="h-2.5 sm:h-3" />;
    }

    // Split words while preserving spaces
    const tokens = line.split(/(\s+)/);

    return (
      <span key={`line-${lineIdx}`} className="block leading-relaxed sm:leading-loose">
        {tokens.map((token, tokenIdx) => {
          if (/^\s+$/.test(token)) {
            return token;
          }

          // Strip markdown bold asterisks if present
          let cleanToken = token;
          let isMarkdownBold = false;
          if (cleanToken.startsWith('**') && cleanToken.endsWith('**') && cleanToken.length > 4) {
            cleanToken = cleanToken.slice(2, -2);
            isMarkdownBold = true;
          } else {
            cleanToken = cleanToken.replace(/\*\*/g, '');
          }

          const len = cleanToken.length;
          let fixation = 1;
          if (len > 3) {
            fixation = Math.ceil(len * 0.45);
          } else if (len > 1) {
            fixation = 1;
          }

          const boldPart = cleanToken.slice(0, fixation);
          const regularPart = cleanToken.slice(fixation);

          return (
            <span key={tokenIdx} className="inline-block whitespace-nowrap">
              <strong className={`font-extrabold ${isMarkdownBold ? 'text-[#ea580c] dark:text-orange-400 underline decoration-orange-300' : 'text-slate-900 dark:text-amber-200'}`}>
                {boldPart}
              </strong>
              <span className={`font-medium ${isMarkdownBold ? 'font-bold text-slate-900 dark:text-amber-100' : 'text-slate-700 dark:text-slate-200'}`}>
                {regularPart}
              </span>
            </span>
          );
        })}
      </span>
    );
  });
}

let cachedVoices: SpeechSynthesisVoice[] = [];
let speechKeepAliveInterval: any = null;

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
    }
  } catch {
    // ignore
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Clean text for Speech Synthesis:
 * Strips markdown symbols, asterisks, bullet dashes, and emojis so voice pronunciation is clean and natural.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/[*_#`~>]/g, '')
    // remove emoji ranges
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
    // normalize bullet points to pauses
    .replace(/^[•\-\*]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Robust voice selector matching the user's selected language.
 * Crucial fix: Returns undefined if no compatible voice is found, allowing the browser's
 * operating system / native speech synthesizer to dynamically route to utterance.lang
 * instead of corrupting the speech by forcing it through an incompatible English voice.
 */
export function getBestVoiceForLanguage(voices: SpeechSynthesisVoice[], langCode = 'hi-IN'): SpeechSynthesisVoice | undefined {
  const voiceList = voices && voices.length > 0 ? voices : cachedVoices;
  if (!voiceList || voiceList.length === 0) return undefined;

  const normalizedCode = langCode.toLowerCase().replace('_', '-');
  const prefix = normalizedCode.split('-')[0];
  const country = normalizedCode.split('-')[1];

  // 1. Exact match (e.g. es-es, en-us, hi-in, mr-in, ta-in, te-in, bn-in, gu-in)
  const exact = voiceList.find(v => v.lang.toLowerCase().replace('_', '-') === normalizedCode);
  if (exact) return exact;

  // 2. Exact match with same country code if available (e.g. Indic languages with IN)
  if (country) {
    const byCountry = voiceList.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang.startsWith(prefix) && vLang.includes(country);
    });
    if (byCountry) return byCountry;
  }

  // 3. Language prefix match (e.g. 'es', 'en', 'hi', 'ta', 'te', 'mr', 'gu', 'bn')
  const byPrefix = voiceList.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
  if (byPrefix) return byPrefix;

  // 4. Name-based match for common language keywords
  const langKeywords: Record<string, string[]> = {
    es: ['spanish', 'español', 'castellano'],
    en: ['english'],
    hi: ['hindi', 'हिन्दी', 'हिंदी'],
    mr: ['marathi', 'मराठी'],
    bn: ['bengali', 'bangla', 'বাংলা'],
    ta: ['tamil', 'தமிழ்'],
    te: ['telugu', 'తెలుగు'],
    gu: ['gujarati', 'ગુજરાતી']
  };

  const keywords = langKeywords[prefix] || [prefix];
  const byName = voiceList.find(v => {
    const vName = v.name.toLowerCase();
    const vLang = v.lang.toLowerCase();
    return keywords.some(k => vName.includes(k) || vLang.includes(k));
  });
  if (byName) return byName;

  // 5. If Indic language and no specific dialect voice exists, prefer another Indic voice (e.g. Hindi) over an English voice
  const isIndic = ['hi', 'mr', 'bn', 'ta', 'te', 'gu'].includes(prefix);
  if (isIndic) {
    const hindiOrIndicVoice = voiceList.find(v => {
      const vLang = v.lang.toLowerCase();
      const vName = v.name.toLowerCase();
      return vLang.startsWith('hi') || vName.includes('hindi') || vName.includes('हिन्दी');
    });
    if (hindiOrIndicVoice) return hindiOrIndicVoice;
  }

  // 6. If English requested, prefer an English voice
  if (prefix === 'en') {
    const enVoice = voiceList.find(v => v.lang.toLowerCase().startsWith('en'));
    if (enVoice) return enVoice;
  }

  // CRITICAL: NEVER return voices[0] or default voice if it doesn't match the requested language family!
  // Returning undefined allows SpeechSynthesisUtterance to rely solely on utterance.lang = langCode,
  // which lets Chrome / Edge / Android OS choose its online native language engine.
  return undefined;
}

/**
 * Browser speech synthesis helper strictly matching the user's selected language
 */
export function speakText(text: string, lang = 'hi-IN', rate = 1.0, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  stopSpeech();

  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) {
    if (onEnd) onEnd();
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = Math.max(0.7, Math.min(rate || 1.0, 1.4));

  const voices = loadVoices();
  const matchedVoice = getBestVoiceForLanguage(voices, lang);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  const cleanup = () => {
    if (speechKeepAliveInterval) {
      clearInterval(speechKeepAliveInterval);
      speechKeepAliveInterval = null;
    }
  };

  utterance.onend = () => {
    cleanup();
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    cleanup();
    if (onEnd) onEnd();
  };

  // Chrome bug workaround: keep speech alive for longer sentences
  if (speechKeepAliveInterval) {
    clearInterval(speechKeepAliveInterval);
  }
  speechKeepAliveInterval = setInterval(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (!window.speechSynthesis.speaking) {
        cleanup();
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
  }, 10000);

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if (speechKeepAliveInterval) {
    clearInterval(speechKeepAliveInterval);
    speechKeepAliveInterval = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}
