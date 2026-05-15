import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@theme-ui/components'
import { useThemeUI } from 'theme-ui'

import isDarkMode from './helpers/isDarkMode.js'

const sectionSx = {
  mb: 4,
  pt: [0, 3, 4],
  pb: [0, 3, 4]
}

/**
 * Wraps a dashboard widget: vertical spacing and optional fatal-error overlay.
 */
const WidgetSection = ({ children, hasFatalError, id, styleOverrides = {}, tabIndex, ...props }) => {
  const { colorMode } = useThemeUI()
  const darkMode = isDarkMode(colorMode)

  return (
    <Box
      as='section'
      sx={{
        ...sectionSx,
        ...styleOverrides,
        ...(hasFatalError
          ? {
              position: 'relative'
            }
          : {})
      }}
      {...(id ? { id } : {})}
      tabIndex={id ? (tabIndex ?? -1) : tabIndex}
      {...props}
    >
      {hasFatalError && (
        <Box
          sx={{
            alignItems: 'center',
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0
          }}
        >
          <Box
            sx={{
              background: darkMode ? '#252e3c' : 'white',
              borderLeft: '2px solid red',
              borderRight: '2px solid red',
              borderRadius: '2px',
              boxShadow: 'xl',
              py: 3,
              px: 4,
              zIndex: 480
            }}
          >
            <h4>Something went wrong</h4>
            <p>Failed to load this widget.</p>
          </Box>
          <Box
            sx={{
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: darkMode
                ? 'radial-gradient(rgba(14.5,18,23.5,0.4) 20%, transparent 50%);'
                : 'radial-gradient(rgba(255, 255, 255, 0.4) 20%, transparent 50%)',
              position: 'absolute',
              zIndex: 470
            }}
          />
        </Box>
      )}
      {children}
    </Box>
  )
}

WidgetSection.propTypes = {
  children: PropTypes.node.isRequired,
  hasFatalError: PropTypes.bool,
  id: PropTypes.string,
  styleOverrides: PropTypes.object,
  tabIndex: PropTypes.number
}

export default WidgetSection
