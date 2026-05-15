import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@theme-ui/components'

/**
 * Muted footer row for dashboard-style cards. Uses `styles.mutedCardFooter` on the theme.
 */
const MutedCardFooter = ({ children, customStyles, ...props }) => (
  <Box
    sx={{
      variant: 'styles.mutedCardFooter',
      color: 'textMuted',
      fontFamily: 'sans',
      fontSize: 1,
      ...(typeof customStyles === 'object' && customStyles !== null ? customStyles : {})
    }}
    {...props}
  >
    {children}
  </Box>
)

MutedCardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  customStyles: PropTypes.object
}

export default MutedCardFooter
