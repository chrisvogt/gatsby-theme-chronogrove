/** @jsx jsx */
import { jsx } from 'theme-ui'
import { faSteam } from '@fortawesome/free-brands-svg-icons'
import { useEffect } from 'react'
import { Heading } from '@theme-ui/components'
import { Themed } from '@theme-ui/mdx'
import { useDispatch, useSelector } from 'react-redux'
import React from 'react'

import CallToAction from '../call-to-action'
import PostCard from '../recent-posts/post-card'
import ProfileMetricsBadge from '../profile-metrics-badge'
import Widget from '../widget'
import WidgetHeader from '../widget-header'
import AiSummary from './ai-summary'
import PlayTimeChart from './play-time-chart'

import {
  getAiSummary,
  getHasFatalError,
  getIsLoading,
  getMetrics,
  getOwnedGames,
  getProfileDisplayName,
  getProfileURL,
  getRecentlyPlayedGames
} from '../../../selectors/steam'
import fetchDataSource from '../../../actions/fetchDataSource'
import { getSteamWidgetDataSource } from '../../../selectors/metadata'
import getTimeSpent from './get-time-spent'
import useSiteMetadata from '../../../hooks/use-site-metadata'

const SteamWidget = React.memo(() => {
  const dispatch = useDispatch()
  const metadata = useSiteMetadata()
  const steamDataSource = getSteamWidgetDataSource(metadata)

  const aiSummary = useSelector(getAiSummary)
  const hasFatalError = useSelector(getHasFatalError)
  const isLoading = useSelector(getIsLoading)
  const metrics = useSelector(getMetrics)
  const ownedGames = useSelector(getOwnedGames)
  const profileDisplayName = useSelector(getProfileDisplayName)
  const profileURL = useSelector(getProfileURL)
  const recentlyPlayedGames = useSelector(getRecentlyPlayedGames)

  useEffect(() => {
    if (isLoading) {
      dispatch(fetchDataSource('steam', steamDataSource))
    }
  }, [dispatch, steamDataSource, isLoading])

  const callToAction = (
    <CallToAction title={`${profileDisplayName} on Steam`} url={profileURL} isLoading={isLoading}>
      Visit Profile
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  return (
    <Widget id='steam' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faSteam} isLoading={isLoading}>
        Steam
      </WidgetHeader>

      <ProfileMetricsBadge isLoading={isLoading} metrics={metrics} />

      {aiSummary && <AiSummary aiSummary={aiSummary} />}

      <div sx={{ display: 'flex', flex: 1, alignItems: 'center', mt: 5, mb: 3 }}>
        <Heading as='h3' sx={{ fontSize: [3, 4] }}>
          Recently-Played Games
        </Heading>
      </div>

      <Themed.p sx={{ mb: 4 }}>Games I've played in the last two weeks.</Themed.p>

      <div
        sx={{
          display: 'grid',
          gridGap: [3, 2, 2, 3],
          gridTemplateColumns: ['repeat(2, 1fr)', 'repeat(3, 1fr)'],
          mb: 4
        }}
      >
        {recentlyPlayedGames.map(game => (
          <PostCard
            banner={game.images?.header}
            date={getTimeSpent(game.playTime2Weeks * 60 * 1000)}
            key={game.id}
            link={`https://store.steampowered.com/app/${game.id}`}
            title={game.displayName}
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
    </Widget>
  )
})

export default SteamWidget
