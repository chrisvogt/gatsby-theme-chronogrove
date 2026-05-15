import React from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Text } from '@theme-ui/components'
import { useThemeUI } from 'theme-ui'

import isDarkMode from './helpers/isDarkMode.js'

/**
 * Metric summary card (e.g. Goodreads profile metrics). Uses `metricCard` / `metricCardDark` card variants.
 * When `loading` or `showPlaceholder` is true, renders `loadingSlot` or a lightweight pulse placeholder (no react-placeholder dependency).
 */
const MetricCard = ({ title, value, loading = false, showPlaceholder, loadingSlot, sx, ...props }) => {
  const { colorMode } = useThemeUI()
  const variant = isDarkMode(colorMode) ? 'metricCardDark' : 'metricCard'
  const isLoading = Boolean(loading || showPlaceholder)

  const body = isLoading ? (
    (loadingSlot ?? (
      <Box
        aria-busy='true'
        as='output'
        sx={{
          minHeight: '3rem',
          borderRadius: 'default',
          bg: 'muted',
          opacity: 0.7,
          animation: 'cgPulse 1.2s ease-in-out infinite',
          '@keyframes cgPulse': {
            '0%, 100%': { opacity: 0.45 },
            '50%': { opacity: 0.85 }
          }
        }}
      />
    ))
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minWidth: 0,
        width: '100%'
      }}
    >
      <Text
        as='span'
        sx={{
          fontFamily: 'heading',
          fontWeight: 'bold',
          fontSize: [4, 5],
          lineHeight: 1.1,
          color: 'text',
          m: 0,
          letterSpacing: '-0.02em'
        }}
      >
        {value}
      </Text>
      <Text
        as='span'
        sx={{
          fontSize: 0,
          color: 'textMuted',
          lineHeight: 1.35,
          m: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 'medium'
        }}
      >
        {title}
      </Text>
    </Box>
  )

  return (
    <Card
      variant={variant}
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        minHeight: '6rem',
        py: 3,
        ...sx
      }}
      {...props}
    >
      {body}
    </Card>
  )
}

MetricCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  loading: PropTypes.bool,
  showPlaceholder: PropTypes.bool,
  loadingSlot: PropTypes.node,
  sx: PropTypes.object
}

export default MetricCard
