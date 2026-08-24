import { useState, useEffect, useRef, useCallback } from 'react';

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

/**
 * Wraps the browser Web Speech API with:
 * - Up to 3 recognition alternatives per utterance (improves parser hit rate)
 * - Automatic single retry on no-speech before surfacing an error
 * - Interim transcript for real-time visual feedback
 *
 * Returns: { state, transcript, alternatives, interimTranscript, error, isSupported, start, stop, reset }
 * alternatives: [{ transcript: string, confidence: number }]
 */
export function useSpeechRecognition(lang = 'en-US') {
  const isSupported = Boolean(SR);
  const [state, setState] = useState(() => (isSupported ? 'idle' : 'unsupported'));
  const [transcript, setTranscript] = useState('');
  const [alternatives, setAlternatives] = useState([]); // all recognition candidates
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang;
    // Request up to 3 alternatives so the parser can pick the best-matching transcript
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setState('listening');
      setTranscript('');
      setAlternatives([]);
      setInterimTranscript('');
      setError(null);
    };

    recognition.onresult = (event) => {
      let interim = '';
      const alts = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          // Collect all alternatives for this final result
          for (let j = 0; j < event.results[i].length; j++) {
            alts.push({
              transcript: event.results[i][j].transcript.trim(),
              confidence: event.results[i][j].confidence,
            });
          }
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (interim) setInterimTranscript(interim);

      if (alts.length > 0) {
        retryCountRef.current = 0;
        setTranscript(alts[0].transcript);
        setAlternatives(alts);
        setInterimTranscript('');
        setState('processing');
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Auto-retry once on silence before surfacing an error
        if (retryCountRef.current < 1) {
          retryCountRef.current += 1;
          try {
            recognition.start();
          } catch {
            // If restart fails, fall through to error state
            setError('No speech detected. Please try again.');
            setState('error');
          }
        } else {
          retryCountRef.current = 0;
          setError('No speech detected. Please try again.');
          setState('error');
        }
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Allow mic access in browser settings.');
        setState('error');
      } else if (event.error === 'network') {
        setError('Network error during recognition. Check your connection.');
        setState('error');
      } else {
        setError(`Recognition error: ${event.error}`);
        setState('error');
      }
    };

    recognition.onend = () => {
      // Only go back to idle if we didn't already get a result or trigger retry
      setState((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [lang, isSupported]);

  const start = useCallback(() => {
    if (!isSupported || state === 'listening') return;
    retryCountRef.current = 0;
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
    setAlternatives([]);
    setInterimTranscript('');
    setError(null);
    setState('idle');
  }, []);

  return { state, transcript, alternatives, interimTranscript, error, isSupported, start, stop, reset };
}
