import React from 'react'

import PostTimelineIndex from '../../../theme/src/components/blog/post-timeline-index'

/**
 * Travel index timeline — thin wrapper so existing `travel-*` test ids and travel-specific
 * carousel alt/read-more copy stay stable.
 */
export default function TravelJournalIndex(props) {
  return (
    <PostTimelineIndex
      {...props}
      dataTestIdPrefix='travel'
      featuredImageAltFallback='Trip'
      readMoreAriaFallback='this trip'
    />
  )
}
