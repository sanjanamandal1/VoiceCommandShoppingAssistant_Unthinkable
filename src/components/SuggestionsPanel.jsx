import React, { useState, useEffect } from 'react';
import { getHistorySuggestions, getSeasonalSuggestions } from '../lib/suggestions.js';
import { getSubstitutes } from '../lib/substitutes.js';

export default function SuggestionsPanel({ items, onAdd }) {
  const [historySuggestions, setHistorySuggestions] = useState([]);
  const [seasonalSuggestions, setSeasonalSuggestions] = useState([]);

  const itemNames = items.map((i) => i.name);

  useEffect(() => {
    setHistorySuggestions(getHistorySuggestions(itemNames));
    setSeasonalSuggestions(getSeasonalSuggestions(itemNames));
  }, [items]);

  // Find substitutes for any checked items
  const checkedItems = items.filter((i) => i.checked);
  const substitutePairs = checkedItems
    .map((i) => ({ item: i.name, subs: getSubstitutes(i.name) }))
    .filter((p) => p.subs.length > 0)
    .slice(0, 3);

  const hasSuggestions =
    historySuggestions.length > 0 ||
    seasonalSuggestions.length > 0 ||
    substitutePairs.length > 0;

  if (!hasSuggestions) return null;

  return (
    <aside className="suggestions-panel" aria-label="Suggestions">
      <h2 className="suggestions-panel__heading">Suggestions</h2>

      {historySuggestions.length > 0 && (
        <div className="suggestions-section">
          <h3 className="suggestions-section__label">Often bought</h3>
          <ul className="suggestions-list">
            {historySuggestions.map((s) => (
              <li key={s.name}>
                <button
                  className="suggestion-chip"
                  onClick={() => onAdd(s.name)}
                  aria-label={`Add ${s.name} to list`}
                >
                  + {s.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {seasonalSuggestions.length > 0 && (
        <div className="suggestions-section">
          <h3 className="suggestions-section__label">Seasonal</h3>
          <ul className="suggestions-list">
            {seasonalSuggestions.map((s) => (
              <li key={s.name}>
                <button
                  className="suggestion-chip suggestion-chip--seasonal"
                  onClick={() => onAdd(s.name)}
                  aria-label={`Add ${s.name} to list`}
                >
                  + {s.name}
                  <span className="suggestion-chip__badge">{s.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {substitutePairs.length > 0 && (
        <div className="suggestions-section">
          <h3 className="suggestions-section__label">Substitutes for checked items</h3>
          {substitutePairs.map(({ item, subs }) => (
            <div key={item} className="substitute-group">
              <span className="substitute-group__for">Instead of {item}:</span>
              <ul className="suggestions-list suggestions-list--inline">
                {subs.slice(0, 3).map((sub) => (
                  <li key={sub}>
                    <button
                      className="suggestion-chip suggestion-chip--sub"
                      onClick={() => onAdd(sub)}
                      aria-label={`Add ${sub} as substitute for ${item}`}
                    >
                      {sub}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
