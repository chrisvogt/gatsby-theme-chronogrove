// Stand-in for @theme-toggles/react in theme Jest (mapper). Matches real Expand click behavior: `toggle(!l)` with a boolean.
import React from 'react'

export function Expand({ toggled, toggle, className, ...rest }) {
  const l = Boolean(toggled)
  return (
    <button
      type='button'
      data-testid='dark-mode-toggle'
      aria-pressed={l}
      className={className}
      {...rest}
      onClick={() => {
        if (typeof toggle === 'function') {
          toggle(!l)
        }
      }}
    >
      Mock Expand
    </button>
  )
}
