/** @jsx jsx */
import { jsx } from 'theme-ui'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'

import CallToAction from '../call-to-action'
import Playlists from './playlists'
import PlaylistsErrorBoundary from './playlists-error-boundary'
import ProfileMetricsBadge from '../profile-metrics-badge'
import TopTracks from './top-tracks'
import Widget from '../widget'
import WidgetHeader from '../widget-header'

import { getSpotifyWidgetDataSource } from '../../../selectors/metadata'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

const SpotifyWidget = () => {
  const metadata = useSiteMetadata()
  const spotifyDataSource = getSpotifyWidgetDataSource(metadata)

  const { data, isLoading, hasFatalError } = useWidgetData('spotify', spotifyDataSource)

  // Extract data from the query result
  const metrics = data?.metrics
  const playlists = data?.collections?.playlists
  const profileDisplayName = data?.profile?.displayName || ''
  const profileURL = data?.profile?.profileURL || ''
  const providerDisplayName = data?.provider?.displayName || ''
  const topTracks = data?.collections?.topTracks

  const callToAction = (
    <CallToAction title={`${profileDisplayName} on ${providerDisplayName}`} url={profileURL} isLoading={isLoading}>
      Browse Playlists
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  return (
    <Widget id='spotify' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faSpotify} isLoading={isLoading}>
        Spotify
      </WidgetHeader>

      <ProfileMetricsBadge isLoading={isLoading} metrics={metrics} />

      <TopTracks isLoading={isLoading} tracks={topTracks} />
      <PlaylistsErrorBoundary>
        <Playlists isLoading={isLoading} playlists={playlists} />
      </PlaylistsErrorBoundary>
    </Widget>
  )
}

export default SpotifyWidget
