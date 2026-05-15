import PropTypes from 'prop-types'
import { Box } from '@theme-ui/components'

/**
 * Header
 *
 * A decorative masthead element that can be used across page layouts.
 */
const Header = ({ children, styles }) => {
  return (
    <Box as='header' sx={{ variant: 'styles.Header' }}>
      <Box sx={{ ...(styles ?? {}) }}>{children}</Box>
    </Box>
  )
}

Header.propTypes = {
  children: PropTypes.node,
  styles: PropTypes.object
}

export default Header
