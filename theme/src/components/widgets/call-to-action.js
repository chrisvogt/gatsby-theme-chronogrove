/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Bars } from 'svg-loaders-react'
import { Link } from 'gatsby'

/**
 * Call To Action
 *
 * Each widget contains a call to action next to its headline. Styled as plain text
 * on the page (color: text) for good contrast; reads as a link on hover. Can optionally
 * render a loading indicator when `isLoading` is set.
 */
const CallToAction = ({ children, isLoading = false, title, to, url }) => {
  const LinkComponent = to ? Link : Themed.a
  return isLoading ? (
    <Bars fill='#1E90FF' width='24' height='24' sx={{ verticalAlign: 'middle' }} />
  ) : (
    <LinkComponent
      href={url}
      sx={{
        variant: 'links.widgetCta',
        '.read-more-icon': {
          opacity: 0,
          transition: 'all .3s ease',
          ml: 1
        },
        '&:hover .read-more-icon, &:focus .read-more-icon': {
          opacity: 1
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
