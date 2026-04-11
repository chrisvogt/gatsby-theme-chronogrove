import { Box } from '@theme-ui/components'

/**
 * Header
 *
 * A decorative masthead element that can be used across page layouts.
 */
const Header = ({ children, styles }) => {
  return (
    <Box as='header' role='banner' sx={{ variant: 'styles.Header' }}>
      <Box sx={{ ...(styles ? styles : {}) }}>{children}</Box>
    </Box>
  )
}

export default Header
