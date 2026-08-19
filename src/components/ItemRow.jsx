import React from 'react';

export default function ItemRow({ item, onRemove, onToggle }) {
  const qtyLabel = item.quantity > 1
    ? `${item.quantity}${item.unit ? ' ' + item.unit : 'x'}`
    : null;

  return (
    <li
      className={`item-row ${item.checked ? 'item-row--checked' : ''}`}
      aria-label={`${item.name}${qtyLabel ? ', quantity ' + qtyLabel : ''}${item.checked ? ', checked' : ''}`}
    >
      <label className="item-row__check-label">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
          aria-label={`Mark ${item.name} as ${item.checked ? 'unchecked' : 'done'}`}
        />
        <span className="item-row__name">
          {qtyLabel && <span className="item-row__qty">{qtyLabel} </span>}
          {item.name}
        </span>
      </label>
      <button
        className="item-row__remove"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
      >
        ✕
      </button>
    </li>
  );
}
