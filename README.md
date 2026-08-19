# Voice Command Shopping Assistant

A browser-based grocery list manager that accepts voice commands to add, remove, search, and check off items.

---

## Demo

**Live app:** `<add after deployment>`

Voice features require Chrome (or a Chromium-based browser) — the Web Speech API is not supported in Firefox and behaves inconsistently in Safari. A text input form is always visible as a fallback; everything except voice works in any browser.

---

## Features

### Voice Input
- Start/stop listening button with a pulsing animation while active; live interim transcript shown as you speak
- Four intents recognised: **add**, **remove**, **search**, **check off** — each with multiple accepted phrasings (e.g. "add milk", "I need apples", "I want to buy bananas", "we need rice", "grab eggs")
- Quantity extraction from voice: numeric ("add 2 bottles of water") and word-form ("add three bags of chips")
- After each recognised command, the app speaks a confirmation back using `SpeechSynthesis` ("Added 2 bottles of water to your list.")
- When the parser can't determine intent with confidence, a dialog appears asking "Did you mean: add X?" rather than silently doing nothing or guessing wrong
- Language selector for recognition language (en-US, es-ES, fr-FR) — changes only the Web Speech API `lang` param; the command parser itself is English-only

### Smart Suggestions
- Re-add suggestions based on localStorage removal history: items removed more often surface higher, filtered to exclude anything already on the current list (top 5 shown)
- Seasonal suggestions from a **hardcoded static list** of 5 items, labeled "Mock data" in the UI — not live or date-aware
- Substitute suggestions for any checked-off items, pulled from a **hardcoded mapping** (~20 entries, e.g. milk → almond milk, oat milk, soy milk)

### List Management
- Add, remove, and check off items by voice or by typing; both paths are always available
- Adding an item already on the list bumps its quantity rather than creating a duplicate
- Items are auto-categorised on add using a keyword-to-category lookup table (~150 entries across Dairy, Produce, Bakery, Meat & Seafood, Beverages, Snacks, Frozen, Pantry, Household) with a longest-match substring fallback — not a classifier
- List grouped by category in a fixed display order; categories not in the predefined list fall into "Other"
- Checked items can be bulk-removed; list and removal history both persist across page reloads via `localStorage`

### Voice-Activated Search
- Saying "search for X" or "find X" passes the query to the product catalog panel and filters results in real time
- Catalog search panel also accepts typed queries; results filterable by brand and max price (₹)
- Product catalog is **18 hardcoded items** representing Indian grocery brands (Amul, Britannia, Bisleri, India Gate, etc.) with mock INR prices — no live data source

---

## Architecture & key decisions

- **Rule-based command parser instead of an LLM call** — deterministic, free, testable with unit tests, and fast enough for the fixed command vocabulary in scope. An LLM would add API cost, a required secret, and non-determinism with no accuracy benefit for patterns like "add 2 bottles of water." Worth revisiting only if the command space became open-ended.
- **Web Speech API instead of a paid STT service** — zero cost, no API keys, works entirely client-side. The tradeoff is Chrome-only support in practice; the always-visible text input covers this gap.
- **`localStorage` instead of a backend** — a single-user demo with no auth requirement doesn't need a database. Adding a backend would also require deployment infrastructure that's out of scope for the assessment.
- **Hand-written CSS instead of a UI kit or Tailwind** — keeps the dependency count minimal and avoids the component-library aesthetic. About 460 lines of vanilla CSS with custom properties and one media breakpoint.
- **Ambiguity dialog on low-confidence parse instead of silent failure or a silent guess** — when no intent pattern matches, the app asks "Did you mean: add X?" This costs almost nothing to implement but meaningfully improves the demo; the parser never silently adds a wrong item.
- **Vitest instead of Jest** — already bundled with Vite, so no additional config or install was needed.

---

## Tech stack

- React 19, Vite 8
- Browser Web Speech API (`SpeechRecognition`, `SpeechSynthesis`) — no external voice library
- Vitest 4 (dev dependency, parser unit tests only)
- Vanilla CSS — no UI kit, no Tailwind

---

## Setup & run

```bash
# 1. Clone
git clone https://github.com/sanjanamandal1/VoiceCommandShoppingAssistant_Unthinkable.git
cd VoiceCommandShoppingAssistant_Unthinkable

# 2. Install
npm install

# 3. Run dev server
npm run dev
# Opens at http://localhost:5173

# 4. Build for production
npm run build
```

**Microphone access:** the browser will prompt for mic permission on first use. The app must be served from `localhost` or an HTTPS origin — the Web Speech API is blocked on plain HTTP.

---

## Known limitations

- Voice input only works reliably in Chrome; Safari's Web Speech API support is inconsistent, Firefox has none.
- The language selector changes the recognition language only — commands in Spanish or French are heard but still parsed by English regex patterns, so they'll almost always miss.
- Product catalog is 18 hardcoded items with fictional prices; there's no real grocery data source.
- Seasonal suggestions are a static list and are not date-aware — "In season" labels are illustrative only.
- The ambiguity dialog only offers "add" as the fallback action; it doesn't attempt to infer remove or search from a low-confidence transcript.

---

## Testing

The parser has 14 unit tests covering intent detection and quantity/unit extraction. Run with:

```bash
npm run test
```

Cases covered: "add milk", "I need apples", "I want to buy bananas", "I want bananas", "remove milk", "add 2 bottles of water", "add three bags of chips", "search for eggs", "find orange juice", "check off bread", "we need oat milk", unrecognised input (low confidence), empty string, and article stripping ("add a loaf of bread").

---

## Possible next steps

- Replace the mock product catalog with a real grocery API (e.g. Open Food Facts) for actual product data and prices
- Add per-language command patterns to the parser, or use an LLM as a fallback for unmatched transcripts
- Shared lists via a lightweight backend — useful for households, and the localStorage model is easy to swap out
- Expand the ambiguity dialog to offer intent options (add / remove / search) rather than defaulting to "add"
