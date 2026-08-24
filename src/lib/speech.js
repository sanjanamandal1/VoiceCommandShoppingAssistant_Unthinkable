// src/lib/speech.js
// Thin wrapper around the browser SpeechSynthesis API.
// Called after voice commands to read confirmation messages back to the user.

export function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.onerror = () => {}; // suppress uncaught utterance errors
  window.speechSynthesis.speak(utterance);
}
