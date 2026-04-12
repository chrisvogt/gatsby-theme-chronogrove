import React from 'react'
import { Badge } from '@theme-ui/components'

const MetricBadge = ({ children, ...props }) => (
  <Badge mr={3} {...props}>
    {children}
  </Badge>
)

export default MetricBadge
