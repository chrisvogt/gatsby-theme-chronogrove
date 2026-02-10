/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Bars } from 'svg-loaders-react'
import { Link } from 'gatsby'
import { trackEvent, trackExternalLink, trackNavigation } from '../../utils/analytics'

/**
 * Call To Action
 *
 * Each widget contains a call to action next to its headline. Can optionally render
 * a loading indicator when `isLoading` is set.
 */
const CallToAction = ({ children, isLoading = false, title, to, url, widgetName }) => {
  const LinkComponent = to ? Link : Themed.a

  const handleClick = () => {
    if (to) {
      // Internal navigation (Gatsby Link)
      trackNavigation(to, widgetName ? `${widgetName}_widget_cta` : 'widget_cta')
    } else if (url) {
      // External link
      trackExternalLink(url, title || children?.toString() || url)
    }

    // Also track as a generic CTA click
    trackEvent('cta_click', {
      category: 'Widget',
      label: widgetName || 'unknown',
      customParams: {
        widget_name: widgetName,
        cta_text: children?.toString(),
        destination: to || url,
        link_type: to ? 'internal' : 'external'
      }
    })
  }
  return isLoading ? (
    <Bars fill='#1E90FF' width='24' height='24' sx={{ verticalAlign: 'middle' }} />
  ) : (
    <LinkComponent
      href={url}
      onClick={handleClick}
      sx={{
        variant: 'styles.a',
        fontSize: 1,
        fontFamily: 'heading',
        lineHeight: '1.25', // synced with widget header
        verticalAlign: 'bottom',
        '.read-more-icon': {
          opacity: 0,
          transition: 'all .3s ease'
        },
        '&:hover, &:focus': {
          textDecoration: 'none',
          transform: 'translateX(150px)'
        },
        '&:hover .read-more-icon, &:focus .read-more-icon': {
          opacity: 1,
          ml: 2
        }
      }}
      title={title}
      to={to}
    >
      {children}
    </LinkComponent>
  )
}

export default CallToAction
