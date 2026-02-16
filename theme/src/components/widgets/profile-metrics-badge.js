/** @jsx jsx */
import { Badge, jsx } from 'theme-ui'

const ProfileMetricsBadge = ({ compact = false, isLoading, metrics = [] }) => {
  const metricsToShow = isLoading ? [{}, {}] : Array.isArray(metrics) ? metrics : []

  return (
    <div
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
    </div>
  )
}

export default ProfileMetricsBadge
