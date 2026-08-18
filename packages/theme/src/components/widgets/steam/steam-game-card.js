/** @jsx jsx */
import { jsx, Box, useThemeUI } from 'theme-ui'
import PropTypes from 'prop-types'
import { nullableNumber, nullableString } from '@chronogrove/ui/prop-types-helpers'
import { useState } from 'react'
import { RectShape } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../helpers/isDarkMode'
import LazyLoad from '../../lazy-load'
import ViewExternal from '../view-external'

import 'react-placeholder/lib/reactPlaceholder.css'

/** Steam header art ships ~460x215; matching that ratio keeps object-fit: cover from cropping much off the sides. */
const STEAM_CARD_IMAGE_ASPECT_RATIO = '2.15 / 1'

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
    <div className='show-loading-animation' style={{ width: '100%', aspectRatio: STEAM_CARD_IMAGE_ASPECT_RATIO }}>
      <RectShape
        color={color}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}

SteamCardImagePlaceholder.propTypes = {
  darkModeActive: PropTypes.bool.isRequired
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
        aspectRatio: STEAM_CARD_IMAGE_ASPECT_RATIO,
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
        transform: isImageZoomed ? 'scale(1.05)' : 'scale(1)'
      }}
    />
  </LazyLoad>
)

SteamCardGameLazyImage.propTypes = {
  darkModeActive: PropTypes.bool.isRequired,
  displayName: PropTypes.string.isRequired,
  gameImage: PropTypes.string.isRequired,
  isImageZoomed: PropTypes.bool.isRequired
}

const SteamRankBadge = ({ darkModeActive, rank, showRank }) => {
  if (!showRank || !rank) return null
  return <Box sx={steamRankBadgeSx(darkModeActive)}>{rank}</Box>
}

SteamRankBadge.propTypes = {
  darkModeActive: PropTypes.bool.isRequired,
  rank: PropTypes.number,
  showRank: PropTypes.bool.isRequired
}

/** Shown over the artwork on hover/focus, since the title + subtitle now live in the caption below. */
const SteamGameHoverOverlay = () => (
  <Box
    className='steam-game-card_hover-overlay'
    sx={{
      alignItems: 'center',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(2px)',
      WebkitBackdropFilter: 'blur(2px)',
      bottom: 0,
      color: 'white',
      display: 'flex',
      fontSize: '13px',
      fontWeight: 'bold',
      gap: 1,
      justifyContent: 'center',
      left: 0,
      opacity: 0,
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      top: 0,
      transition: 'opacity 0.2s ease-in-out',
      zIndex: 1
    }}
  >
    Open in Steam
    <ViewExternal />
  </Box>
)

const SteamCardGameMedia = ({ darkModeActive, game, gameImage, isImageZoomed, rank, showRank }) => (
  <Box
    sx={{
      position: 'relative',
      width: '100%',
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
    <SteamGameHoverOverlay />
  </Box>
)

const steamGamePropType = PropTypes.shape({
  displayName: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  images: PropTypes.shape({
    header: PropTypes.string,
    icon: PropTypes.string
  })
}).isRequired

SteamCardGameMedia.propTypes = {
  darkModeActive: PropTypes.bool.isRequired,
  game: steamGamePropType,
  gameImage: PropTypes.string.isRequired,
  isImageZoomed: PropTypes.bool.isRequired,
  rank: PropTypes.number,
  showRank: PropTypes.bool.isRequired
}

/** Always-visible title + subtitle, below the artwork. */
const SteamGameCaption = ({ displayName, subtitle }) => (
  <Box className='steam-game-card_caption' sx={{ padding: '10px 12px', textAlign: 'left' }}>
    <Box
      sx={{
        color: 'text',
        fontSize: '13px',
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
    >
      {displayName}
    </Box>
    {subtitle ? (
      <Box
        sx={{
          color: 'textMuted',
          fontSize: '12px',
          mt: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {subtitle}
      </Box>
    ) : null}
  </Box>
)

SteamGameCaption.propTypes = {
  displayName: PropTypes.string.isRequired,
  subtitle: PropTypes.string
}

const SteamGameCard = ({ game, showRank = false, rank = null, subtitle = null, onClick = null }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const isImageZoomed = isHovered || isFocused
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  const gameImage = game.images?.header || game.images?.icon || ''
  const handleClick =
    onClick || (() => window.open(`https://store.steampowered.com/app/${game.id}`, '_blank', 'noopener,noreferrer'))

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
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: 'panel-background',
        border: 'none',
        p: 0,
        borderRadius: '8px',
        boxShadow: 'md',
        textAlign: 'left',
        transition: 'all 200ms ease-in-out',
        alignSelf: 'start',
        '&:hover, &:focus': {
          transform: 'scale(1.015)',
          boxShadow: 'lg'
        },
        '&:hover .steam-game-card_hover-overlay, &:focus .steam-game-card_hover-overlay': {
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
      />
      <SteamGameCaption displayName={game.displayName} subtitle={subtitle == null ? undefined : subtitle} />
    </Box>
  )
}

SteamGameCard.propTypes = {
  game: steamGamePropType,
  onClick: PropTypes.func,
  rank: nullableNumber,
  showRank: PropTypes.bool,
  subtitle: nullableString
}

export default SteamGameCard
