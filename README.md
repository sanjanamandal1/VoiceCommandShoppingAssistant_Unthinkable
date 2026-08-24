# Voice Shopping Assistant

A hands-free grocery list web app built with React and the browser's native Web Speech API. Includes Hinglish voice commands, automatic item categorization, a 26-product catalog with price filtering, and local storage persistence.

**Live Demo:** [https://voice-command-shopping-assistant-un.vercel.app/](https://voice-command-shopping-assistant-un.vercel.app/)

> **Note:** Voice recognition uses the browser's Web Speech API, which works in Chrome / Chromium browsers. A manual text input form is always available as a fallback on any browser.

---

## What it does

- **Voice commands (English & Hinglish):** Add items, specify quantities and units (e.g. *2 kilo atta*, *a dozen eggs*), remove items, check items off as bought, and search the product catalog.
- **Voice-controlled price filtering:** Say *"find paneer under 200"* or *"milk under 100"* to filter the catalog by product and price limit simultaneously.
- **Accent & speech handling:** Strips filler words (*um*, *uh*, *like*) and evaluates multiple recognition candidates to handle varied accents without needing external cloud APIs.
- **Smart suggestions:** Suggests frequently bought items based on your usage history, seasonal produce (monsoon/autumn), and substitutes when items are checked off (e.g. *toor dal → moong dal / chana dal*, *ghee → butter*).
- **Auto-categorization:** Automatically groups 100+ items into categories (*Fruits & Veggies, Dairy, Bakery, Pantry, Snacks, Beverages, Meat & Seafood, Frozen, Household*).
- **Audio & visual feedback:** Speaks back confirmations using `SpeechSynthesis`, with visual state indicators for idle, listening, and processing.

---

## Voice Commands

| Action | English | Hinglish |
|---|---|---|
| **Add item** | `add milk`, `I need apples`, `we ran out of coffee` | `doodh lana hai`, `anda chahiye`, `ghee kharidna hai`, `sabzi leke aao` |
| **With quantity** | `add 2 kilo atta`, `add a dozen eggs`, `add 3 packs of maggi` | `ek paav paneer lana hai`, `do packet maggi add karo` |
| **Remove item** | `remove chips`, `take milk off the list`, `delete bread` | `chips hatao`, `butter nahi chahiye`, `namak mat lana`, `milk nikal do` |
| **Check off** | `check off bread`, `got milk`, `bought eggs` | `doodh aa gaya`, `eggs le liya`, `chawal kharida` |
| **Search catalog** | `search for paneer`, `find basmati rice` | `paneer dhundo`, `chai patti khojo` |
| **Search with price** | `find paneer under 200`, `search milk under 100`, `tea below 150` | `paneer dhundo 200 ke andar` |

*Keyboard shortcut:* Press `Space` or `M` (when not typing in an input) to toggle the microphone.

---

## Tech Stack

- **Frontend:** React 19, Vite
- **Voice Input:** Web Speech API (`SpeechRecognition`)
- **Voice Output:** Web Speech API (`SpeechSynthesis`)
- **NLP / Parser:** Rule-based regex parser (client-side, 0ms latency, zero API costs)
- **Styling:** Plain CSS (minimal neo-brutalist inspired UI)
- **Testing:** Vitest (49 unit tests)
- **Linting:** ESLint (`eslint-plugin-react-hooks`)
- **Deployment:** Vercel

---

## Project Structure

```
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AddItemForm.jsx        # Manual item input with quantity selector
│   │   ├── ConfirmationDialog.jsx # Prompt modal for low-confidence inputs
│   │   ├── ItemRow.jsx            # Item row with toggle checkbox and delete
│   │   ├── MicButton.jsx          # Voice button with animated listening state
│   │   ├── SearchFilter.jsx       # Catalog search, brand filter & price slider
│   │   ├── ShoppingList.jsx       # Category-grouped grocery list
│   │   ├── SuggestionsPanel.jsx   # Frequency, seasonal & substitute suggestions
│   │   └── TranscriptDisplay.jsx  # Live transcript & confirmation banner
│   ├── hooks/
│   │   ├── useShoppingList.js     # State management & localStorage sync
│   │   └── useSpeechRecognition.js# Web Speech API hook with multi-alternative logic
│   ├── lib/
│   │   ├── categories.js          # Item-to-category keyword dictionary
│   │   ├── mockProducts.js        # 26-item product catalog with INR pricing
│   │   ├── parser.js              # Command parser (English + Hinglish + price limits)
│   │   ├── speech.js              # SpeechSynthesis helper
│   │   ├── substitutes.js         # Substitute item mapping
│   │   └── suggestions.js         # History tracking & seasonal produce list
│   ├── tests/
│   │   └── parser.test.js         # 49 unit tests for command parser
│   ├── App.jsx                    # Root component & speech event handler
│   ├── index.css                  # Design system & styles
│   └── main.jsx                   # Entry point
├── eslint.config.js               # ESLint configuration
├── index.html
├── package.json
└── vite.config.js
```

---

## Setup & Running Locally

```bash
# Clone the repository
git clone https://github.com/sanjanamandal1/VoiceCommandShoppingAssistant_Unthinkable.git
cd VoiceCommandShoppingAssistant_Unthinkable

# Install dependencies
npm install

# Start the dev server (runs at http://localhost:5173)
npm run dev

# Run unit tests
npm run test

# Run linter
npm run lint

# Build for production
npm run build
```
