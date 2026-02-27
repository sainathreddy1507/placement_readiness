import React from 'react';
import styles from './WorkspaceLayout.module.css';

/**
 * Primary Workspace (70%) + Secondary Panel (30%). Main interaction + supporting tools.
 */
export function WorkspaceLayout({ primary, secondary }) {
  return (
    <div className={styles.layout}>
      <main className={styles.primary} role="main">
        {primary}
      </main>
      <aside className={styles.secondary} role="complementary">
        {secondary}
      </aside>
    </div>
  );
}
