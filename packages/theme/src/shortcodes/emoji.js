import React from 'react'
import PropTypes from 'prop-types'

const Emoji = ({ children, label }) => (
  <span aria-hidden={label ? 'false' : 'true'} aria-label={label ? label : ''} className='emoji' role='img'>
    {children}
  </span>
)

Emoji.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string
}

export default Emoji
