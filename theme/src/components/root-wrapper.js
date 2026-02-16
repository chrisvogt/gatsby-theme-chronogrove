/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useSelector } from 'react-redux'
import React, { useEffect, useRef } from 'react'

import AudioPlayer from './audio-player'
import {
  logColorModeState,
  logColorModeDebugBanner,
  isColorModeDebugEnabled,
  logWhereTextVarIsSet,
  logColorModeMismatch
} from '../helpers/color-mode-debug'

const LIGHT_BG = '#fdf8f5'
const DARK_BG = '#14141F'
const LIGHT_TEXT = '#111'
const LIGHT_TEXT_MUTED = '#333'
const DARK_TEXT = '#fff'
const DARK_TEXT_MUTED = '#d8d8d8'

const FALLBACK_STYLE_ID = 'chronogrove-color-mode-fallback'

function getOrCreateFallbackStyle() {
  if (typeof document === 'undefined') return null
  let el = document.getElementById(FALLBACK_STYLE_ID)
  if (!el) {
    el = document.createElement('style')
    el.id = FALLBACK_STYLE_ID
    document.head.appendChild(el)
  }
  return el
}

function clearFallbackStyle() {
  const el = typeof document !== 'undefined' ? document.getElementById(FALLBACK_STYLE_ID) : null
  if (el) el.textContent = ''
}

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

      if (isColorModeDebugEnabled()) {
        logWhereTextVarIsSet()
      }

      if (!isDark && looksLikeWhite) {
        logColorModeMismatch('Light mode but text var is white; applying light fallback', colorMode, textVar)
        htmlElement.style.setProperty('--theme-ui-colors-text', LIGHT_TEXT)
        htmlElement.style.setProperty('--theme-ui-colors-text-muted', LIGHT_TEXT_MUTED)
        const styleEl = getOrCreateFallbackStyle()
        if (styleEl) {
          styleEl.textContent = `:root{--theme-ui-colors-text:${LIGHT_TEXT} !important;--theme-ui-colors-text-muted:${LIGHT_TEXT_MUTED} !important}`
        }
      } else if (isDark && looksLikeDarkText) {
        logColorModeMismatch('Dark mode but text var is dark; applying dark fallback', colorMode, textVar)
        htmlElement.style.setProperty('--theme-ui-colors-text', DARK_TEXT)
        htmlElement.style.setProperty('--theme-ui-colors-text-muted', DARK_TEXT_MUTED)
        const styleEl = getOrCreateFallbackStyle()
        if (styleEl) {
          styleEl.textContent = `:root{--theme-ui-colors-text:${DARK_TEXT} !important;--theme-ui-colors-text-muted:${DARK_TEXT_MUTED} !important}`
        }
      } else {
        clearFallbackStyle()
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

    const t1 = setTimeout(applyWithFallback, 100)
    const t2 = setTimeout(applyWithFallback, 400)

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
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('hashchange', onNav)
      window.removeEventListener('popstate', onNav)
      clearFallbackStyle()
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
