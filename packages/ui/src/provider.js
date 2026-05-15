import React from 'react'
import PropTypes from 'prop-types'
import { Global } from '@emotion/react'
import { ThemeUIProvider, InitializeColorMode } from 'theme-ui'

export function ChronogroveThemeProvider({ theme, children }) {
  return (
    <ThemeUIProvider theme={theme}>
      <InitializeColorMode />
      <Global styles={theme.global} />
      {children}
    </ThemeUIProvider>
  )
}

ChronogroveThemeProvider.propTypes = {
  /** Full Theme UI theme object (must include `global` for Emotion `Global`). */
  theme: PropTypes.shape({
    global: PropTypes.any
  }).isRequired,
  children: PropTypes.node.isRequired
}
