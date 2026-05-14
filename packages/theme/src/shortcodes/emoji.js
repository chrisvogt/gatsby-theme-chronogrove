import React from 'react'

const Emoji = ({ children, label }) => (
  <span aria-hidden={label ? 'false' : 'true'} aria-label={label ? label : ''} className='emoji' role='img'>
    {children}
  </span>
)

export default Emoji
