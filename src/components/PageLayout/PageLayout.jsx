import React from 'react';
import { TopBar } from '../TopBar/TopBar';
import { ContextHeader } from '../ContextHeader/ContextHeader';
import { WorkspaceLayout } from '../WorkspaceLayout/WorkspaceLayout';
import { ProofFooter } from '../ProofFooter/ProofFooter';
import styles from './PageLayout.module.css';

/**
 * Global layout: [Top Bar] → [Context Header] → [Primary Workspace + Secondary Panel] → [Proof Footer]
 */
export function PageLayout({
  projectName,
  stepCurrent,
  stepTotal,
  status,
  headerTitle,
  headerSubtitle,
  primaryContent,
  secondaryContent,
  proofItems,
  onProofChange,
}) {
  return (
    <div className={styles.page}>
      <TopBar
        projectName={projectName}
        stepCurrent={stepCurrent}
        stepTotal={stepTotal}
        status={status}
      />
      <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
      <WorkspaceLayout primary={primaryContent} secondary={secondaryContent} />
      <ProofFooter items={proofItems} onProofChange={onProofChange} />
    </div>
  );
}
