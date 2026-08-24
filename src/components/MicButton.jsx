import React from 'react';

export default function MicButton({ state, onStart, onStop, disabled }) {
  const isListening = state === 'listening';
  const isProcessing = state === 'processing';

  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  const label = isListening
    ? 'Stop listening'
    : isProcessing
    ? 'Processing…'
    : 'Start voice input';

  return (
    <button
      id="mic-button"
      className={`mic-button ${isListening ? 'mic-button--listening' : ''} ${isProcessing ? 'mic-button--processing' : ''}`}
      onClick={handleClick}
      disabled={disabled || isProcessing}
      aria-label={label}
      aria-pressed={isListening}
    >
      <span className="mic-icon" aria-hidden="true">
        {isProcessing ? '⏳' : isListening ? '🔴' : '🎤'}
      </span>
      <span className="mic-label">{label}</span>
    </button>
  );
}
