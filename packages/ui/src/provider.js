import React from 'react'
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
