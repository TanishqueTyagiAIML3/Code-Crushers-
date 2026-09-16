import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, Upload, Sparkles, RefreshCw, Volume2, VolumeX,
  CheckCircle, ArrowRight, Layers, FileImage, Info, Play, Pause, Square,
  RotateCcw, Check, Headphones, Radio, FastForward, Download, FileDown, Loader2
} from 'lucide-react';
import { DialectOption, DiagramAnalysis, AccessibilitySettings } from '../types';
import { getTranslations } from '../i18n/translations';
import { stopSpeech, getBestVoiceForLanguage } from '../utils/bionic';
import { recordUserHistory, CURRENT_USER_ID } from '../utils/historyService';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedDiagram, getSectionLabels } from '../data/localizedContent';
import { downloadDiagramAnalysisPdf } from '../utils/diagramPdfGenerator';
import { GroundingSourcesList } from './GroundingSourcesList';

interface DiagramVisionSectionProps {
  selectedLanguage?: DialectOption;
  accessibility: AccessibilitySettings;
  onNavigateToHistory?: () => void;
}

interface SpeechSegment {
  id: string;
  label: string;
  text: string;
}

export function DiagramVisionSection({
  selectedLanguage: propLanguage,
  accessibility,
  onNavigateToHistory
}: DiagramVisionSectionProps) {
  const { selectedLanguage: globalLanguage } = useLanguage();
  const selectedLanguage = propLanguage || globalLanguage;
  const t = getTranslations(selectedLanguage.id);
  const labels = getSectionLabels(selectedLanguage.id);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [userQuery, setUserQuery] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCustomAnalyzed, setIsCustomAnalyzed] = useState(false);
  // Initialized strictly EMPTY (null) as requested - strictly user-driven
  const [analysisResult, setAnalysisResult] = useState<DiagramAnalysis | null>(null);

  // Sync localized sample diagram whenever selectedLanguage changes (if viewing sample)
  useEffect(() => {
    if (!isCustomAnalyzed && analysisResult) {
      const sample = getLocalizedDiagram(selectedLanguage.id);
      setAnalysisResult(sample);
    }
  }, [selectedLanguage.id, isCustomAnalyzed]);

  // Audio / Speech State
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [activeSegmentTitle, setActiveSegmentTitle] = useState<string>('');
  const [speechSpeed, setSpeechSpeed] = useState<number>(accessibility.speechSpeed || 1.0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // References for multi-segment playback
  const currentSegmentsRef = useRef<SpeechSegment[]>([]);
  const currentSegmentIndexRef = useRef<number>(0);
  const isCancelledRef = useRef<boolean>(false);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Sync speech speed with accessibility settings
  useEffect(() => {
    if (accessibility.speechSpeed) {
      setSpeechSpeed(accessibility.speechSpeed);
    }
  }, [accessibility.speechSpeed]);

  /**
   * Helper to clean markdown and special characters for spoken text
   */
  const cleanSpokenText = (text: string) => {
    return text
      .replace(/[*_#`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  /**
   * Play a single segment from queue
   */
  const playSegmentAt = (segments: SpeechSegment[], index: number, rate: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (index >= segments.length || isCancelledRef.current) {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
      setActiveSegmentId(null);
      setActiveSegmentTitle('');
      return;
    }

    currentSegmentIndexRef.current = index;
    const seg = segments[index];
    setActiveSegmentId(seg.id);
    setActiveSegmentTitle(seg.label);
    setIsPlayingAudio(true);
    setIsAudioPaused(false);

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanSpokenText(seg.text));
    const langCode = selectedLanguage.code || 'hi-IN';
    utterance.lang = langCode;
    utterance.rate = rate;

    // Pick appropriate voice strictly matching the selected language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = getBestVoiceForLanguage(voices, langCode);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (isCancelledRef.current) return;
      playSegmentAt(segments, index + 1, rate);
    };

    utterance.onerror = (e) => {
      // Ignore errors caused by cancel() calls
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      console.warn("SpeechSynthesis error:", e);
      if (!isCancelledRef.current) {
        playSegmentAt(segments, index + 1, rate);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Start sequential full walkthrough narration
   */
  const startFullNarration = (data: DiagramAnalysis, rate: number = speechSpeed) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    isCancelledRef.current = false;

    const segments: SpeechSegment[] = [];

    // 1. Title & Overview
    segments.push({
      id: 'title-summary',
      label: `Diagram: ${data.diagramTitle}`,
      text: `${data.diagramTitle}. Subject: ${data.subject}. ${data.summary}`
    });

    // 2. Native Dialect Explanation
    if (data.explanationInLanguage) {
      segments.push({
        id: 'dialect-explanation',
        label: `${selectedLanguage.name} Explanation`,
        text: data.explanationInLanguage
      });
    }

    // 3. Components breakdown
    if (data.components && data.components.length > 0) {
      data.components.forEach((comp, idx) => {
        segments.push({
          id: `comp-${idx}`,
          label: `Component ${idx + 1}: ${comp.name}`,
          text: `Component ${idx + 1}: ${comp.name}. ${comp.visualLocation ? `Location: ${comp.visualLocation}. ` : ''}${comp.functionDescription}`
        });
      });
    }

    // 4. Step-by-step process
    if (data.stepByStepProcess && data.stepByStepProcess.length > 0) {
      data.stepByStepProcess.forEach((step, idx) => {
        segments.push({
          id: `step-${idx}`,
          label: `Process Step ${idx + 1}`,
          text: `Step ${idx + 1}: ${step}`
        });
      });
    }

    currentSegmentsRef.current = segments;
    playSegmentAt(segments, 0, rate);
  };

  /**
   * Speak a specific text section / component / step
   */
  const speakSpecificSegment = (id: string, label: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // If already playing this exact segment, toggle pause/stop
    if (isPlayingAudio && activeSegmentId === id) {
      if (isAudioPaused) {
        window.speechSynthesis.resume();
        setIsAudioPaused(false);
      } else {
        stopAllSpeech();
      }
      return;
    }

    isCancelledRef.current = false;
    const singleSegment: SpeechSegment[] = [{ id, label, text }];
    currentSegmentsRef.current = singleSegment;
    playSegmentAt(singleSegment, 0, speechSpeed);
  };

  /**
   * Pause current speech
   */
  const pauseSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlayingAudio) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
    }
  };

  /**
   * Resume paused speech
   */
  const resumeSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
    }
  };

  /**
   * Stop all speech
   */
  const stopAllSpeech = () => {
    isCancelledRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
    setActiveSegmentId(null);
    setActiveSegmentTitle('');
  };

  /**
   * Change speech playback speed dynamically
   */
  const changeSpeechSpeed = (newSpeed: number) => {
    setSpeechSpeed(newSpeed);
    if (isPlayingAudio && currentSegmentsRef.current.length > 0) {
      // Restart current segment at new speed
      const currentIndex = currentSegmentIndexRef.current;
      playSegmentAt(currentSegmentsRef.current, currentIndex, newSpeed);
    }
  };

  /**
   * Download the complete diagram analysis explanation as a PDF
   */
  const handleDownloadPdf = async () => {
    if (!analysisResult) return;
    setIsDownloadingPdf(true);
    try {
      await downloadDiagramAnalysisPdf({
        analysis: analysisResult,
        imagePreview,
        languageName: selectedLanguage.language,
        dialectName: selectedLanguage.name,
      });
    } catch (err) {
      console.error("Error generating diagram PDF:", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Run Vision Analysis - Supports auto-trigger when image is uploaded
  const handleAnalyzeDiagram = async (overrideBase64?: string, overrideMime?: string) => {
    const targetBase64 = overrideBase64 || imageBase64;
    const targetMime = overrideMime || mimeType;

    if (!targetBase64) {
      setValidationError("Please upload or select a diagram image (PNG, JPG, WebP) first.");
      return;
    }

    setValidationError(null);
    setIsAnalyzing(true);
    stopAllSpeech();

    try {
      const res = await fetch('/api/diagram/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetBase64,
          mimeType: targetMime,
          selectedLanguage: selectedLanguage.name,
          language: selectedLanguage.language,
          dialect: selectedLanguage.name,
          languageCode: selectedLanguage.code || 'hi-IN',
          userPrompt: userQuery.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.diagramTitle) {
        setIsCustomAnalyzed(true);
        setAnalysisResult(data);

        // History Log to Active User & Real-time Update
        recordUserHistory({
          userId: CURRENT_USER_ID,
          category: 'diagram',
          title: `Diagram Analysis: ${data.diagramTitle}`,
          summary: `Multimodal vision breakdown of ${data.components?.length || 0} sub-components in ${data.subject}.`,
          data: data
        }).catch(err => console.warn(err));

        // AUTO-SPEAK: If auto-speak is enabled, automatically begin speaking the text!
        if (autoSpeakEnabled) {
          // Give brief pause for UI to render then speak
          setTimeout(() => {
            startFullNarration(data);
          }, 350);
        }
      } else {
        setValidationError("Could not analyze this diagram image. Please ensure the image is clear and try again.");
      }
    } catch (e) {
      console.error("Diagram analysis failed:", e);
      setValidationError("Failed to analyze image. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // File upload handler - Automatically uploads AND triggers AI analysis & speech
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);
    const mType = file.type || 'image/jpeg';
    setMimeType(mType);
    stopAllSpeech();

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      setImagePreview(resultStr);
      // Remove data URL prefix for API base64 payload
      const base64Data = resultStr.split(',')[1];
      setImageBase64(base64Data);

      // Immediately run Vision AI analysis on upload so text & speech are produced automatically!
      handleAnalyzeDiagram(base64Data, mType);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 section-header-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/70 border border-orange-200/50 dark:border-orange-800/60 text-[#ea580c] dark:text-orange-400 text-xs font-bold mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{labels.diagramStudio}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight section-header-title">
            {labels.diagramTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1 section-header-desc">
            {labels.diagramDesc}
          </p>
        </div>

        {onNavigateToHistory && (
          <button
            onClick={onNavigateToHistory}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#ea580c] dark:hover:text-orange-400 shadow-sm transition-all cursor-pointer"
          >
            {labels.savedInHistory} &rarr;
          </button>
        )}
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

      {/* Control / Upload Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ea580c] text-xs font-bold border border-orange-200 cursor-pointer transition-colors shrink-0">
            <Upload className="w-4 h-4" />
            <span>{imagePreview ? labels.uploadDoc : labels.uploadDiagramBtn}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder={labels.diagramQuestionPlaceholder}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <div className="lg:col-span-5 flex items-center justify-start lg:justify-end gap-2">
          <button
            onClick={() => handleAnalyzeDiagram()}
            disabled={isAnalyzing}
            className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isAnalyzing ? labels.analyzingDiagram : labels.analyzeVisionBtn}</span>
          </button>
        </div>
      </div>

      {/* Main View: EMPTY STATE vs ANALYSIS BREAKDOWN */}
      {!analysisResult ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 sm:p-14 border border-slate-200/80 dark:border-slate-800 shadow-md text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-orange-950/50 text-[#ea580c] border border-orange-200 dark:border-orange-800/60 flex items-center justify-center mx-auto shadow-inner">
            <FileImage className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {imagePreview ? "Diagram Uploaded & Processing..." : labels.noDiagramTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {imagePreview
                ? "Analyzing diagram image with AI Vision... Once analysis finishes, AI will speak and explain each part aloud."
                : labels.noDiagramDesc}
            </p>
          </div>

          {imagePreview && (
            <div className="max-w-xs mx-auto p-3 rounded-2xl border border-orange-200 dark:border-orange-800 bg-orange-50/40 dark:bg-orange-950/30">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">Selected Diagram Image:</p>
              <img src={imagePreview} alt="Selected preview" className="max-h-44 rounded-xl mx-auto object-contain border border-orange-100 dark:border-orange-800/50 bg-white dark:bg-slate-800" />
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                const sample = getLocalizedDiagram(selectedLanguage.id);
                setIsCustomAnalyzed(false);
                setAnalysisResult(sample);
                setImagePreview(null);
                setImageBase64(null);
              }}
              className="px-5 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-950/70 text-[#ea580c] border border-orange-200 dark:border-orange-800 text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load {selectedLanguage.name} Sample Diagram</span>
            </button>
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ea580c]" />
              <span>Instant AI Vision analysis & Speech output upon upload</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <input 
                type="checkbox" 
                checked={autoSpeakEnabled} 
                onChange={(e) => setAutoSpeakEnabled(e.target.checked)}
                className="rounded accent-orange-600"
              />
              <span className="text-slate-700 dark:text-slate-200 text-xs">Auto-speak text when uploaded</span>
            </label>
          </div>
        </div>
      ) : (
      <div className="space-y-6">
        {/* TOP BAR: AI SPEECH & AUDIO CONTROLLER */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50 dark:from-slate-800/90 dark:via-slate-800 dark:to-slate-800/90 rounded-3xl p-4 sm:p-5 border border-orange-200/80 dark:border-orange-900/40 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Left: Current Speech Status */}
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isPlayingAudio 
                ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/25 ring-4 ring-orange-200/60 dark:ring-orange-900/40' 
                : 'bg-white dark:bg-slate-700 text-[#ea580c] border border-orange-200 dark:border-slate-600'
            }`}>
              {isPlayingAudio ? (
                <div className="flex items-end justify-center gap-0.5 h-4 w-4">
                  <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_100ms] h-full" />
                  <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_250ms] h-2/3" />
                  <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_400ms] h-5/6" />
                </div>
              ) : (
                <Headphones className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#ea580c]">
                  {isPlayingAudio ? (isAudioPaused ? "AI Speech Paused" : "AI Speaking Aloud") : "AI Audio Voice"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-200/70 dark:bg-orange-900/50 font-bold text-orange-900 dark:text-orange-200">
                  {selectedLanguage.name}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 mt-0.5">
                {isPlayingAudio && activeSegmentTitle 
                  ? activeSegmentTitle 
                  : "Listen to the complete diagram explanation, components, and steps."}
              </p>
            </div>
          </div>

          {/* Right: Audio Playback Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Play Full Walkthrough Button */}
            <button
              onClick={() => {
                if (isPlayingAudio && !isAudioPaused) {
                  pauseSpeech();
                } else if (isPlayingAudio && isAudioPaused) {
                  resumeSpeech();
                } else {
                  startFullNarration(analysisResult);
                }
              }}
              className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isPlayingAudio && !isAudioPaused ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isAudioPaused ? "Resume Narration" : "Listen to Full Walkthrough"}</span>
                </>
              )}
            </button>

            {/* Stop Speech Button */}
            {isPlayingAudio && (
              <button
                onClick={stopAllSpeech}
                title="Stop audio playback"
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            )}

            {/* Speed Selector */}
            <div className="inline-flex items-center p-0.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs">
              {[0.8, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changeSpeechSpeed(rate)}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    speechSpeed === rate
                      ? 'bg-orange-100 dark:bg-orange-950 text-[#ea580c] dark:text-orange-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Auto-Speak Toggle */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-slate-700 dark:text-slate-200 cursor-pointer font-medium select-none ml-1">
              <input
                type="checkbox"
                checked={autoSpeakEnabled}
                onChange={(e) => setAutoSpeakEnabled(e.target.checked)}
                className="rounded accent-orange-600 w-3.5 h-3.5"
              />
              <span className="text-[11px] font-semibold">Auto-Speak</span>
            </label>

            {/* Download Explanation PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              title="Download complete diagram explanation, components, and process as a PDF"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 ml-auto md:ml-0"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-orange-400" />
                  <span>Download Explanation PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column Diagram & Breakdown Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Image Canvas & Dialect Audio Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Input Diagram
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#ea580c]">
                  {analysisResult.subject}
                </span>
                <button
                  onClick={() => {
                    stopAllSpeech();
                    setIsCustomAnalyzed(false);
                    setAnalysisResult(null);
                    setImagePreview(null);
                    setImageBase64(null);
                    setUserQuery('');
                  }}
                  className="text-[11px] text-slate-400 hover:text-red-600 font-medium cursor-pointer"
                >
                  {labels.resetBtn}
                </button>
              </div>
            </div>

            <div className="w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center overflow-hidden relative group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Uploaded diagram"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <FileImage className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{analysisResult.diagramTitle}</p>
                  <p className="text-[11px] text-slate-400">{analysisResult.subject}</p>
                </div>
              )}
            </div>

            {/* Spoken Dialect Audio Box */}
            <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
              activeSegmentId === 'dialect-explanation'
                ? 'bg-orange-100/80 dark:bg-orange-950/60 border-[#ea580c] ring-2 ring-orange-400/40 shadow-sm'
                : 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-200/80 dark:border-orange-900/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#ea580c]" />
                  <span>{labels.audioExplanationHeader}</span>
                </span>
                <span className="text-[10px] font-bold text-[#ea580c] uppercase">
                  {selectedLanguage.name}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed">
                "{analysisResult.explanationInLanguage}"
              </p>

              <button
                onClick={() => speakSpecificSegment(
                  'dialect-explanation',
                  `${selectedLanguage.name} Explanation`,
                  analysisResult.explanationInLanguage
                )}
                className="w-full py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {activeSegmentId === 'dialect-explanation' && isPlayingAudio && !isAudioPaused ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Dialect Voice</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{labels.listenAudioBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Deep Multimodal Component Breakdown with Individual Speech */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6">
            {/* Title, Subject and Summary with Speak Button */}
            <div className={`p-4 rounded-2xl transition-all border ${
              activeSegmentId === 'title-summary'
                ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-400 ring-2 ring-orange-300/40'
                : 'border-transparent'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {analysisResult.diagramTitle}
                  </h3>
                  <span className="inline-block mt-1 text-[11px] font-bold text-[#ea580c] uppercase tracking-wide">
                    {analysisResult.subject}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakSpecificSegment(
                      'title-summary',
                      `Overview: ${analysisResult.diagramTitle}`,
                      `${analysisResult.diagramTitle}. ${analysisResult.subject}. ${analysisResult.summary}`
                    )}
                    title="Listen to Diagram Overview"
                    className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                      activeSegmentId === 'title-summary' && isPlayingAudio
                        ? 'bg-[#ea580c] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:text-[#ea580c]'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen</span>
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    title="Download Diagram Explanation as PDF"
                    className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#ea580c] dark:text-orange-300 border border-orange-200/80 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold disabled:opacity-60 shadow-xs"
                  >
                    {isDownloadingPdf ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                {analysisResult.summary}
              </p>
            </div>

            {/* Key Components Breakdown with Speech On Each Item */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#ea580c]" />
                  <span>{labels.componentsHeader} ({analysisResult.components?.length || 0})</span>
                </h4>

                <button
                  onClick={() => {
                    const compSegments = analysisResult.components.map((c, i) => ({
                      id: `comp-${i}`,
                      label: `Component: ${c.name}`,
                      text: `${c.name}. ${c.visualLocation ? `Location: ${c.visualLocation}. ` : ''}${c.functionDescription}`
                    }));
                    currentSegmentsRef.current = compSegments;
                    playSegmentAt(compSegments, 0, speechSpeed);
                  }}
                  className="text-[11px] font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to all components</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {analysisResult.components?.map((comp, idx) => {
                  const compId = `comp-${idx}`;
                  const isCompActive = activeSegmentId === compId;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-xs transition-all ${
                        isCompActive
                          ? 'bg-orange-50/90 dark:bg-orange-950/50 border-[#ea580c] ring-2 ring-orange-400/50 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50/40 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCompActive 
                              ? 'bg-[#ea580c] text-white' 
                              : 'bg-orange-100 dark:bg-orange-950 text-[#ea580c]'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-sm">{comp.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {comp.visualLocation && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              Loc: {comp.visualLocation}
                            </span>
                          )}
                          <button
                            onClick={() => speakSpecificSegment(
                              compId,
                              `Component: ${comp.name}`,
                              `${comp.name}. ${comp.visualLocation ? `Located at ${comp.visualLocation}. ` : ''}${comp.functionDescription}`
                            )}
                            title={`Speak ${comp.name}`}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isCompActive && isPlayingAudio
                                ? 'bg-[#ea580c] text-white'
                                : 'text-slate-400 hover:text-[#ea580c] hover:bg-orange-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 pl-7 leading-relaxed">
                        {comp.functionDescription}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Flow with Individual Step Audio */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#ea580c]" />
                  <span>{labels.stepByStepHeader}</span>
                </h4>

                <button
                  onClick={() => {
                    const stepSegments = analysisResult.stepByStepProcess.map((s, i) => ({
                      id: `step-${i}`,
                      label: `Step ${i + 1}`,
                      text: `Step ${i + 1}: ${s}`
                    }));
                    currentSegmentsRef.current = stepSegments;
                    playSegmentAt(stepSegments, 0, speechSpeed);
                  }}
                  className="text-[11px] font-bold text-[#ea580c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to all steps</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {analysisResult.stepByStepProcess?.map((step, idx) => {
                  const stepId = `step-${idx}`;
                  const isStepActive = activeSegmentId === stepId;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-2.5 transition-all ${
                        isStepActive
                          ? 'bg-orange-100/90 dark:bg-orange-950/60 border-[#ea580c] ring-2 ring-orange-400/50 shadow-md'
                          : 'bg-orange-50/50 dark:bg-slate-800/40 border-orange-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-[#ea580c] text-xs">
                          Step {idx + 1}:
                        </span>
                        <p className="text-slate-700 dark:text-slate-200 leading-snug">{step}</p>
                      </div>

                      <button
                        onClick={() => speakSpecificSegment(
                          stepId,
                          `Step ${idx + 1}`,
                          `Step ${idx + 1}: ${step}`
                        )}
                        title={`Speak Step ${idx + 1}`}
                        className={`p-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                          isStepActive && isPlayingAudio
                            ? 'bg-[#ea580c] text-white'
                            : 'text-slate-400 hover:text-[#ea580c] hover:bg-orange-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Google Search Grounding Verification */}
            {analysisResult && (analysisResult.isGrounded || (analysisResult.groundingSources && analysisResult.groundingSources.length > 0)) && (
              <div className="pt-3">
                <GroundingSourcesList
                  sources={analysisResult.groundingSources}
                  searchQueries={analysisResult.searchQueries}
                  isGrounded={analysisResult.isGrounded}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
