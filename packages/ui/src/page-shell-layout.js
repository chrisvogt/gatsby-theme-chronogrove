import React from 'react'
import { Box } from '@theme-ui/components'

import { SkipNavContent, SkipNavLink } from './skip-nav/index.js'

/**
 * Default page chrome: skip link, optional header and footer slots, and a main landmark (unless disabled).
 * Wire Gatsby-specific nav/footer and Zustand-driven `paddingBottom` from the site package.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.disableMainWrapper]
 * @param {boolean} [props.hideHeader] when true, `header` is not rendered
 * @param {boolean} [props.hideFooter] when true, `footer` is not rendered
 * @param {boolean} [props.transparentBackground]
 * @param {number|string} [props.paddingBottom] bottom padding (e.g. room for a fixed audio bar)
 * @param {React.ReactNode} [props.header] placed inside `<header role="banner">` when not hidden
 * @param {React.ReactNode} [props.footer]
 */
export function ChronogrovePageShell({
  children,
  disableMainWrapper = false,
  hideHeader = false,
  hideFooter = false,
  transparentBackground = false,
  paddingBottom = 0,
  header = null,
  footer = null
}) {
  return (
    <Box
      sx={{
        backgroundColor: transparentBackground ? 'transparent' : 'background',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        color: theme => theme?.colors?.text,
        pb: paddingBottom
      }}
    >
      <SkipNavLink />

      {!hideHeader && header ? <header role='banner'>{header}</header> : null}

      {disableMainWrapper ? (
        children
      ) : (
        <Box as='main'>
          <SkipNavContent />
          {children}
        </Box>
      )}

      {!hideFooter && footer ? footer : null}
    </Box>
  )
}
