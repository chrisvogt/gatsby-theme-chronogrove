import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@theme-ui/components'

const Button = ({ variant = 'primary', ...props }) => (
  <Box
    as='button'
    {...props}
    sx={{
      appearance: 'none',
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: 'inherit',
      textDecoration: 'none',
      fontSize: 'inherit',
      fontWeight: 'bold',
      m: 0,
      px: 3,
      py: 2,
      border: 0,
      borderRadius: 4,
      variant: `buttons.${variant}`
    }}
  />
)

Button.propTypes = {
  variant: PropTypes.string
}

export default Button
