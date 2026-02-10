// TEMPORARY MOCK: This is a bandaid to unblock tests until we resolve node_modules resolution issues with Jest.
// The real @theme-toggles/react Expand component is not found by Jest due to monorepo module resolution quirks.
// This mock should be removed once the underlying issue is fixed.
import React from 'react'

export function Expand(props) {
  // Support both prop shapes
  const { toggled, toggle, className, checked, onChange, id, attributes, size, ...rest } = props

  // Prefer aria-label from attributes, fallback to undefined
  const ariaLabel = attributes?.['aria-label']

  return (
    <button
      type='button'
      data-testid='dark-mode-toggle'
      aria-pressed={toggled ?? checked}
      aria-label={ariaLabel}
      className={className}
      id={id}
      style={size ? { width: size, height: size } : undefined}
      onClick={toggle || onChange}
      {...rest}
    >
      Mock Expand
    </button>
  )
}
