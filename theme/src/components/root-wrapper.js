/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useSelector } from 'react-redux'
import React, { useEffect } from 'react'

import AudioPlayer from './audio-player'

const LIGHT_BG = '#fdf8f5'
const DARK_BG = '#14141F'

const RootWrapper = ({ children }) => {
  const { soundcloudId, spotifyURL, isVisible, provider } = useSelector(state => state.audioPlayer)
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()

  const normalizedColorMode = colorMode === 'light' ? 'default' : colorMode || 'default'

  // Set HTML background color to match theme to prevent white flash during page transitions
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isDark = normalizedColorMode === 'dark'
      const bgColorRaw = theme?.rawColors?.background || theme?.colors?.background || (isDark ? DARK_BG : LIGHT_BG)
      const htmlElement = document.documentElement

      Array.from(htmlElement.classList)
        .filter(className => className.startsWith('theme-ui-'))
        .forEach(className => htmlElement.classList.remove(className))

      htmlElement.classList.add(`theme-ui-${normalizedColorMode}`)
      htmlElement.setAttribute('data-theme-ui-color-mode', normalizedColorMode)
      htmlElement.style.backgroundColor = bgColorRaw
    }
  }, [normalizedColorMode, theme?.colors?.background, theme?.rawColors?.background])

  return (
    <>
      {children}
      <AudioPlayer
        soundcloudId={soundcloudId}
        spotifyURL={spotifyURL}
        isVisible={isVisible}
        provider={provider}
        colorMode={colorMode}
      />
    </>
  )
}

export default RootWrapper
