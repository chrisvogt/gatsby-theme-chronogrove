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
 * Placed first in DOM for proper tab order. Visually hidden until focused,
 * then appears in the upper-left corner of the viewport.
 *
 * Styled to match ActionButton for visual consistency.
 *
 * @see https://webaim.org/techniques/skipnav/
 */
const SkipNavLink = forwardRef(function SkipNavLink(
  { as: Comp = 'a', children = 'Skip to content', contentId = 'skip-nav-content', ...props },
  forwardedRef
) {
  const { colorMode, theme } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const primaryColor = theme?.colors?.primary ?? (darkModeActive ? '#4a9eff' : '#422EA3')
  const primaryRgb = theme?.colors?.primaryRgb ?? (darkModeActive ? '74, 158, 255' : '66, 46, 163')

  return (
    <Comp
      {...props}
      ref={forwardedRef}
      href={`#${contentId}`}
      data-skip-nav-link=''
      // Safari skips links in Tab order by default (only tabs to form elements/buttons).
      // Explicit tabIndex={0} ensures keyboard navigation works across all browsers.
      tabIndex={0}
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
          // ActionButton styles (aligned with theme buttons.action)
          color: primaryColor,
          textDecoration: 'none',
          fontWeight: 'medium',
          fontSize: ['12px', '13px'],
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 12px',
          borderRadius: '6px',
          background: `rgba(${primaryRgb}, 0.15)`,
          border: `1px solid rgba(${primaryRgb}, 0.3)`,
          cursor: 'pointer',
          outline: 'none',
          boxShadow: `0 0 0 2px ${primaryColor}40`,
          backdropFilter: 'blur(8px)',
          '&:hover': {
            background: `rgba(${primaryRgb}, 0.25)`,
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
