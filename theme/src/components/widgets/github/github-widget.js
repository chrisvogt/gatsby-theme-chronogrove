/** @jsx jsx */
import { jsx } from 'theme-ui'

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

import { faGithub } from '@fortawesome/free-brands-svg-icons'

import CallToAction from '../call-to-action'
import LastPullRequest from './last-pull-request'
import PinnedItems from './pinned-items'
import ProfileMetricsBadge from '../profile-metrics-badge'
import Widget from '../widget'
import WidgetHeader from '../widget-header'

import fetchDataSource from '../../../actions/fetchDataSource'
import { getGithubUsername, getGithubWidgetDataSource } from '../../../selectors/metadata'
import { getMetrics, getContributionCalendar } from '../../../selectors/github'
import { SUCCESS, FAILURE, getGitHubWidget } from '../../../reducers/widgets'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import ContributionGraph from './contribution-graph'

const getHasFatalError = state => getGitHubWidget(state).state === FAILURE
const getIsLoading = state => getGitHubWidget(state).state !== SUCCESS
const getLastPullRequest = state => getGitHubWidget(state).data?.user?.pullRequests?.nodes?.[0]
const getPinnedItems = state => getGitHubWidget(state).data?.user?.pinnedItems?.nodes

const GitHubWidget = () => {
  const dispatch = useDispatch()

  const metadata = useSiteMetadata()
  const githubUsername = getGithubUsername(metadata)
  const githubDataSource = getGithubWidgetDataSource(metadata)

  const hasFatalError = useSelector(getHasFatalError)
  const isLoading = useSelector(getIsLoading)
  const lastPullRequest = useSelector(getLastPullRequest)
  const metrics = useSelector(getMetrics)
  const pinnedItems = useSelector(getPinnedItems)
  const contributionCalendar = useSelector(getContributionCalendar)

  useEffect(() => {
    if (isLoading) {
      dispatch(fetchDataSource('github', githubDataSource))
    }
  }, [dispatch, githubDataSource, isLoading])

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
      <ContributionGraph isLoading={isLoading} contributionCalendar={contributionCalendar} />
    </Widget>
  )
}

export default GitHubWidget
