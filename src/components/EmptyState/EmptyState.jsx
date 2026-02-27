import React from 'react';
import styles from './EmptyState.module.css';

/**
 * Empty state: provide next action, never feel dead.
 */
export function EmptyState({ title, description, action }) {
  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
