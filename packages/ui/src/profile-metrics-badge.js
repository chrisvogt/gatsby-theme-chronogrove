import React from 'react'
import { Badge, Box } from '@theme-ui/components'

const ProfileMetricsBadge = ({ compact = false, isLoading, metrics = [] }) => {
  let metricsToShow
  if (isLoading) {
    metricsToShow = [{}, {}]
  } else if (Array.isArray(metrics)) {
    metricsToShow = metrics
  } else {
    metricsToShow = []
  }

  return (
    <Box
      sx={{
        fontFamily: 'heading',
        ...(compact ? { mt: 0, pb: 0, pt: 0 } : { mt: 2, pb: 4, pt: 1 }),
        display: 'flex',
        justifyContent: ['center', 'unset']
      }}
    >
      {metricsToShow.map(({ displayName, id, value }, idx) => (
        <Badge key={id || idx} variant='metrics' ml={idx !== 0 && 2}>
          {value} {displayName}
        </Badge>
      ))}
    </Box>
  )
}

export default ProfileMetricsBadge
