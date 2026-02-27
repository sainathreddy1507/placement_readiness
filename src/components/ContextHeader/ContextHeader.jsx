import React from 'react';
import styles from './ContextHeader.module.css';

/**
 * Context Header — Large serif headline, one-line subtext. Clear purpose, no hype.
 */
export function ContextHeader({ title, subtitle }) {
  return (
    <div className={styles.contextHeader}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
