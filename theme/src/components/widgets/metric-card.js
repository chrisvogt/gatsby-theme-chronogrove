import React from 'react'

import UiMetricCard from '@chronogrove/ui/metric-card'

const MetricCard = ({ showPlaceholder, loading, ...rest }) => (
  <UiMetricCard loading={loading ?? showPlaceholder} {...rest} />
)

export default MetricCard
