/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useSelector } from 'react-redux'
import React, { useEffect, useLayoutEffect } from 'react'

import { logColorModeDebugBanner, logColorModeState } from '../helpers/color-mode-debug'
import AudioPlayer from './audio-player'
import {
  THEME_UI_COLOR_MODE_STORAGE_KEY,
  RECONCILE_COLOR_MODE_EVENT,
  resolveChronogroveSurfaceColors
} from '@chronogrove/ui/color-mode'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const normalizeStored = mode => (mode === 'light' ? 'default' : mode || null)

const getStoredColorMode = () => {
  if (typeof window === 'undefined') return null
  try {
    return normalizeStored(window.localStorage.getItem(THEME_UI_COLOR_MODE_STORAGE_KEY))
  } catch {
    return null
  }
}

const RootWrapper = ({ children }) => {
  const { soundcloudId, spotifyURL, isVisible, provider } = useSelector(state => state.audioPlayer)
  const [colorMode, setColorMode] = useColorMode()
  const { theme } = useThemeUI()

  const normalizedColorMode = colorMode === 'light' ? 'default' : colorMode || 'default'
  const surface = resolveChronogroveSurfaceColors(theme)

  useEffect(() => {
    if (typeof window !== 'undefined') logColorModeDebugBanner()
  }, [])

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

  useIsomorphicLayoutEffect(() => {
    if (typeof document === 'undefined') return
    const isDark = normalizedColorMode === 'dark'
    const bgColorRaw =
      theme?.rawColors?.background ||
      theme?.colors?.background ||
      (isDark ? surface.darkBackgroundHex : surface.defaultBackgroundHex)
    const htmlElement = document.documentElement
    Array.from(htmlElement.classList)
      .filter(className => className.startsWith('theme-ui-'))
      .forEach(className => htmlElement.classList.remove(className))
    htmlElement.classList.add(`theme-ui-${normalizedColorMode}`)
    htmlElement.setAttribute('data-theme-ui-color-mode', normalizedColorMode)
    htmlElement.style.backgroundColor = bgColorRaw
    logColorModeState(normalizedColorMode, theme, 'RootWrapper')
  }, [normalizedColorMode, surface.darkBackgroundHex, surface.defaultBackgroundHex, theme])

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
