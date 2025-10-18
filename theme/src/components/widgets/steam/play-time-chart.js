/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { useState } from 'react'
import { Themed } from '@theme-ui/mdx'
import { Grid } from '@theme-ui/components'
import getTimeSpent from './get-time-spent'
import isDarkMode from '../../../helpers/isDarkMode'
import ViewExternal from '../view-external'

// Accept profileURL as a prop
const PlayTimeChart = ({ games = [], isLoading = false, profileURL = '' }) => {
  const [hoveredGame, setHoveredGame] = useState(null)
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  // Prepare data - top 10 games by playtime
  const topGames = (games || [])
    .filter(game => game.playTimeForever > 0)
    .sort((a, b) => b.playTimeForever - a.playTimeForever)
    .slice(0, 10)
    .map((game, index) => ({
      ...game,
      hoursPlayed: Math.round(((game.playTimeForever || 0) / 60) * 100) / 100,
      rank: index + 1
    }))

  const primaryColor = darkModeActive ? '#4a9eff' : '#422EA3'
  const mutedTextColor = darkModeActive ? '#888' : '#666'

  // Loading state
  if (isLoading) {
    return (
      <div sx={{ mb: 4 }}>
        <div
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            py: 5
          }}
        >
          <div
            sx={{
              width: '60px',
              height: '60px',
              border: `3px solid ${primaryColor}`,
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              },
              animation: 'spin 1s linear infinite'
            }}
          />
          <Themed.p
            sx={{
              color: primaryColor,
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Loading Gaming Library...
          </Themed.p>
        </div>
      </div>
    )
  }

  // Empty state when not loading
  if (!games || games.length === 0) {
    return (
      <div sx={{ mb: 4 }}>
        <div
          sx={{
            textAlign: 'center',
            py: 5
          }}
        >
          <Themed.p
            sx={{
              fontStyle: 'italic',
              color: 'textMuted',
              fontSize: '16px'
            }}
          >
            No gaming data available for library.
          </Themed.p>
        </div>
      </div>
    )
  }

  return (
    <div sx={{ mb: 4 }}>
      <Grid
        sx={{
          gridGap: [3, 2, 2, 3],
          gridTemplateColumns: ['repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)'],
          mb: 4
        }}
      >
        {topGames.map(game => {
          const isHovered = hoveredGame?.id === game.id
          const gameImage = game.images?.header || game.images?.icon || ''

          return (
            <div
              key={game.id}
              onMouseEnter={() => setHoveredGame(game)}
              onMouseLeave={() => setHoveredGame(null)}
              onClick={() => window.open(`https://store.steampowered.com/app/${game.id}`, '_blank')}
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

                {/* Rank Badge */}
                <div
                  sx={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    background: darkModeActive ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: darkModeActive
                      ? '1px solid rgba(255, 255, 255, 0.2)'
                      : '1px solid rgba(255, 255, 255, 0.3)',
                    color: darkModeActive ? '#fff' : '#000',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    boxShadow: darkModeActive ? '0 4px 16px rgba(0, 0, 0, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {game.rank}
                </div>

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

                {/* Play Hours */}
                <div
                  sx={{
                    fontSize: '12px',
                    color: darkModeActive ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                    textShadow: darkModeActive ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  {game.hoursPlayed}h total
                  {game.playTime2Weeks && (
                    <span sx={{ ml: 1 }}>• {getTimeSpent(game.playTime2Weeks * 60 * 1000)} recently</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </Grid>

      {/* Footer Stats */}
      <div
        sx={{
          mt: 4,
          pt: 3,
          borderTop: darkModeActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3
        }}
      >
        <div sx={{ color: mutedTextColor, fontSize: '12px' }}>
          Total Hours:{' '}
          <span sx={{ color: primaryColor, fontWeight: 'bold' }}>
            {topGames.reduce((sum, game) => sum + game.hoursPlayed, 0).toFixed(1)}h
          </span>
        </div>
        <div sx={{ color: mutedTextColor, fontSize: '12px' }}>
          Average:{' '}
          <span sx={{ color: primaryColor, fontWeight: 'bold' }}>
            {(topGames.reduce((sum, game) => sum + game.hoursPlayed, 0) / topGames.length).toFixed(1)}h per game
          </span>
        </div>
      </div>

      {/* View All Games Link */}
      {profileURL && (
        <div
          sx={{
            mt: 3,
            textAlign: 'center'
          }}
        >
          <a
            href={`${profileURL.replace(/\/$/, '')}/games/?tab=all`}
            sx={{
              color: primaryColor,
              textDecoration: 'none',
              fontWeight: 'medium',
              fontSize: ['12px', '13px'],
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              background: darkModeActive ? 'rgba(74, 158, 255, 0.1)' : 'rgba(66, 46, 163, 0.1)',
              border: darkModeActive ? '1px solid rgba(74, 158, 255, 0.2)' : '1px solid rgba(66, 46, 163, 0.2)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: darkModeActive ? 'rgba(74, 158, 255, 0.2)' : 'rgba(66, 46, 163, 0.2)',
                textDecoration: 'none',
                transform: 'scale(1.02)'
              }
            }}
          >
            View complete gaming library
            <ViewExternal />
          </a>
        </div>
      )}
    </div>
  )
}

export default PlayTimeChart
