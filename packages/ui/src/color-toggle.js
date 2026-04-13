import React, { useEffect } from 'react'
import { useColorMode } from 'theme-ui'
import { Expand } from '@theme-toggles/react'
import { scheduleThemeUiColorModeSync } from './color-mode/browser-sync.js'
import { getChronogroveCrossDomainColorModeClientConfig } from './color-mode/cross-domain-color-mode-client-config.js'
import { setChronogroveCrossDomainColorModeCookie } from './color-mode/cross-domain-color-mode-cookie.js'
import isDarkMode from './helpers/isDarkMode.js'

export default function ColorToggle() {
  const [colorMode, setColorMode] = useColorMode()

  // Theme UI updates Emotion + localStorage on toggle but does not sync `document.documentElement`
  // (`theme-ui-*` classes, `data-theme-ui-color-mode`). Chronogrove's head fallback CSS targets
  // `:root[data-theme-ui-color-mode="..."]` with `!important` (see head-inline.js), so a stale
  // attribute makes toggles appear to do nothing. Run after ancestor effects so localStorage matches.
  useEffect(() => {
    scheduleThemeUiColorModeSync()
    setChronogroveCrossDomainColorModeCookie(colorMode, getChronogroveCrossDomainColorModeClientConfig() ?? undefined)
  }, [colorMode])

  return (
    <Expand
      className='theme-toggle'
      toggled={isDarkMode(colorMode)}
      toggle={preferDark => setColorMode(preferDark ? 'dark' : 'default')}
      duration={750}
      aria-label='Toggle color mode'
      id='theme-toggle'
    />
  )
}
