import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Heading } from '@theme-ui/components'

import { hexToRgba, normalizeHexToRrggbb } from './color-utils.js'

/** Alpha matching prior intent of appending `22` to 8-digit #RRGGBBAA (34/255) */
const METRIC_CHIP_BORDER_ALPHA = 34 / 255

/**
 * WidgetHeader
 *
 * Social-dashboard section headline: a large clean heading paired with square
 * data-chip metrics. No horizontal rules — section identity comes from the
 * colored icon chip and typographic weight alone.
 *
 * Layout:
 *   [icon chip] [Heading]  [CTA aside]          [metrics chips →]
 *
 * The icon chip is a small square badge (accent bg, white icon) that reads like
 * a label on a physical card index tab. Metrics are monospaced square chips:
 * number + unit in a bordered box, no rounded pills.
 */
const WidgetHeader = ({ aside, children, icon, metrics, metricsLoading, sx: sxProp }) => {
  const hasMetrics = (Array.isArray(metrics) && metrics.length > 0) || metricsLoading

  // Placeholder chips while loading
  const metricsToShow = metricsLoading ? [{}, {}] : Array.isArray(metrics) ? metrics : []

  return (
    <Box
      as='header'
      sx={{
        display: 'flex',
        flexDirection: ['column', 'row'],
        alignItems: ['flex-start', 'center'],
        justifyContent: ['flex-start', 'space-between'],
        gap: [2, 3],
        flexWrap: 'wrap',
        pb: 3,
        mb: hasMetrics ? 4 : 2,
        ...(typeof sxProp === 'object' && sxProp !== null ? sxProp : {})
      }}
    >
      {/* Left cluster: icon chip (center-aligned) + heading/CTA sub-row (baseline-aligned) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
          order: 1,
          minWidth: 0
        }}
      >
        {/* Colored square icon chip — center-aligned with the heading block */}
        {icon && (
          <Box
            aria-hidden='true'
            sx={{
              flexShrink: 0,
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'primary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme =>
                `inset 0 -2px 0 rgba(0,0,0,0.2), 0 1px 3px rgba(${theme.colors?.primaryRgb ?? '66,46,163'},0.3)`
            }}
          >
            <FontAwesomeIcon icon={icon} style={{ width: 14, height: 14, color: '#fff' }} />
          </Box>
        )}

        {/* Heading + CTA aside: baseline-aligned with each other, same as original */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: [1, 2],
            minWidth: 0
          }}
        >
          <Heading
            as='h2'
            sx={{
              fontSize: [4, 5],
              fontFamily: 'heading',
              fontWeight: 'bold',
              lineHeight: 1,
              m: 0,
              p: 0,
              textShadow: '0 1px 0 rgba(255,255,255,0.5), 0 -1px 0 rgba(0,0,0,0.07)',
              letterSpacing: '-0.01em'
            }}
          >
            {children}
          </Heading>

          {aside}
        </Box>
      </Box>

      {/* Right cluster: square metric chips */}
      {hasMetrics && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '6px',
            alignItems: 'center',
            order: 2,
            flexShrink: 0
          }}
        >
          {metricsToShow.map(({ displayName, id, value } = {}, idx) => (
            <Box
              key={id || idx}
              sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '52px',
                px: '6px',
                py: '4px',
                borderRadius: '4px',
                border: '1px solid',
                // Text-based border: theme `text` is often 3-digit hex (#111 / #fff); appending
                // `22` for alpha is invalid CSS — use rgba() from expanded hex instead.
                borderColor: theme => {
                  const text = theme?.colors?.text ?? '#111'
                  const base = normalizeHexToRrggbb(text)
                  return base ? hexToRgba(base, METRIC_CHIP_BORDER_ALPHA) : 'rgba(17, 17, 17, 0.133)'
                },
                // panel-background is defined for both light + dark in chronogrove-theme-surface-colors
                backgroundColor: 'panel-background',
                ...(metricsLoading
                  ? {
                      animation: 'cgPulse 1.4s ease-in-out infinite',
                      opacity: 0.5
                    }
                  : {})
              }}
            >
              <Box
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  color: 'primary',
                  letterSpacing: '-0.02em'
                }}
              >
                {value ?? '—'}
              </Box>
              <Box
                sx={{
                  fontFamily: 'heading',
                  fontSize: '0.6rem',
                  fontWeight: 'normal',
                  lineHeight: 1.2,
                  color: 'textMuted',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap'
                }}
              >
                {displayName ?? ''}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default WidgetHeader
