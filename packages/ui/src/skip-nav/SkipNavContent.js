import React, { forwardRef } from 'react'

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
