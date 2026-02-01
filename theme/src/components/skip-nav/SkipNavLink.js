/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { forwardRef } from 'react'
import isDarkMode from '../../helpers/isDarkMode'

/**
 * SkipNavLink
 *
 * Renders a link styled as a button to skip to the main content.
 * This is an accessibility feature for keyboard and screen reader users.
 *
 * Placed first in DOM for proper tab order, but visually appears in the
 * header area (near the color toggle) when focused using fixed positioning.
 *
 * Styled to match ActionButton for visual consistency.
 *
 * @see https://webaim.org/techniques/skipnav/
 */
const SkipNavLink = forwardRef(function SkipNavLink(
  { as: Comp = 'a', children = 'Skip to content', contentId = 'skip-nav-content', ...props },
  forwardedRef
) {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  const primaryColor = darkModeActive ? '#4a9eff' : '#422EA3'

  // Helper function to convert hex to RGB
  const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '74, 158, 255'
  }

  return (
    <Comp
      {...props}
      ref={forwardedRef}
      href={`#${contentId}`}
      data-skip-nav-link=''
      sx={{
        // Visually hidden by default (accessible hiding technique)
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: '1px',
        width: '1px',
        margin: '-1px',
        padding: 0,
        overflow: 'hidden',
        position: 'absolute',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
        // Visible on focus - classic upper-left corner positioning
        '&:focus': {
          // Reset hidden styles
          clip: 'auto',
          height: 'auto',
          width: 'auto',
          margin: 0,
          overflow: 'visible',
          whiteSpace: 'normal',
          // Fixed position in upper-left corner (standard skip link placement)
          position: 'fixed',
          top: 3,
          left: 3,
          zIndex: 9999,
          // ActionButton styles
          color: primaryColor,
          textDecoration: 'none',
          fontWeight: 'medium',
          fontSize: ['12px', '13px'],
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 12px',
          borderRadius: '6px',
          background: `rgba(${hexToRgb(primaryColor)}, 0.15)`,
          border: `1px solid rgba(${hexToRgb(primaryColor)}, 0.3)`,
          cursor: 'pointer',
          outline: 'none',
          boxShadow: `0 0 0 2px ${primaryColor}40`,
          backdropFilter: 'blur(8px)',
          '&:hover': {
            background: `rgba(${hexToRgb(primaryColor)}, 0.25)`,
            textDecoration: 'none'
          }
        }
      }}
    >
      {children}
    </Comp>
  )
})

SkipNavLink.displayName = 'SkipNavLink'

export default SkipNavLink
