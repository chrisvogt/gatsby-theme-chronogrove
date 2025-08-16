/** @jsx jsx */
import { jsx, useColorMode, useThemeUI } from 'theme-ui'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch } from 'react-redux'
import { hidePlayer } from '../reducers/audioPlayer'
import SoundCloud from '../shortcodes/soundcloud'
import Spotify from '../shortcodes/spotify'

const AudioPlayer = ({ soundcloudId, spotifyURL, isVisible, provider }) => {
  const containerRef = useRef(null)
  const widgetRef = useRef(null)
  const dispatch = useDispatch()
  const [colorMode] = useColorMode()
  const { theme } = useThemeUI()

  // Create portal container on mount
  useEffect(() => {
    if (!containerRef.current) {
      containerRef.current = document.createElement('div')
      containerRef.current.id = 'audio-player-portal'
      document.body.appendChild(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        document.body.removeChild(containerRef.current)
        containerRef.current = null
      }
    }
  }, [])

  // Update widget when soundcloudId changes
  useEffect(() => {
    if (soundcloudId) {
      widgetRef.current = soundcloudId
    }
  }, [soundcloudId])

  const renderEmbed = () => {
    if (provider === 'soundcloud' && soundcloudId) {
      return <SoundCloud soundcloudId={soundcloudId} />
    }
    if (provider === 'spotify' && spotifyURL) {
      return <Spotify spotifyURL={spotifyURL} />
    }
    return null
  }

  // Define background colors for each mode
  const getBackgroundColor = () => {
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('AudioPlayer colorMode:', colorMode)
      console.log('AudioPlayer theme colors:', theme?.colors)
      if (typeof document !== 'undefined') {
        console.log('Document theme attributes:', {
          'data-theme-ui-color-mode': document.documentElement.getAttribute('data-theme-ui-color-mode'),
          'data-theme': document.documentElement.getAttribute('data-theme')
        })
      }
    }

    // Primary method: use Theme UI's useColorMode hook
    if (colorMode === 'dark') {
      return 'rgba(1, 1, 1, 0.30)'
    }

    // Fallback method: check document attribute
    if (typeof document !== 'undefined') {
      const docMode =
        document.documentElement.getAttribute('data-theme-ui-color-mode') ||
        document.documentElement.getAttribute('data-theme')
      if (docMode === 'dark') {
        return 'rgba(1, 1, 1, 0.30)'
      }
    }

    // Fallback to theme colors if available
    if (theme && theme.colors && theme.colors['panel-background']) {
      return theme.colors['panel-background']
    }

    return 'rgba(255, 255, 255, 0.35)'
  }

  if (!isVisible || !provider || !containerRef.current) return null

  return createPortal(
    <div
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: [getBackgroundColor(), 'var(--theme-ui-colors-panel-background, rgba(255, 255, 255, 0.35))'],
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)', // for Safari
        pt: 2,
        pb: 3,
        px: 3,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div
        sx={{
          width: '100%',
          maxWidth: [
            '100%', // mobile: full width
            '100%', // tablet: full width
            '1200px', // desktop: max-width
            '1400px' // large desktop: slightly wider
          ],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }}
      >
        <button
          onClick={() => dispatch(hidePlayer())}
          sx={{
            background: 'none',
            border: 'none',
            color: 'text',
            cursor: 'pointer',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            transition: 'all 0.2s ease',
            mb: 1,
            '&:hover': {
              background: 'rgba(0,0,0,0.1)'
            }
          }}
          aria-label='Close audio player'
        >
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M12 4L4 12M4 4L12 12'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <div
          sx={{
            width: '100%',
            '& iframe': {
              width: '100% !important',
              height: '100px !important', // fixed compact height
              maxHeight: '100px !important'
            }
          }}
        >
          {renderEmbed()}
        </div>
      </div>
    </div>,
    containerRef.current
  )
}

export default AudioPlayer
