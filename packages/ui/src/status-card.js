import React from 'react'
import PropTypes from 'prop-types'
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

StatusCard.propTypes = {
  message: PropTypes.node.isRequired
}

export default StatusCard
