/** @jsx jsx */
import { jsx } from 'theme-ui'

/**
 * Header
 *
 * A decorative masthead element that can be used across page layouts.
 */
const Header = ({ children, styles }) => {
  return (
    <header
      role='banner'
      sx={{
        variant: 'styles.Header'
      }}
    >
      <div
        sx={{
          ...(styles ? styles : {})
        }}
      >
        {children}
      </div>
    </header>
  )
}

export default Header
