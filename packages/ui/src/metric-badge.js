import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from '@theme-ui/components'

const MetricBadge = ({ children, ...props }) => (
  <Badge mr={3} {...props}>
    {children}
  </Badge>
)

MetricBadge.propTypes = {
  children: PropTypes.node.isRequired
}

export default MetricBadge
