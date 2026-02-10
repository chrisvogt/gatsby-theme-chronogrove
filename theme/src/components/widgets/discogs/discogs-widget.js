/** @jsx jsx */
import { jsx } from 'theme-ui'
import { faRecordVinyl } from '@fortawesome/free-solid-svg-icons'

import CallToAction from '../call-to-action'
import ProfileMetricsBadge from '../profile-metrics-badge'
import VinylCollection from './vinyl-collection'
import Widget from '../widget'
import WidgetHeader from '../widget-header'

import { getDiscogsWidgetDataSource } from '../../../selectors/metadata'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

const DiscogsWidget = () => {
  const metadata = useSiteMetadata()
  const discogsDataSource = getDiscogsWidgetDataSource(metadata)

  const { data, isLoading, hasFatalError } = useWidgetData('discogs', discogsDataSource)

  // Extract data from the query result
  // Metrics come as an object and need to be transformed to array format
  const rawMetrics = data?.metrics || {}
  const metrics = Object.entries(rawMetrics)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({
      displayName: key,
      id: key.toLowerCase().replace(/\s+/g, '-'),
      value
    }))

  const profileURL = data?.profile?.profileURL || 'https://www.discogs.com'
  const releases = data?.collections?.releases

  const callToAction = (
    <CallToAction title='Collection on Discogs' url={profileURL} isLoading={isLoading}>
      Browse Collection
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  return (
    <Widget id='discogs' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faRecordVinyl} isLoading={isLoading}>
        Discogs
      </WidgetHeader>

      <ProfileMetricsBadge isLoading={isLoading} metrics={metrics} />

      <VinylCollection isLoading={isLoading} releases={releases} />
    </Widget>
  )
}

export default DiscogsWidget
