import { createSelector } from 'reselect'
import { getInstagramWidget } from '../reducers/widgets'

const EMPTY_ARRAY = []
const EMPTY_OBJECT = {}

const selectInstagramData = state => getInstagramWidget(state).data ?? EMPTY_OBJECT

export const getMedia = createSelector([selectInstagramData], data => data.collections?.media ?? EMPTY_ARRAY)

export const getMetrics = createSelector([selectInstagramData], data => data.metrics ?? EMPTY_ARRAY)

export const getProfileDisplayName = createSelector([selectInstagramData], data => data.profile?.displayName)

export const getProfileURL = createSelector([selectInstagramData], data => data.profile?.profileURL)

export const getHasFatalError = state => getInstagramWidget(state).state === 'FAILURE'
export const getIsLoading = state => getInstagramWidget(state).state !== 'SUCCESS'
