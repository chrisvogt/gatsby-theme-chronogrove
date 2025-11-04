/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useSelector } from 'react-redux'
import React from 'react'
import { SkipNavLink, SkipNavContent } from '@reach/skip-nav'

import Footer from './footer'
import TopNavigation from './top-navigation'

/**
 * Layout
 *
 * The default layout component. Wrap all templates in this layout to inherit
 * the default navigation, theme styles, and any important providers. Use shadowing
 * to extend this component and attach additional contexts and providers.
 */
const Layout = ({ children, disableMainWrapper, hideHeader, hideFooter }) => {
  const { isVisible } = useSelector(state => state.audioPlayer)

  return (
    <div
      sx={{
        backgroundColor: 'background',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        color: theme => theme?.colors?.text,
        // Add padding when audio player is visible
        // 100px for player height + 24px (padding) + 16px (extra space)
        pb: isVisible ? '140px' : 0
      }}
    >
      <SkipNavLink />

      {/* NOTE(chrisvogt): hide the top navigation on the home and 404 pages */}
      {!hideHeader && (
        <header role='banner'>
          <TopNavigation />
        </header>
      )}

      {disableMainWrapper ? (
        children
      ) : (
        <main role='main'>
          <SkipNavContent />
          {children}
        </main>
      )}

      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout
