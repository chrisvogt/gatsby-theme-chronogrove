import { createSelector } from 'reselect'
import { getGitHubWidget } from '../reducers/widgets'

const EMPTY_USER = {}

const selectGitHubUser = state => getGitHubWidget(state).data?.user ?? EMPTY_USER

export const getMetrics = createSelector([selectGitHubUser], user => {
  const metrics = []

  const totalFollowersCount = user.followers?.totalCount
  const totalFollowingCount = user.following?.totalCount

  if (totalFollowersCount) {
    metrics.push({ displayName: 'Followers', id: 'followers', value: totalFollowersCount })
  }

  if (totalFollowingCount) {
    metrics.push({ displayName: 'Following', id: 'following', value: totalFollowingCount })
  }

  return metrics
})

export const getContributionCalendar = createSelector([selectGitHubUser], user => {
  return user.contributionsCollection?.contributionCalendar ?? null
})
