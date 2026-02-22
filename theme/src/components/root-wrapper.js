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

  // On route change (including in-page hash links like #instagram), reconcile context from
  // localStorage and re-apply our DOM sync so we win over gatsby-plugin-theme-ui's provider
  // (which can overwrite the root with stale state when the route updates).
  useEffect(() => {
    let timeoutId
    const handler = () => {
      const stored = getStoredColorMode()
      if (stored && stored !== normalizedColorMode) {
        setColorMode(stored)
      }
      // Always re-sync the root from localStorage after a tick so we overwrite any
      // stale DOM update from the plugin (e.g. after clicking a home nav hash link).
      timeoutId = setTimeout(() => {
        if (typeof document === 'undefined') return
        const mode = stored || normalizedColorMode || 'default'
        const isDark = mode === 'dark'
        const bgColorRaw = theme?.rawColors?.background || theme?.colors?.background || (isDark ? DARK_BG : LIGHT_BG)
        const htmlElement = document.documentElement
        Array.from(htmlElement.classList)
          .filter(className => className.startsWith('theme-ui-'))
          .forEach(className => htmlElement.classList.remove(className))
        htmlElement.classList.add(`theme-ui-${mode}`)
        htmlElement.setAttribute('data-theme-ui-color-mode', mode)
        htmlElement.style.backgroundColor = bgColorRaw
      }, 0)
    }
    window.addEventListener(RECONCILE_COLOR_MODE_EVENT, handler)
    return () => {
      window.removeEventListener(RECONCILE_COLOR_MODE_EVENT, handler)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [normalizedColorMode, setColorMode, theme?.colors?.background, theme?.rawColors?.background])

  // Sync DOM from context before paint so toggles never show one frame of wrong combo.
  // When gatsby-plugin-theme-ui is also in use, it adds a second ThemeUIProvider that can
  // overwrite the root with stale state in its useEffect. We run sync immediately, then
  // again after a microtask so our (correct) state wins.
  const syncRootToColorMode = () => {
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
  }

  useIsomorphicLayoutEffect(() => {
    syncRootToColorMode()
    const t = setTimeout(syncRootToColorMode, 0)
    return () => clearTimeout(t)
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
