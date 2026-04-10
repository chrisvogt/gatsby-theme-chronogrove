import React from 'react'
import { useColorMode } from 'theme-ui'
import { Expand } from '@theme-toggles/react'
import isDarkMode from '@chronogrove/ui/is-dark-mode'

export default function ColorToggle() {
  const [colorMode, setColorMode] = useColorMode()

  return (
    <Expand
      className='theme-toggle'
      toggled={isDarkMode(colorMode)}
      toggle={() => setColorMode(colorMode === 'default' ? 'dark' : 'default')}
      duration={750}
      aria-label='Toggle color mode'
      id='theme-toggle'
    />
  )
}
