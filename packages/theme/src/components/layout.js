/** @jsx jsx */
import { jsx } from 'theme-ui'
import { ChronogrovePageShell } from '@chronogrove/ui/page-shell-layout'
import { useAudioPlayerStore } from '../stores/audio-player-store'
import React from 'react'
import PropTypes from 'prop-types'

import Footer from './footer'
import TopNavigation from './top-navigation'

/**
 * Layout
 *
 * The default layout component. Wrap all templates in this layout to inherit
 * the default navigation, theme styles, and any important providers. Use shadowing
 * to extend this component and attach additional contexts and providers.
 */
const Layout = ({ children, disableMainWrapper, hideHeader, hideFooter, transparentBackground }) => {
  const isVisible = useAudioPlayerStore(state => state.isVisible)

  return (
    <ChronogrovePageShell
      disableMainWrapper={disableMainWrapper}
      hideFooter={hideFooter}
      hideHeader={hideHeader}
      transparentBackground={transparentBackground}
      paddingBottom={isVisible ? '140px' : 0}
      header={<TopNavigation />}
      footer={<Footer />}
    >
      {children}
    </ChronogrovePageShell>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  disableMainWrapper: PropTypes.bool,
  hideFooter: PropTypes.bool,
  hideHeader: PropTypes.bool,
  transparentBackground: PropTypes.bool
}

export default Layout
