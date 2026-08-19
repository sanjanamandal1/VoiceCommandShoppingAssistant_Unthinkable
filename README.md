# Voice Shopping Assistant

A single-page web app for managing a grocery list with voice commands. Built as a timed technical assessment (~8 hours).

**Live demo:** _[Add Vercel/Netlify URL after deployment]_

---

## What was built

| Feature | Status |
|---|---|
| Voice input (start/stop, live transcript) | ✅ Built |
| Rule-based NLP parser — add/remove/search/check + quantity | ✅ Built |
| SpeechSynthesis voice confirmation after each action | ✅ Built |
| Graceful ambiguity dialog ("Did you mean add X?") | ✅ Built |
| Manual text fallback (always visible) | ✅ Built |
| Auto-categorize items (keyword lookup) | ✅ Built |
| Quantity parsing ("add 3 bags of chips") | ✅ Built |
| localStorage persistence | ✅ Built |
| History-based suggestions (from removed items) | ✅ Built |
| Substitute suggestions for checked items | ✅ Built |
| Voice-activated search (passes query to catalog filter) | ✅ Built |
| Mock product catalog with brand/price filters | ✅ Built (18 products, mock) |
| Seasonal suggestions | ✅ Built (static mock data) |
| Language selector (en-US / es-ES / fr-FR) | ✅ Built (stretch — recognition lang only, not NLP) |
| Parser unit tests (Vitest) | ✅ 14 tests, all passing |
| Accessibility (aria-live, keyboard nav, focus states) | ✅ Built |
| Responsive/mobile-first layout | ✅ Built |

## What's mocked / simplified and why

- **Product catalog** — 18 hardcoded items with fictional prices. A real catalog would require a backend or third-party API, which is out of scope for an 8-hour solo build. The README and UI both label this clearly.
- **Seasonal suggestions** — static list in `suggestions.js`. Live seasonal/sale data would require a grocery retailer API.
- **Multilingual NLP** — the language selector changes the Web Speech API `lang` parameter, so recognition works in Spanish/French. However, the rule-based parser is English-only. Full multilingual command parsing would require per-language regex sets or an LLM — both out of scope here. Labeled clearly in the UI as "beta."
- **Price data** — fictional numbers in the mock catalog.

---

## Setup & run

```bash
git clone <repo-url>
cd voice-shopping-assistant
npm install
npm run dev        # opens at http://localhost:5173
npm run test       # runs 14 Vitest parser unit tests
npm run build      # production bundle
```

**Browser requirement:** Chrome (or any Chromium-based browser) for voice input. The app falls back gracefully to text-only mode in browsers without Web Speech API support (Firefox, Safari).

---

## Architecture overview

**Voice pipeline:** `useSpeechRecognition` wraps the browser Web Speech API into a simple state machine (`idle → listening → processing → idle`). On transcript finalization, `App.jsx` passes the text to `parser.js`, which runs regex patterns against a priority-ordered list of intent templates. The parser returns a typed object (`{ intent, item, quantity, unit, confidence }`) that App dispatches to the appropriate list action. After each action, `SpeechSynthesis.speak()` reads back a confirmation — this closes the interaction loop without any external API.

**State & persistence:** `useShoppingList` manages list state in React and syncs to `localStorage` on every change. When items are removed, `suggestions.js` records them with a frequency counter. The suggestions panel reads this history on render to surface frequently-removed items as "add again" chips. This is all client-side — no backend, no auth.

**Categorization & suggestions:** `categories.js` contains ~150 keyword-to-category mappings with a longest-match substring fallback. `substitutes.js` is a curated static mapping (milk → almond milk, oat milk, etc.). The mock product catalog (`mockProducts.js`) supports name, brand, and max-price filtering and is clearly labeled in the UI as demo data. None of this is claimed ML — it's all transparent lookup tables.

---

## Architecture decisions

- **Web Speech API over a paid STT service** — zero cost, zero config, works client-side with no API keys. Latency is on par with cloud services for short commands. Limitation: Chrome-only in practice (see below).
- **Rule-based parser over an LLM call** — deterministic, free, testable with unit tests, and fast enough for the fixed command vocabulary. An LLM call would add API cost, network latency, and an external dependency with no reliability benefit for a known command set. Would revisit for open-ended natural language queries.
- **localStorage over a backend** — the brief's scope is client-side. A backend adds deployment complexity and auth that buys nothing for a single-user demo.
- **No UI kit or CSS framework** — hand-written CSS is ~300 lines and avoids the "AI template" look of component-library defaults. It's also faster to load than Tailwind's purge pipeline for a project this size.
- **Ambiguity dialog instead of silent failure** — when the parser has low confidence, it asks rather than guessing. This is the single most "smart-feeling" feature relative to build cost, and it prevents silent bad UX (item added with wrong name) in a demo setting.

---

## Known limitations

- **Speech recognition is only tested in Chrome.** Safari's Web Speech API implementation is inconsistent and sometimes requires user gesture polyfills. Firefox does not support it at all. The manual text input covers this gap for all browsers — it's always visible and fully functional.
- The ambiguity dialog currently only offers "add" as the fallback intent. A more complete version would infer intent from context or list a menu of options.
- `SpeechSynthesis` voice quality and language varies significantly by OS/browser. On some systems the voice is robotic; this is a browser limitation, not application code.

---

## Deliverable write-up (≤200 words)

The core problem is turning noisy, variable-phrasing voice input into structured shopping list actions reliably and cheaply.

**Web Speech API over a paid STT service:** Zero cost, zero API keys, works client-side. For a fixed command vocabulary, accuracy is comparable to cloud services. The tradeoff is Chrome-only support — disclosed upfront, with text fallback always available.

**Rule-based parser over an LLM call:** The command set is finite and predictable. A regex/keyword parser is deterministic, free, testable with unit tests in seconds, and has no network latency. An LLM call would introduce API cost, a required secret, and nondeterminism for no accuracy gain on "add 2 bottles of water." LLM would be the right call for open-ended queries or multilingual NLP — neither applies here.

**Deliberate cuts:** Live product catalog (requires retailer API), full multilingual NLP (requires per-language regex sets or LLM), and backend persistence (single-user demo, localStorage is sufficient).

**Extension paths:** Swap `mockProducts.js` for a real grocery API; add per-language command patterns to the parser for multilingual support; move list storage to a backend with a shared list feature for households.
