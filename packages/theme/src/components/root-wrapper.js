/** @jsx jsx */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useShallow } from 'zustand/react/shallow'

import { useAudioPlayerStore } from '../stores/audio-player-store'

import { logColorModeDebugBanner, logColorModeState } from '../helpers/color-mode-debug'
import AudioPlayer from './audio-player'
import {
  THEME_UI_COLOR_MODE_STORAGE_KEY,
  RECONCILE_COLOR_MODE_EVENT,
  useDocumentColorModeSurface
} from '@chronogrove/ui/color-mode'

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
  const { soundcloudId, spotifyURL, isVisible, provider } = useAudioPlayerStore(
    useShallow(state => ({
      soundcloudId: state.soundcloudId,
      spotifyURL: state.spotifyURL,
      isVisible: state.isVisible,
      provider: state.provider
    }))
  )
  const [colorMode, setColorMode] = useColorMode()
  const { theme } = useThemeUI()

  useDocumentColorModeSurface()

  const normalizedColorMode = colorMode === 'light' ? 'default' : colorMode || 'default'

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

  useEffect(() => {
    if (typeof window !== 'undefined') logColorModeState(normalizedColorMode, theme, 'RootWrapper')
  }, [normalizedColorMode, theme])

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

RootWrapper.propTypes = {
  children: PropTypes.node
}

export default RootWrapper
