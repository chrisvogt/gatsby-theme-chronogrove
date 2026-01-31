/** @jsx jsx */
import { jsx } from 'theme-ui'
import { faGoodreads } from '@fortawesome/free-brands-svg-icons'

import { getGoodreadsUsername, getGoodreadsWidgetDataSource } from '../../../selectors/metadata'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

import AiSummary from '../steam/ai-summary'
import CallToAction from '../call-to-action'
import ProfileMetricsBadge from '../profile-metrics-badge'
import RecentlyReadBooks from './recently-read-books'
import UserStatus from './user-status'
import Widget from '../widget'
import WidgetHeader from '../widget-header'

export default () => {
  const metadata = useSiteMetadata()
  const goodreadsUsername = getGoodreadsUsername(metadata)
  const goodreadsDataSource = getGoodreadsWidgetDataSource(metadata)

  const { data, isLoading, hasFatalError } = useWidgetData('goodreads', goodreadsDataSource)

  // Extract data from the query result (matching API structure)
  const aiSummary = data?.aiSummary

  // Books come from recentlyReadBooks, filtered to only those with thumbnails
  const recentlyReadBooks = data?.collections?.recentlyReadBooks || []
  const books = recentlyReadBooks.filter(({ thumbnail }) => Boolean(thumbnail)).slice(0, 12)

  // Build metrics from profile data
  const metrics = []
  if (data?.profile?.friendsCount) {
    metrics.push({ displayName: 'Friends', id: 'friends-count', value: data.profile.friendsCount })
  }
  if (data?.profile?.readCount) {
    metrics.push({ displayName: 'Books Read', id: 'read-count', value: data.profile.readCount })
  }

  // Profile display name
  const profileDisplayName = data?.profile?.name

  // Status comes from updates collection, finding first userstatus or review
  const updates = data?.collections?.updates || []
  const status = updates.find(({ type }) => type === 'userstatus' || type === 'review')

  const callToAction = (
    <CallToAction
      title={`${goodreadsUsername} on Goodreads`}
      url={`https://www.goodreads.com/${goodreadsUsername}`}
      isLoading={isLoading}
    >
      Visit Profile
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  return (
    <Widget id='goodreads' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faGoodreads}>
        Goodreads
      </WidgetHeader>

      <ProfileMetricsBadge isLoading={isLoading} metrics={metrics} />

      {aiSummary && <AiSummary aiSummary={aiSummary} />}

      <RecentlyReadBooks isLoading={isLoading} books={books} />

      <UserStatus actorName={profileDisplayName} isLoading={isLoading} status={status} />
    </Widget>
  )
}
