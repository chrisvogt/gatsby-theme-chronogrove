/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useSelector } from 'react-redux'
import React, { useEffect, useRef } from 'react'

import AudioPlayer from './audio-player'
import { logColorModeState } from '../helpers/color-mode-debug'

const LIGHT_BG = '#fdf8f5'
const DARK_BG = '#14141F'

const RootWrapper = ({ children }) => {
  const { soundcloudId, spotifyURL, isVisible, provider } = useSelector(state => state.audioPlayer)
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()
  const prevModeRef = useRef(colorMode)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const isDark = colorMode === 'dark'
    const bgColorRaw = theme?.rawColors?.background || theme?.colors?.background || (isDark ? DARK_BG : LIGHT_BG)
    const htmlElement = document.documentElement

    const apply = () => {
      htmlElement.setAttribute('data-theme-ui-color-mode', colorMode)
      htmlElement.style.backgroundColor = bgColorRaw
    }

    apply()

    // Re-apply on next frame so we run after Theme UI's effect that updates CSS variables
    // (avoids stuck text: white-on-white when switching dark -> light)
    const rafId = requestAnimationFrame(() => {
      const nextBg =
        theme?.rawColors?.background || theme?.colors?.background || (colorMode === 'dark' ? DARK_BG : LIGHT_BG)
      htmlElement.setAttribute('data-theme-ui-color-mode', colorMode)
      htmlElement.style.backgroundColor = nextBg
    })

    logColorModeState(colorMode, theme, 'RootWrapper')
    if (prevModeRef.current !== colorMode) {
      prevModeRef.current = colorMode
      logColorModeState(colorMode, theme, 'RootWrapper (mode changed)')
    }

    return () => cancelAnimationFrame(rafId)
  }, [colorMode, theme])

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
