import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition.js';
import { useShoppingList } from './hooks/useShoppingList.js';
import { parse } from './lib/parser.js';
import { speak } from './lib/speech.js';
import MicButton from './components/MicButton.jsx';
import TranscriptDisplay from './components/TranscriptDisplay.jsx';
import ShoppingList from './components/ShoppingList.jsx';
import AddItemForm from './components/AddItemForm.jsx';
import ConfirmationDialog from './components/ConfirmationDialog.jsx';
import SuggestionsPanel from './components/SuggestionsPanel.jsx';
import SearchFilter from './components/SearchFilter.jsx';

export default function App() {
  const { state, transcript, alternatives, interimTranscript, error, isSupported, start, stop, reset } =
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
  const [voiceMaxPrice, setVoiceMaxPrice] = useState(null);

  const confirmationTimer = useRef(null);

  const showConfirmation = useCallback((msg) => {
    setConfirmation(msg);
    clearTimeout(confirmationTimer.current);
    confirmationTimer.current = setTimeout(() => setConfirmation(''), 4000);
  }, []);

  // Keyboard shortcut: Space or M toggles the microphone
  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === ' ' || e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (state === 'listening') stop();
        else if (state === 'idle') start();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state, start, stop]);

  // Process a finalized transcript from voice recognition.
  // Tries every recognition alternative through the parser and uses the first
  // high-confidence result — significantly improves accuracy when the top transcript
  // doesn't match a known pattern but a lower-ranked alternative does.
  useEffect(() => {
    if (!transcript || state !== 'processing') return;

    // Build candidate list: all alternatives + raw transcript as final fallback
    const candidates = alternatives.length > 0
      ? alternatives.map((a) => a.transcript)
      : [transcript];

    // Parse each candidate; use the first high-confidence result
    let parsed = null;
    for (const candidate of candidates) {
      const result = parse(candidate);
      if (result.confidence === 'high') {
        parsed = result;
        break;
      }
      if (!parsed) parsed = result; // keep first result as fallback
    }

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
      if (parsed.maxPrice != null) {
        setVoiceMaxPrice(parsed.maxPrice);
      }
      const priceMsg = parsed.maxPrice ? ` under ₹${parsed.maxPrice}` : '';
      const msg = `Searching for ${parsed.item}${priceMsg}.`;
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
      // Low confidence across all alternatives — ask rather than guess
      const fallback = parsed.item || transcript;
      setPendingItem(fallback);
      speak(`Did you mean: add ${fallback}?`);
      // Note: don't call reset() here — we wait for user to confirm/dismiss
    }
  }, [transcript, alternatives, state, addItem, removeByName, checkByName, showConfirmation, reset]);

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
          Voice Shopping
          <span className="header-badge">Assistant</span>
        </h1>
        <div className="header-right">
          {items.length > 0 && (
            <span className="header-count" aria-label={`${items.length} items on list`}>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          )}
          {!isSupported && (
            <span className="header-unsupported-badge" role="status">
              Voice unsupported — use text input
            </span>
          )}
        </div>
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
                <span>Filtering: &ldquo;{searchQuery}&rdquo;{voiceMaxPrice ? ` (under ₹${voiceMaxPrice})` : ''}</span>
                <button
                  className="search-active-bar__clear"
                  onClick={() => { setSearchQuery(''); setVoiceSearchQuery(''); setVoiceMaxPrice(null); }}
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
              voiceMaxPrice={voiceMaxPrice}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Voice input tested in Chrome · Data stored locally · <a href="https://github.com/sanjanamandal1/VoiceCommandShoppingAssistant_Unthinkable" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
}
