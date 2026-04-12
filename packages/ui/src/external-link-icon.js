import React from 'react'

/**
 * Small external-link glyph (inline SVG). Use for “opens in new window” affordances.
 */
export const ExternalLinkIcon = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 512 512'
    width='0.75em'
    height='0.75em'
    aria-hidden='true'
    focusable='false'
    {...props}
  >
    <path
      fill='currentColor'
      d='M432 320h-32a16 16 0 0 0-16 16v112H64V128h144a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16H48a48 48 0 0 0-48 48v352a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V336a16 16 0 0 0-16-16zM488 0h-168c-13.3 0-24 10.7-24 24v8c0 13.3 10.7 24 24 24h69.2L207 279.6a24.06 24.06 0 0 0 0 34l10.2 10.2a24.06 24.06 0 0 0 34 0L425 128.8V200c0 13.3 10.7 24 24 24h8c13.3 0 24-10.7 24-24V56c0-30.9-25.1-56-56-56z'
    />
  </svg>
)

/** Same icon wrapped in `<span>` for drop-in use where a text sibling is expected. */
export default function ViewExternalLinkIcon() {
  return (
    <span>
      <ExternalLinkIcon />
    </span>
  )
}
