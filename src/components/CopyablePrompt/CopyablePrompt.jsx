import React from 'react';
import styles from './CopyablePrompt.module.css';

/**
 * Copyable prompt box for secondary panel. Clean, no heavy styling.
 */
export function CopyablePrompt({ text, onCopy, copied, className = '' }) {
  return (
    <div className={`${styles.box} ${className}`}>
      <pre className={styles.pre}>{text}</pre>
    </div>
  );
}
