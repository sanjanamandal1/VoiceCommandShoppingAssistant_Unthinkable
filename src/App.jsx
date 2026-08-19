import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition.js';
import { useShoppingList } from './hooks/useShoppingList.js';
import { parse } from './lib/parser.js';
import MicButton from './components/MicButton.jsx';
import TranscriptDisplay from './components/TranscriptDisplay.jsx';
import ShoppingList from './components/ShoppingList.jsx';
import AddItemForm from './components/AddItemForm.jsx';
import ConfirmationDialog from './components/ConfirmationDialog.jsx';
import SuggestionsPanel from './components/SuggestionsPanel.jsx';
import SearchFilter from './components/SearchFilter.jsx';

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  window.speechSynthesis.speak(utterance);
}

export default function App() {
  const { state, transcript, interimTranscript, error, isSupported, start, stop, reset } =
    useSpeechRecognition('en-US');

  const {
    items,
    addItem,
    removeItem,
    removeByName,
    toggleCheck,
    checkByName,
    clearChecked,
  } = useShoppingList();

  const [confirmation, setConfirmation] = useState('');
  const [pendingItem, setPendingItem] = useState(null); // for ambiguity dialog
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceSearchQuery, setVoiceSearchQuery] = useState('');

  const confirmationTimer = useRef(null);

  const showConfirmation = useCallback((msg) => {
    setConfirmation(msg);
    clearTimeout(confirmationTimer.current);
    confirmationTimer.current = setTimeout(() => setConfirmation(''), 4000);
  }, []);

  // Process a finalized transcript from voice recognition
  useEffect(() => {
    if (!transcript || state !== 'processing') return;

    const parsed = parse(transcript);

    if (parsed.intent === 'add' && parsed.confidence === 'high') {
      const added = addItem(parsed.item, parsed.quantity, parsed.unit);
      const qty = parsed.quantity > 1 ? `${parsed.quantity} ` : '';
      const unit = parsed.unit ? `${parsed.unit} of ` : '';
      const msg = `Added ${qty}${unit}${added} to your list.`;
      showConfirmation(msg);
      speak(msg);
      reset();
    } else if (parsed.intent === 'remove' && parsed.confidence === 'high') {
      removeByName(parsed.item);
      const msg = `Removed ${parsed.item} from your list.`;
      showConfirmation(msg);
      speak(msg);
      reset();
    } else if (parsed.intent === 'search') {
      setSearchQuery(parsed.item);
      setVoiceSearchQuery(parsed.item);
      const msg = `Searching for ${parsed.item}.`;
      showConfirmation(msg);
      speak(msg);
      reset();
    } else if (parsed.intent === 'check') {
      checkByName(parsed.item);
      const msg = `Checked off ${parsed.item}.`;
      showConfirmation(msg);
      speak(msg);
      reset();
    } else {
      // Low confidence — ask rather than guess
      const candidate = parsed.item || transcript;
      setPendingItem(candidate);
      speak(`Did you mean: add ${candidate}?`);
      // Note: don't call reset() here — we wait for user to confirm/dismiss
    }
  }, [transcript, state]);

  const handleConfirmAdd = () => {
    if (!pendingItem) return;
    const added = addItem(pendingItem);
    const msg = `Added ${added} to your list.`;
    showConfirmation(msg);
    speak(msg);
    setPendingItem(null);
    reset();
  };

  const handleDismissDialog = () => {
    setPendingItem(null);
    showConfirmation('Command cancelled.');
    reset();
  };

  const handleManualAdd = (name, quantity) => {
    addItem(name, quantity);
    const msg = `Added ${name} to your list.`;
    showConfirmation(msg);
  };

  const handleSuggestionAdd = (name) => {
    addItem(name);
    showConfirmation(`Added ${name} to your list.`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-header__title">
          <span aria-hidden="true">🛒</span> Voice Shopping Assistant
        </h1>


      </header>

      <main className="app-main">
        {!isSupported && (
          <div className="unsupported-banner" role="alert">
            <strong>Voice input not supported</strong> — your browser doesn&apos;t support the Web Speech API.
            Chrome is recommended. Use the text form below to manage your list.
          </div>
        )}

        <div className="voice-section">
          <MicButton
            state={state}
            onStart={start}
            onStop={stop}
            disabled={!isSupported}
          />
          <TranscriptDisplay
            state={state}
            interim={interimTranscript}
            transcript={transcript}
            confirmation={confirmation}
            error={error}
          />
        </div>

        <AddItemForm onAdd={handleManualAdd} />

        {pendingItem && (
          <ConfirmationDialog
            text={pendingItem}
            onConfirm={handleConfirmAdd}
            onDismiss={handleDismissDialog}
          />
        )}

        <div className="app-body">
          <div className="app-body__left">
            {items.length > 0 && searchQuery && (
              <div className="search-active-bar">
                <span>Filtering: &ldquo;{searchQuery}&rdquo;</span>
                <button
                  className="search-active-bar__clear"
                  onClick={() => { setSearchQuery(''); setVoiceSearchQuery(''); }}
                  aria-label="Clear search filter"
                >
                  Clear
                </button>
              </div>
            )}
            <ShoppingList
              items={items}
              searchQuery={searchQuery}
              onRemove={removeItem}
              onToggle={toggleCheck}
              onClearChecked={clearChecked}
            />
            <SuggestionsPanel items={items} onAdd={handleSuggestionAdd} />
          </div>

          <div className="app-body__right">
            <SearchFilter
              voiceQuery={voiceSearchQuery}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Voice input tested in Chrome · Data stored locally · <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
}
