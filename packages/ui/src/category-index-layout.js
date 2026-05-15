/**
 * Shared layout for category-style index pages (blog, travel, music, etc.)
 * under the animated hero background.
 */

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@theme-ui/components'

import AnimatedPageBackground from './animated-page-background/index.js'

/** Outer column flex (below site chrome): stacks header + content with consistent vertical rhythm. */
export const categoryIndexMainColumnFlexSx = {
  flexDirection: 'column',
  flexGrow: 1,
  position: 'relative',
  py: 3
}

/** `sx` for the post list `<section>` (matches Travel index spacing). */
export const categoryIndexPostListSectionSx = {
  display: 'grid',
  gridGap: [2, 2, 3, 3],
  gridTemplateColumns: '1fr',
  mt: 4
}

/** `sx` for the empty-state wrapper under the header. */
export const categoryIndexEmptyStateBoxSx = {
  textAlign: 'center',
  py: 6,
  mt: 4
}

/**
 * Animated gradient hero + elevated content layer (same stacking as Travel/Music/Blog indexes).
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.overlayHeight]
 */
export function CategoryIndexHeroChrome({ children, overlayHeight = 'min(75vh, 1000px)' }) {
  return (
    <Fragment>
      <AnimatedPageBackground overlayHeight={overlayHeight} />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </Box>
    </Fragment>
  )
}

CategoryIndexHeroChrome.propTypes = {
  children: PropTypes.node.isRequired,
  overlayHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
