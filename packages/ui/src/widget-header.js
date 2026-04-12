import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Heading } from '@theme-ui/components'

import ProfileMetricsBadge from './profile-metrics-badge.js'

const baseHeaderStyles = {
  display: 'flex',
  flexDirection: ['column', 'row'],
  alignItems: ['center', 'baseline'],
  justifyContent: ['center', 'space-between'],
  gap: [2, 3],
  flexWrap: 'wrap',
  pb: 2,
  // Soft separator: visible but not harsh (gray[4] in theme scale; fallback ~12% black)
  borderBottom: '1px solid',
  borderColor: theme => theme?.colors?.gray?.[4] ?? 'rgba(0,0,0,0.12)'
}

/**
 * Groups headline + CTA so they sit together on the left; metrics stay on the right.
 * Always row so headline + CTA stay on one line at every breakpoint (including mobile).
 */
const titleGroupStyles = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: [1, 2],
  order: 1
}

/**
 * Override default heading margin, padding, and line-height so the headline and CTA
 * align on the same baseline at every breakpoint. Theme/global styles often add
 * vertical space to h2; zeroing it and using a tight line-height prevents offset.
 * Baseline alignment for icon + text keeps the headline baseline consistent.
 */
const headingStyles = {
  fontSize: [4, 5],
  display: 'flex',
  alignItems: 'baseline',
  m: 0,
  py: 0,
  pt: 0,
  pb: 0,
  lineHeight: 1
}

const metricsStyles = {
  order: 2
}

const WidgetHeader = ({ aside, children, icon, metrics, metricsLoading }) => {
  const hasMetrics = (Array.isArray(metrics) && metrics.length > 0) || metricsLoading
  return (
    <Box
      as='header'
      sx={{
        ...baseHeaderStyles,
        // Extra margin below header when metrics are present so spacing matches Latest Posts (no metrics)
        mb: hasMetrics ? 4 : 2
      }}
    >
      <Box sx={titleGroupStyles}>
        <Heading as='h2' sx={headingStyles}>
          {icon && (
            <Box
              as='span'
              sx={{
                display: 'inline-flex',
                alignItems: 'baseline',
                mr: 2,
                fontSize: 4,
                '& svg': { width: '1em', height: '1em' }
              }}
            >
              <FontAwesomeIcon icon={icon} aria-hidden='true' />
            </Box>
          )}
          {children}
        </Heading>
        {aside}
      </Box>
      {((Array.isArray(metrics) && metrics.length > 0) || metricsLoading) && (
        <Box sx={metricsStyles}>
          <ProfileMetricsBadge compact isLoading={metricsLoading} metrics={metrics} />
        </Box>
      )}
    </Box>
  )
}

export default WidgetHeader
