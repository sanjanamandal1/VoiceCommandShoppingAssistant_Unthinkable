import React, { useState } from 'react';

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, Number(quantity));
    setName('');
    setQuantity(1);
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit} aria-label="Add item manually">
      <input
        id="item-name-input"
        className="add-item-form__input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name…"
        aria-label="Item name"
        autoComplete="off"
      />
      <input
        id="item-qty-input"
        className="add-item-form__qty"
        type="number"
        min="1"
        max="99"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        aria-label="Quantity"
      />
      <button
        type="submit"
        className="add-item-form__submit"
        disabled={!name.trim()}
        aria-label="Add item to list"
      >
        Add
      </button>
    </form>
  );
}
