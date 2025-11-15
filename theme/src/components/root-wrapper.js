/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useSelector } from 'react-redux'
import React, { useEffect } from 'react'

import AudioPlayer from './audio-player'

const RootWrapper = ({ children }) => {
  const { soundcloudId, spotifyURL, isVisible, provider } = useSelector(state => state.audioPlayer)
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()

  // Set HTML background color to match theme to prevent white flash during page transitions
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isDark = colorMode === 'dark'
      const bgColorRaw = theme?.rawColors?.background || theme?.colors?.background || (isDark ? '#14141F' : '#fdf8f5')
      const htmlElement = document.documentElement
      htmlElement.style.backgroundColor = bgColorRaw
    }
  }, [colorMode, theme])

  return (
    <>
      {children}
      <AudioPlayer soundcloudId={soundcloudId} spotifyURL={spotifyURL} isVisible={isVisible} provider={provider} />
    </>
  )
}

export default RootWrapper
