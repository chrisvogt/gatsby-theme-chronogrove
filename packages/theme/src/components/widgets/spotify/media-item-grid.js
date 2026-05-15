/** @jsx jsx */
import { jsx, Box, useThemeUI } from 'theme-ui'
import { useState } from 'react'
import { Themed } from '@theme-ui/mdx'
import Placeholder from 'react-placeholder'
import { RectShape } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../helpers/is-dark-mode'

import { glassmorhismPanel } from '@chronogrove/ui/theme'

const PLACEHOLDER_COUNT = 12

/** Stable keys so skeleton placeholders are not keyed by map index alone */
const MEDIA_ITEM_GRID_PLACEHOLDER_KEYS = Array.from(
  { length: PLACEHOLDER_COUNT },
  (_, i) => `media-item-grid-ph-${String(i).padStart(2, '0')}`
)

const MediaItemGrid = ({ interactionDisabled = false, isLoading, items = [], onTrackClick }) => {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const [currentMediaId, setCurrentMediaId] = useState(false)

  const placeholders = MEDIA_ITEM_GRID_PLACEHOLDER_KEYS.map(key => (
    <Box key={key} className='show-loading-animation'>
      <RectShape
        color={darkModeActive ? '#3a3a4a' : '#efefef'}
        sx={{
          borderRadius: '8px',
          boxShadow: 'md',
          paddingBottom: '100%',
          width: '100%'
        }}
        showLoadingAnimation
      />
    </Box>
  ))

  const handleClick = (e, spotifyURL) => {
    if (interactionDisabled) {
      e.preventDefault()
      return
    }
    if (!onTrackClick) {
      return
    }
    e.preventDefault()
    onTrackClick(spotifyURL)
  }

  return (
    <Box
      className={`media-item_grid ${currentMediaId ? 'media-item_grid--interacting' : null}`}
      sx={{
        display: 'grid',
        gridGap: [3, 2, 2, 3],
        gridTemplateColumns: ['repeat(3, 1fr)', 'repeat(4, 1fr)', 'repeat(4, 1fr)', 'repeat(5, 1fr)', 'repeat(6, 1fr)']
      }}
    >
      <Placeholder ready={!isLoading} customPlaceholder={placeholders}>
        {items.map(({ id, details, name, spotifyURL, thumbnailURL }) => {
          return (
            <Themed.a
              className={`media-item_media${currentMediaId === id ? ' media-item--focused' : ''}`}
              href={spotifyURL}
              key={id}
              onClick={e => handleClick(e, spotifyURL)}
              onMouseEnter={() => setCurrentMediaId(id)}
              onMouseLeave={() => setCurrentMediaId(false)}
              title={details}
              sx={{
                display: 'block',
                position: 'relative',
                height: '100%',
                width: '100%',
                transition: 'all 200ms ease-in-out',
                transform: 'translateY(0)',
                '&:hover': {
                  transform: 'translateY(-2px) scale(1.015)',
                  boxShadow: 'lg'
                },
                ...glassmorhismPanel,
                overflow: 'hidden',
                '&:hover .media-item_caption': {
                  opacity: 1
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                {name && (
                  <Themed.div
                    className='media-item_caption'
                    sx={{
                      color: 'white',
                      fontSize: [1, 1, 1, 2],
                      fontWeight: 'bold',
                      opacity: 0,
                      transition: 'opacity 0.2s ease-in-out',
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'absolute',
                      textAlign: 'center',
                      padding: 2,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      background: 'rgba(0, 0, 0, 0.85)',
                      backdropFilter: 'blur(2px)',
                      WebkitBackdropFilter: 'blur(2px)'
                    }}
                  >
                    <span>{name}</span>
                  </Themed.div>
                )}
                <Box
                  alt='cover artwork'
                  as='img'
                  crossOrigin='anonymous'
                  loading='lazy'
                  src={thumbnailURL}
                  sx={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1/1'
                  }}
                />
              </Box>
            </Themed.a>
          )
        })}
      </Placeholder>
    </Box>
  )
}

export default MediaItemGrid
