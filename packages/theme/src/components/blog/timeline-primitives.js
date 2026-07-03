/** @jsx jsx */
import PropTypes from 'prop-types'
import { nullableString } from '@chronogrove/ui/prop-types-helpers'
import { jsx, Box } from 'theme-ui'
import { Link } from 'gatsby'

/** Uniform timeline stamp thumbnail width (3:4 aspect); keeps the left column visually aligned row-to-row */
export const TIMELINE_STAMP_THUMB_PX = 80

/**
 * Hairline-bordered image block, no heavy shadow/blur — the "de-weighted" replacement
 * for a per-item glass card. `sizePx` sets a fixed square-ish width; pass `sx.width` to
 * override for full-bleed or differently-shaped callers.
 */
export const Thumb = ({ className, sizePx = null, sx, url }) => (
  <Box
    aria-hidden
    className={className}
    sx={{
      width: sizePx ? `${sizePx}px` : '100%',
      maxWidth: '100%',
      aspectRatio: '3 / 4',
      flexShrink: 0,
      bg: 'muted',
      ...(url ? { backgroundImage: `url(${url})` } : {}),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '11px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'muted',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      ...sx
    }}
  />
)

/** Outline "Read more" pill — replaces a filled CTA button so timeline/card rows stay lightweight. */
export const TimelineReadMoreLink = ({
  emphasis = false,
  href,
  readMoreAriaFallback,
  tid,
  title,
  variant = 'timeline'
}) => {
  const label = typeof title === 'string' && title.trim().length > 0 ? title.trim() : readMoreAriaFallback
  const featured = variant === 'featured'

  let readMoreMarginTop = ['0.6875rem', null, null, '0.75rem']
  if (featured) {
    readMoreMarginTop = ['1rem', null, null, '1.125rem']
  } else if (emphasis) {
    readMoreMarginTop = ['0.875rem', null, null, '0.8125rem']
  }

  return (
    <Box
      as={Link}
      aria-label={`Read full post: ${label}`}
      data-testid={tid('read-more-link')}
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'primary',
        borderRadius: '7px',
        borderStyle: 'solid',
        borderWidth: '1px',
        color: 'primary',
        display: 'inline-flex',
        fontFamily: 'body',
        fontSize: featured ? [1] : [0],
        fontWeight: 600,
        letterSpacing: featured ? '0.02em' : '0.06em',
        lineHeight: 1.25,
        mt: readMoreMarginTop,
        px: featured ? ['0.875rem', null, null, '1rem'] : ['0.625rem'],
        py: featured ? ['0.5rem', null, null, '0.5625rem'] : ['0.325rem'],
        textDecoration: 'none',
        textTransform: featured ? 'none' : 'uppercase',
        transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
        '&:hover': {
          bg: 'primary',
          color: 'background'
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary',
          outlineOffset: '3px'
        }
      }}
      to={href}
    >
      Read more
    </Box>
  )
}

Thumb.propTypes = {
  className: PropTypes.string,
  sizePx: PropTypes.number,
  sx: PropTypes.object,
  url: PropTypes.string
}

TimelineReadMoreLink.propTypes = {
  emphasis: PropTypes.bool,
  href: PropTypes.string.isRequired,
  readMoreAriaFallback: PropTypes.string.isRequired,
  tid: PropTypes.func.isRequired,
  title: nullableString,
  variant: PropTypes.oneOf(['timeline', 'featured'])
}
