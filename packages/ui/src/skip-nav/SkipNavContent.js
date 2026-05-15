import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

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

SkipNavContent.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  id: PropTypes.string,
  children: PropTypes.node
}

export default SkipNavContent
