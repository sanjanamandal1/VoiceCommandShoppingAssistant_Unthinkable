import { useState, useEffect, useRef, useCallback } from 'react';

// Supported recognition languages. Only en-US has full parser support;
// es-ES changes the recognition language but the rule-based parser still operates in English.
// Full multilingual NLP is out of scope — see README.
export const SUPPORTED_LANGS = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'es-ES', label: 'Español (ES) — beta' },
  { code: 'fr-FR', label: 'Français (FR) — beta' },
];

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

export function useSpeechRecognition(lang = 'en-US') {
  const [state, setState] = useState('idle'); // idle | listening | processing | error | unsupported
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const isSupported = Boolean(SR);

  useEffect(() => {
    if (!isSupported) {
      setState('unsupported');
      return;
    }

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState('listening');
      setTranscript('');
      setInterimTranscript('');
      setError(null);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (interim) setInterimTranscript(interim);
      if (final) {
        setTranscript(final.trim());
        setInterimTranscript('');
        setState('processing');
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Allow mic access in browser settings.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Try again.');
      } else {
        setError(`Recognition error: ${event.error}`);
      }
      setState('error');
    };

    recognition.onend = () => {
      // Only go back to idle if we didn't already get a result
      setState((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [lang, isSupported]);

  const start = useCallback(() => {
    if (!isSupported || state === 'listening') return;
    setError(null);
    try {
      recognitionRef.current.start();
    } catch {
      // Ignore "already started" race condition
    }
  }, [isSupported, state]);

  const stop = useCallback(() => {
    if (state !== 'listening') return;
    recognitionRef.current?.stop();
    setState('idle');
  }, [state]);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    setState('idle');
  }, []);

  return { state, transcript, interimTranscript, error, isSupported, start, stop, reset };
}
