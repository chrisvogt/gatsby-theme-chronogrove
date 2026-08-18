/** @jsx jsx */
import { jsx, Box, useThemeUI } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Grid } from '@theme-ui/components'
import getTimeSpent from './get-time-spent'
import isDarkMode from '../../../helpers/isDarkMode'
import ViewExternal from '../view-external'
import SteamGameCard from './steam-game-card'
import PropTypes from 'prop-types'

/** Steam's own UI shows total playtime as "X,XXX.Y hrs" — one decimal, thousands-separated. */
const formatHoursPlayed = hours =>
  hours.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Subtitle shown under leaderboard cards (recent playtime appended when present). */
const leaderboardSubtitle = game => {
  const hours = `${formatHoursPlayed(game.hoursPlayed)} hrs total`
  if (!game.playTime2Weeks) return hours
  const recentLabel = getTimeSpent(game.playTime2Weeks * 60 * 1000)
  return `${hours} • ${recentLabel} recently`
}

const PlayTimeChart = ({ games = [], isLoading = false, profileURL = '' }) => {
  const { colorMode, theme } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)
  const primaryColor = theme?.colors?.primary ?? (darkModeActive ? '#4a9eff' : '#422EA3')
  const primaryRgb = theme?.colors?.primaryRgb ?? (darkModeActive ? '74, 158, 255' : '66, 46, 163')
  const mutedTextColor = darkModeActive ? '#888' : '#666'

  const topGames = (games || [])
    .filter(game => game.playTimeForever > 0)
    .sort((a, b) => b.playTimeForever - a.playTimeForever)
    .slice(0, 10)
    .map((game, index) => ({
      ...game,
      hoursPlayed: Math.round(((game.playTimeForever || 0) / 60) * 10) / 10,
      rank: index + 1
    }))

  if (isLoading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            py: 5
          }}
        >
          <Box
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
        </Box>
      </Box>
    )
  }

  if (!games || games.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Themed.p
            sx={{
              fontStyle: 'italic',
              color: 'textMuted',
              fontSize: '16px'
            }}
          >
            No gaming data available for library.
          </Themed.p>
        </Box>
      </Box>
    )
  }

  const gamesHref = profileURL ? `${profileURL.replace(/\/$/, '')}/games/?tab=all` : null

  return (
    <Box sx={{ mb: 4 }}>
      <Grid
        sx={{
          gridGap: [3, 2, 2, 3],
          gridTemplateColumns: [
            'repeat(3, 1fr)',
            'repeat(4, 1fr)',
            'repeat(4, 1fr)',
            'repeat(5, 1fr)',
            'repeat(5, 1fr)'
          ],
          mb: 4
        }}
      >
        {topGames.map(game => (
          <SteamGameCard key={game.id} game={game} showRank rank={game.rank} subtitle={leaderboardSubtitle(game)} />
        ))}
      </Grid>

      <Box
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
        <Box sx={{ color: mutedTextColor, fontSize: '12px' }}>
          Total Hours:{' '}
          <Box as='span' sx={{ color: primaryColor, fontWeight: 'bold' }}>
            {formatHoursPlayed(topGames.reduce((sum, game) => sum + game.hoursPlayed, 0))} hrs
          </Box>
        </Box>
        <Box sx={{ color: mutedTextColor, fontSize: '12px' }}>
          Average:{' '}
          <Box as='span' sx={{ color: primaryColor, fontWeight: 'bold' }}>
            {formatHoursPlayed(topGames.reduce((sum, game) => sum + game.hoursPlayed, 0) / topGames.length)} hrs per
            game
          </Box>
        </Box>
      </Box>

      {gamesHref ? (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Box
            as='a'
            href={gamesHref}
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
              background: `rgba(${primaryRgb}, 0.1)`,
              border: `1px solid rgba(${primaryRgb}, 0.2)`,
              transition: 'all 0.2s ease',
              '&:hover': {
                background: `rgba(${primaryRgb}, 0.2)`,
                textDecoration: 'none',
                transform: 'scale(1.02)'
              }
            }}
          >
            View complete gaming library
            <ViewExternal />
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}

PlayTimeChart.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  profileURL: PropTypes.string
}

export default PlayTimeChart
