/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { useRef, useState, useCallback } from 'react'
import { Card } from '@theme-ui/components'
import { navigate as gatsbyNavigate } from 'gatsby'
import { RectShape } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../helpers/isDarkMode'
import Book from '../../artwork/book'
import LazyLoad from '../../lazy-load'

import 'react-placeholder/lib/reactPlaceholder.css'

const MAX_TILT_DEG = 18

const BookLink = ({ id, thumbnailURL, title, suppressNavigation = false }) => {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const bookContainerRef = useRef(null)
  const [tilt, setTilt] = useState(0)
  // Ensure we have a valid URL and append webp format if it's a CDN URL
  const imageUrl = (() => {
    try {
      const url = new URL(thumbnailURL)
      const isImgixDomain = url.host.endsWith('.imgix.net')
      return isImgixDomain ? `${thumbnailURL}?auto=compress&auto=format` : thumbnailURL
    } catch {
      return thumbnailURL // Return the original URL if it's invalid
    }
  })()

  const handleMouseMove = useCallback(e => {
    const el = bookContainerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const centerX = rect.width / 2
    const normalized = rect.width > 0 ? (x - centerX) / centerX : 0
    const nextTilt = Math.max(-1, Math.min(1, normalized)) * MAX_TILT_DEG
    setTilt(nextTilt)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt(0)
  }, [])

  const handleClick = e => {
    e.preventDefault()
    e.stopPropagation() // Prevent event bubbling
    if (suppressNavigation) {
      return
    }
    // Store current scroll position
    const currentScroll = window.scrollY
    // Use a small timeout to ensure the scroll position is preserved
    setTimeout(() => {
      // Use Gatsby's navigate for the initial click
      gatsbyNavigate(`?bookId=${id}`, {
        replace: true,
        state: {
          noScroll: true,
          scrollPosition: currentScroll
        }
      })
    }, 0)
  }

  return (
    <Card
      variant='actionCard'
      sx={{
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
      }}
    >
      <button
        data-testid='book-link'
        type='button'
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        title={title}
        sx={{
          appearance: 'none',
          background: 'transparent',
          border: 0,
          color: 'var(--theme-ui-colors-panel-text)',
          cursor: 'pointer',
          display: 'block',
          height: '100%',
          m: 0,
          p: 0,
          width: '100%',
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary',
            outlineOffset: '2px'
          }
        }}
      >
        <LazyLoad
          placeholder={
            <div className='show-loading-animation' style={{ width: '100%' }}>
              <RectShape
                color={darkModeActive ? '#3a3a4a' : '#efefef'}
                style={{
                  width: '100%',
                  paddingBottom: '100%', // Square aspect ratio to match SVG viewBox
                  borderRadius: '4px'
                }}
              />
            </div>
          }
        >
          <div
            ref={bookContainerRef}
            data-testid='book-link-tilt-container'
            sx={{
              width: '100%',
              perspective: '400px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              data-testid='book-link-tilt-inner'
              sx={{
                width: '100%',
                transition: 'transform 0.15s ease-out',
                transform: `rotateY(${tilt}deg)`,
                transformOrigin: '50% 50%'
              }}
            >
              <Book thumbnailURL={imageUrl} title={title} />
            </div>
          </div>
        </LazyLoad>
      </button>
    </Card>
  )
}

export default BookLink
