import React from 'react';
import styles from './Card.module.css';

/**
 * Subtle border, no drop shadows, balanced padding.
 */
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`${styles.card} ${className}`} {...props}>
      {children}
    </div>
  );
}
