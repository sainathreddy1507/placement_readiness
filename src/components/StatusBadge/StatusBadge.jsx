import React from 'react';
import styles from './StatusBadge.module.css';

const STATUS_MAP = {
  'Not Started': 'neutral',
  'In Progress': 'inProgress',
  Shipped: 'shipped',
};

/**
 * Status Badge — Not Started / In Progress / Shipped. Calm styling.
 */
export function StatusBadge({ status = 'Not Started' }) {
  const variant = STATUS_MAP[status] || 'neutral';
  return (
    <span className={`${styles.badge} ${styles[variant]}`} role="status">
      {status}
    </span>
  );
}
