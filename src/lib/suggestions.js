// History-based suggestion logic. Reads/writes to localStorage.
// Also includes a small static seasonal list (clearly labeled as mock).

const HISTORY_KEY = 'vsa_item_history';
const MAX_HISTORY = 50;

// Static seasonal/on-sale suggestions — mock data, not live
const SEASONAL = [
  { name: 'pumpkin', label: 'In season' },
  { name: 'sweet potatoes', label: 'On sale (mock)' },
  { name: 'ginger', label: 'In season' },
];

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function recordRemoval(itemName) {
  const history = loadHistory();
  const existing = history.find((h) => h.name.toLowerCase() === itemName.toLowerCase());
  if (existing) {
    existing.count += 1;
    existing.lastRemoved = Date.now();
  } else {
    history.unshift({ name: itemName, count: 1, lastRemoved: Date.now() });
  }
  saveHistory(history);
}

// Returns items the user frequently removes/buys, sorted by frequency
export function getHistorySuggestions(currentListNames = []) {
  const history = loadHistory();
  const lowerCurrent = currentListNames.map((n) => n.toLowerCase());
  return history
    .filter((h) => !lowerCurrent.includes(h.name.toLowerCase()))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export function getSeasonalSuggestions(currentListNames = []) {
  const lowerCurrent = currentListNames.map((n) => n.toLowerCase());
  return SEASONAL.filter((s) => !lowerCurrent.includes(s.name.toLowerCase()));
}
