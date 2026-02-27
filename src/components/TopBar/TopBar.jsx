import React from 'react';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './TopBar.module.css';

/**
 * Top Bar — Project name (left), Progress (center), Status (right)
 */
export function TopBar({ projectName, stepCurrent, stepTotal, status }) {
  return (
    <header className={styles.topBar} role="banner">
      <div className={styles.left}>{projectName}</div>
      <div className={styles.center}>
        Step {stepCurrent} / {stepTotal}
      </div>
      <div className={styles.right}>
        <StatusBadge status={status} />
      </div>
    </header>
  );
}
