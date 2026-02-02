/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
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
  const isDark = colorMode === 'dark'

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

  if (!isVisible || !provider || !containerRef.current) return null

  return createPortal(
    <div
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        // Use CSS custom properties directly to ensure color mode works in portals
        background: 'var(--theme-ui-colors-panel-background)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)', // for Safari
        pt: 2,
        pb: 3,
        px: 3,
        boxShadow: isDark ? '0 -2px 10px rgba(0,0,0,0.3)' : '0 -2px 10px rgba(0,0,0,0.1)',
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
            // Use CSS custom property directly for color mode support in portals
            color: 'var(--theme-ui-colors-text)',
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
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
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
