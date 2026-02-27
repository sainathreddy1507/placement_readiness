import React from 'react';
import styles from './Button.module.css';

/**
 * Primary = solid deep red. Secondary = outlined. Same hover and radius everywhere.
 */
export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  className = '',
  ...props
}) {
  const classNames = [
    styles.button,
    variant === 'secondary' ? styles.secondary : styles.primary,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
