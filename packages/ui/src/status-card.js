import React from 'react'
import { Card } from '@theme-ui/components'
import { useThemeUI } from 'theme-ui'

import isDarkMode from './helpers/isDarkMode.js'

const StatusCard = ({ message, ...props }) => {
  const { colorMode } = useThemeUI()
  const variant = isDarkMode(colorMode) ? 'metricCardDark' : 'metricCard'

  return (
    <Card variant={variant} sx={{ mb: 3 }} {...props}>
      {message}
    </Card>
  )
}

export default StatusCard
