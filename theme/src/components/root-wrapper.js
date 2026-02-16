/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useSelector } from 'react-redux'
import React, { useEffect, useRef } from 'react'

import AudioPlayer from './audio-player'
import { logColorModeState, logColorModeDebugBanner, isColorModeDebugEnabled } from '../helpers/color-mode-debug'

const LIGHT_BG = '#fdf8f5'
const DARK_BG = '#14141F'
const LIGHT_TEXT = '#111'
const LIGHT_TEXT_MUTED = '#333'
const DARK_TEXT = '#fff'
const DARK_TEXT_MUTED = '#d8d8d8'

const RootWrapper = ({ children }) => {
  const { soundcloudId, spotifyURL, isVisible, provider } = useSelector(state => state.audioPlayer)
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()
  const prevModeRef = useRef(colorMode)
  const bannerLoggedRef = useRef(false)

  useEffect(() => {
    if (!bannerLoggedRef.current && typeof document !== 'undefined') {
      logColorModeDebugBanner()
      bannerLoggedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return

    const isDark = colorMode === 'dark'
    const bgColorRaw = theme?.rawColors?.background || theme?.colors?.background || (isDark ? DARK_BG : LIGHT_BG)
    const htmlElement = document.documentElement

    const runFallbackVars = () => {
      const computed = typeof window.getComputedStyle === 'function' ? window.getComputedStyle(htmlElement) : null
      const textVar = computed?.getPropertyValue('--theme-ui-colors-text')?.trim() ?? ''
      const looksLikeWhite = /^#fff(f)?$/i.test(textVar) || /rgba?\(\s*255\s*,\s*255\s*,\s*255/i.test(textVar)
      const looksLikeDarkText = /^#111/i.test(textVar) || /rgb\(\s*17\s*,\s*17\s*,\s*17\s*\)/i.test(textVar)
      if (!isDark && looksLikeWhite) {
        htmlElement.style.setProperty('--theme-ui-colors-text', LIGHT_TEXT)
        htmlElement.style.setProperty('--theme-ui-colors-text-muted', LIGHT_TEXT_MUTED)
      } else if (isDark && looksLikeDarkText) {
        htmlElement.style.setProperty('--theme-ui-colors-text', DARK_TEXT)
        htmlElement.style.setProperty('--theme-ui-colors-text-muted', DARK_TEXT_MUTED)
      }
    }

    const apply = () => {
      htmlElement.setAttribute('data-theme-ui-color-mode', colorMode)
      htmlElement.style.backgroundColor = bgColorRaw
    }

    const applyWithFallback = () => {
      const nextBg =
        theme?.rawColors?.background || theme?.colors?.background || (colorMode === 'dark' ? DARK_BG : LIGHT_BG)
      htmlElement.setAttribute('data-theme-ui-color-mode', colorMode)
      htmlElement.style.backgroundColor = nextBg
      runFallbackVars()
    }

    apply()
    const rafId = requestAnimationFrame(applyWithFallback)

    const onNav = () => requestAnimationFrame(applyWithFallback)
    window.addEventListener('hashchange', onNav)
    window.addEventListener('popstate', onNav)

    if (isColorModeDebugEnabled()) {
      logColorModeState(colorMode, theme, 'RootWrapper')
      if (prevModeRef.current !== colorMode) {
        prevModeRef.current = colorMode
        logColorModeState(colorMode, theme, 'RootWrapper (mode changed)')
      }
    } else {
      prevModeRef.current = colorMode
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('hashchange', onNav)
      window.removeEventListener('popstate', onNav)
    }
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
