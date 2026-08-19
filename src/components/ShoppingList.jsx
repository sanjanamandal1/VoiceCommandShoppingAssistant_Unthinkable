import React from 'react';
import ItemRow from './ItemRow.jsx';
import { CATEGORY_ORDER } from '../lib/categories.js';

const CATEGORY_EMOJI = {
  'Produce':        '🥦',
  'Dairy':          '🥛',
  'Bakery':         '🍞',
  'Meat & Seafood': '🥩',
  'Beverages':      '🧃',
  'Snacks':         '🍿',
  'Frozen':         '🧊',
  'Pantry':         '🫙',
  'Household':      '🧹',
  'Other':          '📦',
};

export default function ShoppingList({ items, searchQuery, onRemove, onToggle, onClearChecked }) {
  const filtered = searchQuery
    ? items.filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  if (items.length === 0) {
    return (
      <section className="shopping-list shopping-list--empty" aria-label="Shopping list">
        <p className="shopping-list__empty-msg">Your list is empty. Add items using the mic or text input.</p>
      </section>
    );
  }

  // Group by category, respecting CATEGORY_ORDER
  const groups = {};
  for (const item of filtered) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => groups[c]),
    ...Object.keys(groups).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <section className="shopping-list" aria-label="Shopping list" aria-live="assertive" aria-atomic="false">
      {searchQuery && filtered.length === 0 && (
        <p className="shopping-list__no-results">No items match &ldquo;{searchQuery}&rdquo;</p>
      )}

      {orderedCategories.map((cat) => (
        <div key={cat} className="list-category">
          <h2 className="list-category__heading">
            <span className="list-category__emoji" aria-hidden="true">{CATEGORY_EMOJI[cat] || '📦'}</span>
            {cat}
            <span className="list-category__count">{groups[cat].length}</span>
          </h2>
          <ul className="list-category__items">
            {groups[cat].map((item) => (
              <ItemRow key={item.id} item={item} onRemove={onRemove} onToggle={onToggle} />
            ))}
          </ul>
        </div>
      ))}

      {checkedCount > 0 && (
        <button className="clear-checked-btn" onClick={onClearChecked}>
          Remove {checkedCount} checked item{checkedCount !== 1 ? 's' : ''}
        </button>
      )}
    </section>
  );
}
