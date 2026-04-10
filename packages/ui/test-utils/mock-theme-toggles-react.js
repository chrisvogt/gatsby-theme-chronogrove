import React from 'react'

/** Test double for @theme-toggles/react (Jest moduleNameMapper); keeps ColorToggle unit tests offline. */
export function Expand({ toggled, toggle, ...rest }) {
  return (
    <button type='button' data-toggled={String(toggled)} onClick={toggle} {...rest}>
      toggle
    </button>
  )
}
