import { useState, useEffect, useRef, useCallback } from 'react';
import { parseVoiceCommand, VoiceCommandResult } from '../utils/voiceCommands';
import { LearningToolId, DialectOption } from '../types';
import { speakText } from '../utils/bionic';

export interface UseVoiceCommandsOptions {
  currentLanguageCode?: string;
  speechRate?: number;
  onNavigate?: (tool: LearningToolId) => void;
  onSwitchLanguage?: (lang: DialectOption) => void;
  onToggleTheme?: () => void;
  onToggleShortcuts?: () => void;
  onStopAudio?: () => void;
  onRepeatAudio?: () => void;
  onToggleFullscreen?: () => void;
  onToggleDyslexia?: () => void;
  onClearChat?: () => void;
}

export function useVoiceCommands(options: UseVoiceCommandsOptions = {}) {
  const {
    currentLanguageCode = 'hi-IN',
    speechRate = 1.0,
    onNavigate,
    onSwitchLanguage,
    onToggleTheme,
    onToggleShortcuts,
    onStopAudio,
    onRepeatAudio,
    onToggleFullscreen,
    onToggleDyslexia,
    onClearChat,
  } = options;

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isHandsFree, setIsHandsFree] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<VoiceCommandResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const isHandsFreeRef = useRef<boolean>(false);
  const isListeningRef = useRef<boolean>(false);
  const feedbackTimeoutRef = useRef<any>(null);

  // Keep ref synchronized with hands-free state
  useEffect(() => {
    isHandsFreeRef.current = isHandsFree;
  }, [isHandsFree]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Check browser support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
    }
  }, []);

  // Audio feedback announcer
  const announceFeedback = useCallback(
    (text: string) => {
      if (!voiceFeedbackEnabled) return;
      try {
        speakText(text, currentLanguageCode, speechRate);
      } catch (e) {
        console.warn('Voice command audio feedback error:', e);
      }
    },
    [voiceFeedbackEnabled, currentLanguageCode, speechRate]
  );

  // Execute recognized command
  const executeCommand = useCallback(
    (command: VoiceCommandResult): boolean => {
      let executed = false;

      switch (command.action) {
        case 'NAVIGATE_TOOL':
          if (onNavigate && command.payload) {
            onNavigate(command.payload);
            executed = true;
          }
          break;

        case 'SWITCH_LANGUAGE':
          if (onSwitchLanguage && command.payload) {
            onSwitchLanguage(command.payload);
            executed = true;
          }
          break;

        case 'TOGGLE_THEME':
          if (onToggleTheme) {
            onToggleTheme();
            executed = true;
          }
          break;

        case 'TOGGLE_SHORTCUTS':
          if (onToggleShortcuts) {
            onToggleShortcuts();
            executed = true;
          }
          break;

        case 'STOP_AUDIO':
          if (onStopAudio) {
            onStopAudio();
            executed = true;
          }
          break;

        case 'REPEAT_AUDIO':
          if (onRepeatAudio) {
            onRepeatAudio();
            executed = true;
          }
          break;

        case 'TOGGLE_FULLSCREEN':
          if (onToggleFullscreen) {
            onToggleFullscreen();
            executed = true;
          }
          break;

        case 'TOGGLE_DYSLEXIA':
          if (onToggleDyslexia) {
            onToggleDyslexia();
            executed = true;
          }
          break;

        case 'CLEAR_CHAT':
          if (onClearChat) {
            onClearChat();
            executed = true;
          }
          break;

        default:
          break;
      }

      if (executed) {
        setLastExecutedCommand(command);
        announceFeedback(command.feedbackText);

        if (feedbackTimeoutRef.current) {
          clearTimeout(feedbackTimeoutRef.current);
        }
        feedbackTimeoutRef.current = setTimeout(() => {
          setLastExecutedCommand(null);
        }, 5000);
      }

      return executed;
    },
    [
      onNavigate,
      onSwitchLanguage,
      onToggleTheme,
      onToggleShortcuts,
      onStopAudio,
      onRepeatAudio,
      onToggleFullscreen,
      onToggleDyslexia,
      onClearChat,
      announceFeedback,
    ]
  );

  // Stop listening helper
  const stopListening = useCallback(() => {
    isHandsFreeRef.current = false;
    setIsHandsFree(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Start speech recognition instance
  const startListening = useCallback(
    (enableHandsFree = false) => {
      if (typeof window === 'undefined') return;
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setErrorMessage('Speech recognition is not supported in this browser.');
        return;
      }

      // Stop previous instance if active
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
        recognitionRef.current = null;
      }

      if (enableHandsFree) {
        setIsHandsFree(true);
        isHandsFreeRef.current = true;
      }

      setErrorMessage(null);

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        // Listen using selected dialect language code, fallback to English or Hindi
        recognition.lang = currentLanguageCode || 'hi-IN';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentFinal = '';
          let currentInterim = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const item = event.results[i];
            const spokenText = item[0].transcript;
            if (item.isFinal) {
              currentFinal += spokenText;
            } else {
              currentInterim += spokenText;
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
          }

          if (currentFinal) {
            const rawPhrase = currentFinal.trim();
            setTranscript(rawPhrase);
            setInterimTranscript('');

            // Test if speech corresponds to a voice command
            const matchedCommand = parseVoiceCommand(rawPhrase);
            if (matchedCommand) {
              executeCommand(matchedCommand);
            }
          }
        };

        recognition.onerror = (event: any) => {
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.warn('[useVoiceCommands] Speech recognition notice:', event.error);
          }
          if (event.error === 'not-allowed') {
            setErrorMessage('Microphone permission denied. Please allow microphone access.');
            stopListening();
          } else if (event.error === 'no-speech' || event.error === 'aborted') {
            // Expected normal speech recognition lifecycle states
          } else {
            setErrorMessage(`Voice recognition notice: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          // If hands-free continuous mode is active, automatically restart
          if (isHandsFreeRef.current) {
            setTimeout(() => {
              if (isHandsFreeRef.current) {
                try {
                  recognition.start();
                  setIsListening(true);
                } catch (restartErr) {
                  console.warn('[useVoiceCommands] Auto-restart error:', restartErr);
                }
              }
            }, 300);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('[useVoiceCommands] Failed to start recognition:', err);
        setErrorMessage('Unable to start microphone.');
        setIsListening(false);
      }
    },
    [currentLanguageCode, executeCommand, stopListening]
  );

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening(false);
    }
  }, [isListening, startListening, stopListening]);

  const toggleHandsFree = useCallback(() => {
    if (isHandsFree) {
      stopListening();
    } else {
      startListening(true);
    }
  }, [isHandsFree, startListening, stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    isHandsFree,
    transcript,
    interimTranscript,
    lastExecutedCommand,
    errorMessage,
    voiceFeedbackEnabled,
    setVoiceFeedbackEnabled,
    startListening,
    stopListening,
    toggleListening,
    toggleHandsFree,
    executeCommandManually: executeCommand,
  };
}
