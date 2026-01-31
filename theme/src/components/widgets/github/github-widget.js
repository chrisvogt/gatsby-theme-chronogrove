/** @jsx jsx */
import { jsx } from 'theme-ui'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

import CallToAction from '../call-to-action'
import ContributionGraph from './contribution-graph'
import LazyLoad from '../../lazy-load'
import LastPullRequest from './last-pull-request'
import PinnedItems from './pinned-items'
import ProfileMetricsBadge from '../profile-metrics-badge'
import Widget from '../widget'
import WidgetHeader from '../widget-header'

import { getGithubUsername, getGithubWidgetDataSource } from '../../../selectors/metadata'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

/**
 * Extract metrics from GitHub user data
 * @param {Object} user - GitHub user object
 * @returns {Array} Array of metric objects
 */
const getMetrics = user => {
  const metrics = []
  const totalFollowersCount = user?.followers?.totalCount
  const totalFollowingCount = user?.following?.totalCount

  if (totalFollowersCount) {
    metrics.push({ displayName: 'Followers', id: 'followers', value: totalFollowersCount })
  }

  if (totalFollowingCount) {
    metrics.push({ displayName: 'Following', id: 'following', value: totalFollowingCount })
  }

  return metrics
}

const GitHubWidget = () => {
  const metadata = useSiteMetadata()
  const githubUsername = getGithubUsername(metadata)
  const githubDataSource = getGithubWidgetDataSource(metadata)

  const { data, isLoading, hasFatalError } = useWidgetData('github', githubDataSource)

  // Extract data from the query result
  const user = data?.user
  const metrics = getMetrics(user)
  const lastPullRequest = user?.pullRequests?.nodes?.[0]
  const pinnedItems = user?.pinnedItems?.nodes
  const contributionCalendar = user?.contributionsCollection?.contributionCalendar

  const callToAction = (
    <CallToAction
      title={`${githubUsername} on GitHub`}
      url={`https://www.github.com/${githubUsername}`}
      isLoading={isLoading}
    >
      Visit Profile
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  return (
    <Widget id='github' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faGithub}>
        GitHub
      </WidgetHeader>

      {!hasFatalError && <ProfileMetricsBadge metrics={metrics} />}

      <PinnedItems isLoading={isLoading} items={pinnedItems} placeholderCount={2} />
      <LastPullRequest isLoading={isLoading} pullRequest={lastPullRequest} />

      {/* Lazy load the contribution graph to prevent FOUC and improve initial render performance */}
      <LazyLoad placeholder={<div style={{ minHeight: '200px' }} />}>
        <ContributionGraph isLoading={isLoading} contributionCalendar={contributionCalendar} />
      </LazyLoad>
    </Widget>
  )
}

export default GitHubWidget
