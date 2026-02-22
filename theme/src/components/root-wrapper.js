/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useSelector } from 'react-redux'
import React, { useEffect, useLayoutEffect } from 'react'

import { logColorModeDebugBanner, logColorModeState } from '../helpers/color-mode-debug'
import AudioPlayer from './audio-player'

// Sync DOM before paint when color mode changes (avoids one frame of dark bg + light root / black text)
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const LIGHT_BG = '#fdf8f5'
const DARK_BG = '#14141F'
const THEME_UI_COLOR_MODE_KEY = 'theme-ui-color-mode'
const RECONCILE_COLOR_MODE_EVENT = 'theme-ui-reconcile-color-mode'

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
  const [colorMode, setColorMode] = useColorMode()
  const { theme } = useThemeUI()

  const normalizedColorMode = colorMode === 'light' ? 'default' : colorMode || 'default'

  // Show debug banner once when URL param enables color-mode debug
  useEffect(() => {
    if (typeof window !== 'undefined') logColorModeDebugBanner()
  }, [])

  // On route change, reconcile Theme UI context with localStorage (fixes wrong context on
  // Blog/Music/Travel/Home after navigation). Only runs when the event is dispatched from
  // gatsby-browser onRouteUpdate, so toggling the theme never triggers this and avoids a loop.
  useEffect(() => {
    const handler = () => {
      const stored = getStoredColorMode()
      if (stored && stored !== normalizedColorMode) {
        setColorMode(stored)
      }
    }
    window.addEventListener(RECONCILE_COLOR_MODE_EVENT, handler)
    return () => window.removeEventListener(RECONCILE_COLOR_MODE_EVENT, handler)
  }, [normalizedColorMode, setColorMode])

  // Sync DOM from context before paint so toggles never show one frame of wrong combo
  // (e.g. dark background with black text when root still had light attribute).
  useIsomorphicLayoutEffect(() => {
    if (typeof document === 'undefined') return

    const isDark = normalizedColorMode === 'dark'
    const bgColorRaw = theme?.rawColors?.background || theme?.colors?.background || (isDark ? DARK_BG : LIGHT_BG)
    const htmlElement = document.documentElement

    Array.from(htmlElement.classList)
      .filter(className => className.startsWith('theme-ui-'))
      .forEach(className => htmlElement.classList.remove(className))

    htmlElement.classList.add(`theme-ui-${normalizedColorMode}`)
    htmlElement.setAttribute('data-theme-ui-color-mode', normalizedColorMode)
    htmlElement.style.backgroundColor = bgColorRaw

    logColorModeState(normalizedColorMode, theme, 'RootWrapper')
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
