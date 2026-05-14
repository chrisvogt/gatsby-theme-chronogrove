/** @jsx jsx */
import { jsx, Box, useThemeUI } from 'theme-ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { RectShape } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../helpers/isDarkMode'
import LazyLoad from '../../lazy-load'

import 'react-placeholder/lib/reactPlaceholder.css'

/** px; must match lazy placeholder + RectShape — img can't use height % inside LazyLoad's auto-height Box */
const STEAM_CARD_IMAGE_HEIGHT = 200

/** @returns {Record<string, unknown>} Theme UI sx for rank pill */
function steamRankBadgeSx(darkModeActive) {
  return {
    position: 'absolute',
    top: 2,
    left: 2,
    zIndex: 2,
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
  }
}

const SteamCardImagePlaceholder = ({ darkModeActive }) => {
  const color = darkModeActive ? '#3a3a4a' : '#efefef'
  return (
    <div className='show-loading-animation' style={{ width: '100%', height: STEAM_CARD_IMAGE_HEIGHT }}>
      <RectShape
        color={color}
        style={{
          width: '100%',
          height: STEAM_CARD_IMAGE_HEIGHT
        }}
      />
    </div>
  )
}

const SteamCardGameLazyImage = ({ darkModeActive, displayName, gameImage, isImageZoomed }) => (
  <LazyLoad placeholder={<SteamCardImagePlaceholder darkModeActive={darkModeActive} />}>
    <Box
      alt={`${displayName} header`}
      as='img'
      src={gameImage}
      sx={{
        display: 'block',
        width: '100%',
        height: STEAM_CARD_IMAGE_HEIGHT,
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
        transform: isImageZoomed ? 'scale(1.05)' : 'scale(1)'
      }}
    />
  </LazyLoad>
)

const SteamRankBadge = ({ darkModeActive, rank, showRank }) => {
  if (!showRank || !rank) return null
  return <Box sx={steamRankBadgeSx(darkModeActive)}>{rank}</Box>
}

const SteamGameCaptionOverlay = ({ displayName, subtitle }) => (
  <Box
    className='steam-game-card_caption'
    sx={{
      alignItems: 'center',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(2px)',
      WebkitBackdropFilter: 'blur(2px)',
      bottom: 0,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      left: 0,
      opacity: 0,
      padding: 3,
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      textAlign: 'center',
      top: 0,
      transition: 'opacity 0.2s ease-in-out',
      zIndex: 1
    }}
  >
    <Box
      sx={{
        fontSize: '14px',
        fontWeight: 'bold',
        mb: subtitle ? 1 : 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%'
      }}
    >
      {displayName}
    </Box>
    {subtitle ? <Box sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>{subtitle}</Box> : null}
  </Box>
)

const SteamCardGameMedia = ({ darkModeActive, game, gameImage, isImageZoomed, rank, showRank, subtitle }) => (
  <Box
    sx={{
      position: 'relative',
      width: '100%',
      height: STEAM_CARD_IMAGE_HEIGHT,
      overflow: 'hidden'
    }}
  >
    {gameImage ? (
      <SteamCardGameLazyImage
        darkModeActive={darkModeActive}
        displayName={game.displayName}
        gameImage={gameImage}
        isImageZoomed={isImageZoomed}
      />
    ) : (
      <SteamCardImagePlaceholder darkModeActive={darkModeActive} />
    )}
    <SteamRankBadge darkModeActive={darkModeActive} rank={rank} showRank={showRank} />
    <SteamGameCaptionOverlay displayName={game.displayName} subtitle={subtitle} />
  </Box>
)

SteamCardGameMedia.propTypes = {
  darkModeActive: PropTypes.bool.isRequired,
  game: PropTypes.shape({
    displayName: PropTypes.string.isRequired
  }).isRequired,
  gameImage: PropTypes.string.isRequired,
  isImageZoomed: PropTypes.bool.isRequired,
  rank: PropTypes.number,
  showRank: PropTypes.bool.isRequired,
  subtitle: PropTypes.string
}

const SteamGameCard = ({ game, showRank = false, rank = null, subtitle = null, onClick = null }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const isImageZoomed = isHovered || isFocused
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  const gameImage = game.images?.header || game.images?.icon || ''
  const handleClick = onClick || (() => window.open(`https://store.steampowered.com/app/${game.id}`, '_blank'))

  return (
    <Box
      as='button'
      type='button'
      aria-label={`View ${game.displayName} on Steam`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handleClick}
      sx={{
        variant: 'styles.InstagramItem',
        position: 'relative',
        display: 'block',
        width: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'none',
        backgroundColor: 'transparent',
        border: 'none',
        p: 0,
        borderRadius: '8px',
        boxShadow: 'md',
        transition: 'all 200ms ease-in-out',
        alignSelf: 'start',
        '&:hover, &:focus': {
          transform: 'scale(1.015)',
          boxShadow: 'lg'
        },
        '&:hover .steam-game-card_caption, &:focus .steam-game-card_caption': {
          opacity: 1
        }
      }}
    >
      <SteamCardGameMedia
        darkModeActive={darkModeActive}
        game={game}
        gameImage={gameImage}
        isImageZoomed={isImageZoomed}
        rank={rank == null ? undefined : rank}
        showRank={showRank}
        subtitle={subtitle == null ? undefined : subtitle}
      />
    </Box>
  )
}

export default SteamGameCard
