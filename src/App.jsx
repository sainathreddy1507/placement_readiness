import React, { useState } from 'react';
import {
  PageLayout,
  Card,
  SecondaryPanel,
  Button,
  EmptyState,
} from './components';
import './design-system/tokens.css';
import './design-system/base.css';

/**
 * Design system demo — full layout structure only. No product features.
 */
export default function App() {
  const [proof, setProof] = useState({
    ui: false,
    logic: false,
    test: false,
    deployed: false,
  });

  const proofItems = [
    { id: 'ui', label: 'UI Built', proof: proof.ui },
    { id: 'logic', label: 'Logic Working', proof: proof.logic },
    { id: 'test', label: 'Test Passed', proof: proof.test },
    { id: 'deployed', label: 'Deployed', proof: proof.deployed },
  ];

  const handleProofChange = (id, checked) => {
    setProof((p) => ({ ...p, [id]: checked }));
  };

  const primaryContent = (
    <Card>
      <EmptyState
        title="Primary workspace"
        description="Main product interaction lives here. Clean cards, predictable components."
        action={<Button>Next action</Button>}
      />
    </Card>
  );

  const secondaryContent = (
    <SecondaryPanel
      stepTitle="Step 1"
      stepDescription="Short explanation of what this step does."
      promptText="Copy this prompt into your AI builder."
      onCopy={async (text) => navigator.clipboard?.writeText(text)}
      onBuildInLovable={() => {}}
      onItWorked={() => {}}
      onError={() => {}}
      onAddScreenshot={() => {}}
    />
  );

  return (
    <PageLayout
      projectName="KodNest Premium Build System"
      stepCurrent={1}
      stepTotal={5}
      status="In Progress"
      headerTitle="Design system"
      headerSubtitle="Layout and components only. No product features yet."
      primaryContent={primaryContent}
      secondaryContent={secondaryContent}
      proofItems={proofItems}
      onProofChange={handleProofChange}
    />
  );
}
