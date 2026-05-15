import React from 'react'
import PropTypes from 'prop-types'
import { Box, Grid } from '@theme-ui/components'

/** Theme UI `Grid` `columns` for the home dashboard: single column until `md`, then sidebar + main. */
export const homeDashboardGridColumns = [
  null,
  null,
  'minmax(200px, 0.375fr) minmax(0, 1.625fr)',
  'minmax(200px, 0.4fr) minmax(0, 1.6fr)'
]

export const homeDashboardGridGap = [null, 4]

/** Default aside spacing; merge with site-specific `sx` (e.g. sticky side nav in demos). */
export const homeDashboardAsideSx = {
  mb: [4, null]
}

/** Rounded “glass” panel shell around the main home column (matches gatsby-theme-chronogrove home). */
export const homeDashboardMainShellSx = {
  position: 'relative',
  borderTopRightRadius: '3em',
  borderTopLeftRadius: '.5em',
  px: [3, 4],
  pt: [2, 3]
}

export const homeDashboardMainInnerMaxWidthSx = {
  maxWidth: '1200px'
}

/** Outer stack below the page chrome on the home template (`minHeight`, top padding). */
export const homeDashboardPageOuterSx = {
  minHeight: '500px',
  pt: 3,
  px: 0
}

/**
 * Two-column home dashboard grid (sidebar + main). Pass full `main` node so callers can set
 * `role="main"`, skip-nav targets, footer, and microformats in one place.
 *
 * @param {object} props
 * @param {React.ReactNode} props.aside
 * @param {React.ReactNode} props.main
 * @param {import('theme-ui').ThemeUIStyleObject} [props.asideSx] merged after {@link homeDashboardAsideSx}
 * @param {React.ComponentProps<typeof Grid>} [props.gridProps] forwarded to `Grid`
 */
export function HomeDashboardGrid({ aside, main, asideSx = {}, gridProps = {}, ...gridRest }) {
  return (
    <Grid columns={homeDashboardGridColumns} gap={homeDashboardGridGap} {...gridProps} {...gridRest}>
      <Box as='aside' sx={{ ...homeDashboardAsideSx, ...asideSx }}>
        {aside}
      </Box>
      {main}
    </Grid>
  )
}

HomeDashboardGrid.propTypes = {
  aside: PropTypes.node.isRequired,
  main: PropTypes.node.isRequired,
  asideSx: PropTypes.object,
  gridProps: PropTypes.object
}
