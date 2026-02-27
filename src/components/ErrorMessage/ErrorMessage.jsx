import React from 'react';
import styles from './ErrorMessage.module.css';

/**
 * Errors: explain what went wrong + how to fix. Never blame user.
 */
export function ErrorMessage({ title, description, remedy }) {
  return (
    <div className={styles.wrapper} role="alert">
      {title && <strong className={styles.title}>{title}</strong>}
      {description && <p className={styles.description}>{description}</p>}
      {remedy && <p className={styles.remedy}>{remedy}</p>}
    </div>
  );
}
