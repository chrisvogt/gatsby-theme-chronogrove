import React from 'react'

/** Chevron left (inline SVG, no icon font). */
export const ChevronLeftIcon = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 320 512'
    width='1em'
    height='1em'
    aria-hidden='true'
    focusable='false'
    {...props}
  >
    <path
      fill='currentColor'
      d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z'
    />
  </svg>
)

/** Chevron right (inline SVG, no icon font). */
export const ChevronRightIcon = props => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 320 512'
    width='1em'
    height='1em'
    aria-hidden='true'
    focusable='false'
    {...props}
  >
    <path
      fill='currentColor'
      d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'
    />
  </svg>
)
