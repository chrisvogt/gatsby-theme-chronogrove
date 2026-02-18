/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useSelector } from 'react-redux'
import React, { useEffect } from 'react'

import { logColorModeDebugBanner, logColorModeState } from '../helpers/color-mode-debug'
import AudioPlayer from './audio-player'

const LIGHT_BG = '#fdf8f5'
const DARK_BG = '#14141F'
const THEME_UI_COLOR_MODE_KEY = 'theme-ui-color-mode'

const normalizeStored = mode => (mode === 'light' ? 'default' : mode || null)

const getStoredColorMode = () => {
  if (typeof window === 'undefined') return null
  try {
    return normalizeStored(window.localStorage.getItem(THEME_UI_COLOR_MODE_KEY))
  } catch {
    return null
  }
}

const RootWrapper = ({ children }) => {
  const { soundcloudId, spotifyURL, isVisible, provider } = useSelector(state => state.audioPlayer)
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()

  const normalizedColorMode = colorMode === 'light' ? 'default' : colorMode || 'default'

  // Show debug banner once when URL param enables color-mode debug
  useEffect(() => {
    if (typeof window !== 'undefined') logColorModeDebugBanner()
  }, [])

  // Sync DOM (classes, data-attr, background) from localStorage when set, else from context.
  // Preferring localStorage fixes wrong first paint on Blog/Music/Travel/Home without calling
  // setColorMode here (which caused an infinite toggle loop with Theme UI).
  useEffect(() => {
    if (typeof document === 'undefined') return

    const storedMode = getStoredColorMode()
    const sourceOfTruth = storedMode || normalizedColorMode

    const isDark = sourceOfTruth === 'dark'
    const bgColorRaw = theme?.rawColors?.background || theme?.colors?.background || (isDark ? DARK_BG : LIGHT_BG)
    const htmlElement = document.documentElement

    Array.from(htmlElement.classList)
      .filter(className => className.startsWith('theme-ui-'))
      .forEach(className => htmlElement.classList.remove(className))

    htmlElement.classList.add(`theme-ui-${sourceOfTruth}`)
    htmlElement.setAttribute('data-theme-ui-color-mode', sourceOfTruth)
    htmlElement.style.backgroundColor = bgColorRaw

    logColorModeState(sourceOfTruth, theme, 'RootWrapper')
  }, [normalizedColorMode, theme?.colors?.background, theme?.rawColors?.background, theme])

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
