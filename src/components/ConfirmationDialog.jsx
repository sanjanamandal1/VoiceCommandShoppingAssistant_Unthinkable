import React, { useEffect, useRef } from 'react';

// Shown when the parser has low confidence — asks user to confirm intent
// rather than silently guessing wrong.
export default function ConfirmationDialog({ text, onConfirm, onDismiss }) {
  const confirmRef = useRef(null);

  // Focus the confirm button when dialog opens
  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onDismiss();
  };

  return (
    <div
      className="confirmation-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm voice command"
      onKeyDown={handleKeyDown}
    >
      <div className="confirmation-dialog">
        <p className="confirmation-dialog__prompt">
          Did you mean: <strong>add &ldquo;{text}&rdquo;</strong>?
        </p>
        <div className="confirmation-dialog__actions">
          <button
            ref={confirmRef}
            className="confirmation-dialog__btn confirmation-dialog__btn--confirm"
            onClick={onConfirm}
          >
            Yes, add it
          </button>
          <button
            className="confirmation-dialog__btn confirmation-dialog__btn--dismiss"
            onClick={onDismiss}
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
}
