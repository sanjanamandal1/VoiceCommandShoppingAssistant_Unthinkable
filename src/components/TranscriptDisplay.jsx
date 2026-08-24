import React from 'react';

export default function TranscriptDisplay({ state, interim, transcript, confirmation, error }) {
  const showListening = state === 'listening';
  const showInterim = showListening && interim;
  const showTranscript = transcript && (state === 'processing' || state === 'idle' || state === 'error');

  return (
    <div className="transcript-display" aria-label="Voice input status">
      {error && (
        <p className="transcript-error" role="alert">{error}</p>
      )}

      {!error && showListening && !showInterim && (
        <p className="transcript-hint">Listening… say a command</p>
      )}

      {showInterim && (
        <p className="transcript-interim" aria-live="off">
          <em>{interim}</em>
        </p>
      )}

      {showTranscript && !showInterim && (
        <p className="transcript-final">
          <span className="transcript-label">Heard: </span>
          &ldquo;{transcript}&rdquo;
        </p>
      )}

      {confirmation && (
        <p className="transcript-confirmation" aria-live="polite" role="status">
          {confirmation}
        </p>
      )}

      {state === 'idle' && !transcript && !error && (
        <p className="transcript-idle">Press the mic button or type below</p>
      )}
    </div>
  );
}
