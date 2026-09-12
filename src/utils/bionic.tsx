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

/**
 * Robust voice selector matching the user's selected language
 */
export function getBestVoiceForLanguage(voices: SpeechSynthesisVoice[], langCode = 'hi-IN'): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;

  const normalizedCode = langCode.toLowerCase();
  const prefix = normalizedCode.split('-')[0];

  // 1. Exact match (e.g. es-ES, en-US, hi-IN, mr-IN, ta-IN, te-IN, bn-IN, gu-IN)
  const exact = voices.find(v => v.lang.toLowerCase() === normalizedCode);
  if (exact) return exact;

  // 2. Language prefix match (e.g. 'es', 'en', 'hi', 'ta', 'te', 'mr', 'gu', 'bn')
  const byPrefix = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
  if (byPrefix) return byPrefix;

  // 3. Name-based match for common language keywords
  const langKeywords: Record<string, string[]> = {
    es: ['spanish', 'español', 'castellano'],
    en: ['english', 'en-us', 'en-gb'],
    hi: ['hindi'],
    mr: ['marathi'],
    bn: ['bengali', 'bangla'],
    ta: ['tamil'],
    te: ['telugu'],
    gu: ['gujarati']
  };

  const keywords = langKeywords[prefix] || [prefix];
  const byName = voices.find(v => {
    const vName = v.name.toLowerCase();
    const vLang = v.lang.toLowerCase();
    return keywords.some(k => vName.includes(k) || vLang.includes(k));
  });
  if (byName) return byName;

  // 4. If requested language is an Indic language, prefer an Indian regional voice if available
  const isIndic = ['hi', 'mr', 'bn', 'ta', 'te', 'gu'].includes(prefix);
  if (isIndic) {
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
    if (indianVoice) return indianVoice;
  }

  // 5. If English requested, prefer an English voice
  if (prefix === 'en') {
    const enVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    if (enVoice) return enVoice;
  }

  // 6. Default fallback
  return voices.find(v => v.default) || voices[0];
}

/**
 * Browser speech synthesis helper strictly matching the user's selected language
 */
export function speakText(text: string, lang = 'hi-IN', rate = 1.0, onEnd?: () => void): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const cleanText = text.replace(/[*_#`]/g, '').trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = getBestVoiceForLanguage(voices, lang);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
