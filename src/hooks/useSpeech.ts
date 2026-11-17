import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '../types';

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionResultEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [subIndex: number]: { transcript: string };
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useSpeech() {
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsRecognitionSupported(Boolean(SpeechRec));
    return () => {
      recognitionRef.current?.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = useCallback(
    (language: Language, onTranscript: (text: string) => void) => {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        setSpeechError('Voice recognition is not supported in this browser.');
        return;
      }

      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
        return;
      }

      setSpeechError(null);
      const recognition = new SpeechRec();
      recognition.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        let combined = '';
        for (let i = 0; i < event.results.length; i++) {
          combined += event.results[i][0].transcript;
        }
        onTranscript(combined.trim());
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError(
            language === 'ur'
              ? 'مائیکروفون کی اجازت نہیں دی گئی۔ براؤزر سیٹنگز میں مائیکروفون کی اجازت دیں۔'
              : 'Microphone permission was denied. Please allow microphone access in your browser.',
          );
        } else if (event.error !== 'aborted') {
          setSpeechError(
            language === 'ur'
              ? 'آواز واضح سنائی نہیں دی، براہِ کرم دوبارہ کوشش کریں۔'
              : 'Could not hear clearly. Please try speaking again or type your question.',
          );
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
        setSpeechError('Unable to start microphone right now.');
      }
    },
    [isListening],
  );

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setLoadingAudioId(null);
  }, []);

  const speakWithBrowserFallback = useCallback(
    (id: string, text: string, language: Language) => {
      if (!('speechSynthesis' in window)) {
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.92;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  const speak = useCallback(
    async (id: string, text: string, language: Language) => {
      if (speakingId === id) {
        stopSpeaking();
        return;
      }
      stopSpeaking();

      const cleanText = text.trim().slice(0, 600);
      if (!cleanText) return;

      setLoadingAudioId(id);
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, language }),
        });

        if (!res.ok) {
          throw new Error('TTS request failed');
        }

        const data = (await res.json()) as { audioBase64?: string; mimeType?: string };
        if (!data.audioBase64) {
          throw new Error('Missing audio payload');
        }

        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
        audioRef.current = audio;
        audio.onended = () => {
          setSpeakingId(null);
          audioRef.current = null;
        };
        audio.onerror = () => {
          setSpeakingId(null);
          audioRef.current = null;
        };
        setLoadingAudioId(null);
        setSpeakingId(id);
        await audio.play();
      } catch {
        setLoadingAudioId(null);
        speakWithBrowserFallback(id, cleanText, language);
      }
    },
    [speakingId, stopSpeaking, speakWithBrowserFallback],
  );

  return {
    isRecognitionSupported,
    isListening,
    speechError,
    speakingId,
    loadingAudioId,
    startListening,
    speak,
    stopSpeaking,
  };
}
