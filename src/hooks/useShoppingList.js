import { useState, useEffect, useCallback } from 'react';
import { categorize } from '../lib/categories.js';
import { recordRemoval } from '../lib/suggestions.js';

const STORAGE_KEY = 'vsa_shopping_list';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function useShoppingList() {
  const [items, setItems] = useState(load);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((name, quantity = 1, unit = null) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const formattedName = toTitleCase(trimmed);

    setItems((prev) => {
      // If item already on the list, bump quantity instead of duplicating
      const existing = prev.find(
        (i) => i.name.toLowerCase() === formattedName.toLowerCase() && !i.checked
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      const newItem = {
        id: generateId(),
        name: formattedName,
        quantity,
        unit,
        category: categorize(formattedName),
        checked: false,
        addedAt: Date.now(),
      };
      return [...prev, newItem];
    });

    return formattedName;
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) recordRemoval(target.name);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const removeByName = useCallback((name) => {
    const lower = name.toLowerCase().trim();
    setItems((prev) => {
      const target = prev.find((i) => i.name.toLowerCase().includes(lower));
      if (target) recordRemoval(target.name);
      return prev.filter((i) => i.id !== target?.id);
    });
  }, []);

  const toggleCheck = useCallback((id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  }, []);

  const checkByName = useCallback((name) => {
    const lower = name.toLowerCase().trim();
    setItems((prev) =>
      prev.map((i) =>
        i.name.toLowerCase().includes(lower) ? { ...i, checked: true } : i
      )
    );
  }, []);

  const clearChecked = useCallback(() => {
    setItems((prev) => {
      prev.filter((i) => i.checked).forEach((i) => recordRemoval(i.name));
      return prev.filter((i) => !i.checked);
    });
  }, []);

  const clearAll = useCallback(() => {
    items.forEach((i) => recordRemoval(i.name));
    setItems([]);
  }, [items]);

  // Simple name-based search, returns matching items
  const searchItems = useCallback(
    (query) => {
      const q = query.toLowerCase().trim();
      if (!q) return items;
      return items.filter((i) => i.name.toLowerCase().includes(q));
    },
    [items]
  );

  return {
    items,
    addItem,
    removeItem,
    removeByName,
    toggleCheck,
    checkByName,
    clearChecked,
    clearAll,
    searchItems,
  };
}
