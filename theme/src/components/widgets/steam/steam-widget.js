/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import { faSteam } from '@fortawesome/free-brands-svg-icons'
import { Heading } from '@theme-ui/components'
import { Themed } from '@theme-ui/mdx'
import React from 'react'
import { RectShape } from 'react-placeholder/lib/placeholders'
import isDarkMode from '../../../helpers/isDarkMode'

import 'react-placeholder/lib/reactPlaceholder.css'

import CallToAction from '../call-to-action'
import Widget from '../widget'
import WidgetHeader from '../widget-header'
import AiSummary from './ai-summary'
import AiSummarySkeleton from './ai-summary-skeleton'
import PlayTimeChart from './play-time-chart'
import SteamGameCard from './steam-game-card'

const RECENTLY_PLAYED_PLACEHOLDER_COUNT = 6

import { getSteamWidgetDataSource } from '../../../selectors/metadata'
import getTimeSpent from './get-time-spent'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

const SteamWidget = React.memo(() => {
  const [colorMode] = useColorMode()
  const darkModeActive = isDarkMode(colorMode)
  const metadata = useSiteMetadata()
  const steamDataSource = getSteamWidgetDataSource(metadata)

  const { data, isLoading, hasFatalError } = useWidgetData('steam', steamDataSource)

  // Extract data from the query result
  const aiSummary = data?.aiSummary
  const metrics = data?.metrics
  const ownedGames = data?.collections?.ownedGames || []
  const profileDisplayName = data?.profile?.displayName
  const profileURL = data?.profile?.profileURL
  const recentlyPlayedGames = data?.collections?.recentlyPlayedGames || []

  const callToAction = (
    <CallToAction title={`${profileDisplayName} on Steam`} url={profileURL} isLoading={isLoading}>
      Visit Profile
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  return (
    <Widget id='steam' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faSteam} metrics={metrics} metricsLoading={isLoading}>
        Steam
      </WidgetHeader>

      <div sx={{ display: 'flex', flex: 1, alignItems: 'center', mb: 3 }}>
        <Heading as='h3' sx={{ fontSize: [3, 4] }}>
          Recently-Played Games
        </Heading>
      </div>

      <Themed.p sx={{ mb: 4 }}>Games I've played in the last two weeks.</Themed.p>

      <div
        sx={{
          display: 'grid',
          gridGap: [3, 2, 2, 3],
          gridTemplateColumns: ['repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)'],
          mb: 4
        }}
      >
        {isLoading
          ? Array.from({ length: RECENTLY_PLAYED_PLACEHOLDER_COUNT }).map((_, i) => (
              <div
                key={i}
                aria-hidden
                sx={{
                  variant: 'styles.InstagramItem',
                  borderRadius: '8px',
                  boxShadow: 'md',
                  overflow: 'hidden'
                }}
              >
                <div className='show-loading-animation' style={{ width: '100%', height: '200px' }}>
                  <RectShape
                    color={darkModeActive ? '#3a3a4a' : '#efefef'}
                    style={{ width: '100%', height: '200px', borderRadius: '8px' }}
                  />
                </div>
                <div sx={{ height: '72px', p: 3 }} />
              </div>
            ))
          : recentlyPlayedGames.map(game => (
              <SteamGameCard
                key={game.id}
                game={game}
                showRank={false}
                subtitle={getTimeSpent(game.playTime2Weeks * 60 * 1000)}
              />
            ))}
      </div>

      <div sx={{ display: 'flex', flex: 1, alignItems: 'center', mb: 3 }}>
        <Heading as='h3' sx={{ fontSize: [3, 4] }}>
          Leaderboard
        </Heading>
      </div>

      <Themed.p sx={{ mb: 4 }}>My top 10 most played games.</Themed.p>

      <PlayTimeChart games={ownedGames} isLoading={isLoading} profileURL={profileURL} />

      {isLoading && !aiSummary ? <AiSummarySkeleton skeletonRows={3} /> : null}
      {aiSummary ? <AiSummary aiSummary={aiSummary} /> : null}
    </Widget>
  )
})

export default SteamWidget
