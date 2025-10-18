/** @jsx jsx */
import { jsx, useThemeUI } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Grid } from '@theme-ui/components'
import getTimeSpent from './get-time-spent'
import isDarkMode from '../../../helpers/isDarkMode'
import ViewExternal from '../view-external'
import SteamGameCard from './steam-game-card'

// Accept profileURL as a prop
const PlayTimeChart = ({ games = [], isLoading = false, profileURL = '' }) => {
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
        {topGames.map(game => (
          <SteamGameCard
            key={game.id}
            game={game}
            showRank={true}
            rank={game.rank}
            subtitle={`${game.hoursPlayed}h total${game.playTime2Weeks ? ` • ${getTimeSpent(game.playTime2Weeks * 60 * 1000)} recently` : ''}`}
          />
        ))}
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
