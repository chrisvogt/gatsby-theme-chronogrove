import React from 'react'
import { useColorMode } from 'theme-ui'
import isDarkMode from '../helpers/isDarkMode'
import { Expand } from '@theme-toggles/react'

export default () => {
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
