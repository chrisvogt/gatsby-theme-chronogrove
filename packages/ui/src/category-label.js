import React from 'react'
import { Box } from '@theme-ui/components'

/**
 * Styled label for post categories. Pass display text as `children` (site-specific mapping stays in the app).
 */
const CategoryLabel = ({ children, sx: sxProp = {}, ...props }) => (
  <Box
    sx={{
      display: 'inline-block',
      fontSize: [0],
      fontFamily: 'heading',
      color: 'primary',
      letterSpacing: '0.05em',
      ...sxProp
    }}
    {...props}
  >
    {children}
  </Box>
)

export default CategoryLabel
