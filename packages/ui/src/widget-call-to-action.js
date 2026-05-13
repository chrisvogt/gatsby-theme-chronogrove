import React from 'react'
import { Box } from '@theme-ui/components'

/**
 * Default loading indicator for widget CTAs (SVG spinner, no extra dependencies).
 */
export const WidgetCtaLoadingIndicator = () => (
  <Box as='output' aria-live='polite' aria-busy='true' sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <Box
      as='svg'
      aria-label='Loading'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      sx={{
        display: 'block',
        color: 'primary',
        animation: 'spin 0.8s linear infinite',
        '@keyframes spin': { to: { transform: 'rotate(360deg)' } }
      }}
    >
      <circle
        cx='12'
        cy='12'
        r='10'
        fill='none'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
        strokeDasharray='31.4 31.4'
      />
    </Box>
  </Box>
)

const linkSxBase = {
  variant: 'links.widgetCta',
  '.read-more-icon': {
    opacity: 0,
    transition: 'all .3s ease',
    ml: 1
  },
  '&:hover .read-more-icon, &:focus .read-more-icon': {
    opacity: 1
  }
}

/**
 * Text-style CTA used next to widget headlines. Pass `linkComponent` (e.g. Gatsby `Link` with `to`, or Next `Link` with `href`).
 * External links: set `href` or `url` (no `linkComponent`).
 */
export const WidgetCallToAction = ({
  children,
  isLoading = false,
  loadingSlot,
  title,
  to,
  url,
  href,
  linkComponent,
  sx: sxProp,
  ...rest
}) => {
  const ctaSx = { ...linkSxBase, ...sxProp }

  if (isLoading) {
    return loadingSlot ?? <WidgetCtaLoadingIndicator />
  }

  if (linkComponent) {
    const L = linkComponent
    // Theme UI `sx` only applies when the outer node is a Theme UI `Box` (or other `sx`-aware
    // primitive). Router links (Next.js `Link`, Gatsby `Link`) do not accept `sx` themselves.
    if (href != null && href !== '') {
      return (
        <Box as={L} href={href} sx={ctaSx} title={title} {...rest}>
          {children}
        </Box>
      )
    }
    if (to) {
      return (
        <Box as={L} to={to} sx={ctaSx} title={title} {...rest}>
          {children}
        </Box>
      )
    }
  }

  if (to) {
    return (
      <Box as='a' href={to} sx={ctaSx} title={title} {...rest}>
        {children}
      </Box>
    )
  }

  const externalHref = href ?? url

  return (
    <Box as='a' href={externalHref} sx={ctaSx} title={title} {...rest}>
      {children}
    </Box>
  )
}

export default WidgetCallToAction
