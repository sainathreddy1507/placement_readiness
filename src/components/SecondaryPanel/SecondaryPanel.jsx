import React, { useState } from 'react';
import { Button } from '../Button/Button';
import { CopyablePrompt } from '../CopyablePrompt/CopyablePrompt';
import styles from './SecondaryPanel.module.css';

/**
 * Step explanation, copyable prompt, action buttons. Calm styling.
 */
export function SecondaryPanel({
  stepTitle,
  stepDescription,
  promptText,
  onCopy,
  onBuildInLovable,
  onItWorked,
  onError,
  onAddScreenshot,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (promptText && onCopy) {
      await onCopy(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.panel}>
      {stepTitle && <h3 className={styles.stepTitle}>{stepTitle}</h3>}
      {stepDescription && (
        <p className={styles.stepDescription}>{stepDescription}</p>
      )}
      {promptText && (
        <CopyablePrompt
          text={promptText}
          onCopy={handleCopy}
          copied={copied}
          className={styles.prompt}
        />
      )}
      <div className={styles.actions}>
        {promptText && (
          <Button variant="secondary" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        )}
        {onBuildInLovable && (
          <Button onClick={onBuildInLovable}>Build in Lovable</Button>
        )}
        {onItWorked && (
          <Button variant="secondary" onClick={onItWorked}>
            It Worked
          </Button>
        )}
        {onError && (
          <Button variant="secondary" onClick={onError}>
            Error
          </Button>
        )}
        {onAddScreenshot && (
          <Button variant="secondary" onClick={onAddScreenshot}>
            Add Screenshot
          </Button>
        )}
      </div>
    </div>
  );
}
