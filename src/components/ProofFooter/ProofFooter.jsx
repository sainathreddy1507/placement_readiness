import React from 'react';
import styles from './ProofFooter.module.css';

const DEFAULT_ITEMS = [
  { id: 'ui', label: 'UI Built', proof: null },
  { id: 'logic', label: 'Logic Working', proof: null },
  { id: 'test', label: 'Test Passed', proof: null },
  { id: 'deployed', label: 'Deployed', proof: null },
];

/**
 * Proof Footer — Checklist. Each item requires user proof input.
 */
export function ProofFooter({ items = DEFAULT_ITEMS, onProofChange }) {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        {items.map((item) => (
          <label key={item.id} className={styles.item}>
            <input
              type="checkbox"
              checked={!!item.proof}
              onChange={(e) => onProofChange?.(item.id, e.target.checked)}
              className={styles.checkbox}
              aria-label={item.label}
            />
            <span className={styles.label}>{item.label}</span>
          </label>
        ))}
      </div>
    </footer>
  );
}
