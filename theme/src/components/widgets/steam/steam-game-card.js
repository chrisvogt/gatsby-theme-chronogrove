/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { useState } from 'react'
import { RectShape } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../helpers/isDarkMode'
import LazyLoad from '../../lazy-load'

import 'react-placeholder/lib/reactPlaceholder.css'

const SteamGameCard = ({ game, showRank = false, rank = null, subtitle = null, onClick = null }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  const gameImage = game.images?.header || game.images?.icon || ''
  const handleClick = onClick || (() => window.open(`https://store.steampowered.com/app/${game.id}`, '_blank'))

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      sx={{
        variant: 'styles.InstagramItem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        p: 0,
        borderRadius: '8px',
        boxShadow: 'md',
        transition: 'all 200ms ease-in-out',
        '&:hover, &:focus': {
          transform: 'scale(1.015)',
          boxShadow: 'lg'
        }
      }}
    >
      {/* Game Image */}
      <div
        sx={{
          position: 'relative',
          width: '100%',
          height: '200px',
          overflow: 'hidden'
        }}
      >
        <LazyLoad
          placeholder={
            <div className='show-loading-animation' style={{ width: '100%', height: '200px' }}>
              <RectShape
                color={darkModeActive ? '#3a3a4a' : '#efefef'}
                style={{
                  width: '100%',
                  height: '200px'
                }}
              />
            </div>
          }
        >
          <img
            src={gameImage}
            alt={`${game.displayName} header`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        </LazyLoad>

        {/* Rank Badge */}
        {showRank && rank && (
          <div
            sx={{
              position: 'absolute',
              top: 2,
              left: 2,
              background: darkModeActive ? 'rgba(20, 20, 31, 0.85)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: darkModeActive ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: darkModeActive ? '#fff' : '#000',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '12px',
              boxShadow: darkModeActive ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 4px 16px rgba(0, 0, 0, 0.15)'
            }}
          >
            {rank}
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: darkModeActive
              ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 80%, transparent 100%)'
              : 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.9) 20%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Text Content */}
      <div
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 3,
          color: darkModeActive ? '#fff' : '#000'
        }}
      >
        {/* Game Name */}
        <div
          sx={{
            fontSize: '14px',
            fontWeight: 'bold',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textShadow: darkModeActive ? '0 1px 3px rgba(0,0,0,0.8)' : '0 1px 3px rgba(255,255,255,0.8)'
          }}
        >
          {game.displayName}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            sx={{
              fontSize: '12px',
              color: darkModeActive ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              textShadow: darkModeActive ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.8)'
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

export default SteamGameCard
