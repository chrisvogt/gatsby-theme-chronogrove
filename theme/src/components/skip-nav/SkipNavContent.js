import React, { forwardRef } from 'react'

/**
 * SkipNavContent
 *
 * Renders a div as the target for the SkipNavLink.
 * Place this at the beginning of your main content area.
 *
 * Can be used as a wrapper or as a sibling element:
 * @example
 *   // As a sibling
 *   <SkipNavContent />
 *   <YourMainContent />
 *
 *   // As a wrapper
 *   <SkipNavContent>
 *     <YourMainContent />
 *   </SkipNavContent>
 *
 * @see https://webaim.org/techniques/skipnav/
 */
const SkipNavContent = forwardRef(function SkipNavContent(
  { as: Comp = 'div', id = 'skip-nav-content', children, ...props },
  forwardedRef
) {
  return (
    <Comp {...props} ref={forwardedRef} id={id} data-skip-nav-content='' tabIndex={-1} style={{ outline: 'none' }}>
      {children}
    </Comp>
  )
})

SkipNavContent.displayName = 'SkipNavContent'

export default SkipNavContent
