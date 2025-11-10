/** @jsx jsx */
import { jsx, Container, Grid, useColorMode } from 'theme-ui'
import { graphql } from 'gatsby'
import { Fragment, useMemo } from 'react'
import { SkipNavContent } from '@reach/skip-nav'

import Footer from '../components/footer'
import HCard from '../components/h-card.js'
import HomeHeaderContent from '../components/home-header-content'
import HomeNavigation from '../components/home-navigation.js'
import HomeWidgets from '../components/home-widgets'
import Layout from '../components/layout'
import HomeHead from './home-head'
import PrismaticBurst from '../components/home-backgrounds/prismatic-burst'
import ColorBends from '../components/home-backgrounds/color-bends'

// Constants to prevent recreating props on every render
const PRISMATIC_COLORS = ['#9B4F96', '#7B68EE', '#48C9B0', '#F39C12', '#9B4F96']
// Based on Starry Banner SVG colors: purple #800080 and gold #FFD700
const COLOR_BENDS_COLORS = ['#800080', '#6B2F6B', '#FFD700', '#A855A8']
const COLOR_BENDS_STYLE = { width: '100%', height: '100%' }

const HomeTemplate = () => {
  const [colorMode] = useColorMode()
  const isDark = colorMode === 'dark'

  // Memoize the background component so it only changes when color mode changes
  const backgroundAnimation = useMemo(
    () =>
      isDark ? (
        <ColorBends
          colors={COLOR_BENDS_COLORS}
          rotation={30}
          speed={0.1}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={1}
          noise={0.1}
          transparent
          style={COLOR_BENDS_STYLE}
        />
      ) : (
        <PrismaticBurst colors={PRISMATIC_COLORS} speed={0.3} blur={100} />
      ),
    [isDark]
  )

  return (
    <Fragment>
      <div
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          zIndex: 0,
          overflow: 'hidden',
          opacity: isDark ? 0.12 : 0.7,
          pointerEvents: 'none',
          backgroundColor: isDark ? '#14141F' : '#fdf8f5'
        }}
        aria-hidden='true'
      >
        {backgroundAnimation}
      </div>
      {/* Gradient overlay to protect header content */}
      <div
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 'min(112.5vh, 1500px)',
          zIndex: 0.5,
          pointerEvents: 'none',
          background: isDark
            ? 'linear-gradient(to bottom, #14141F 0%, #14141F 30%, rgba(20, 20, 31, 0.8) 60%, transparent 100%)'
            : 'linear-gradient(to bottom, #fdf8f5 0%, #fdf8f5 30%, rgba(253, 248, 245, 0.8) 60%, transparent 100%)'
        }}
        aria-hidden='true'
      />
      <div
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        <Layout hideFooter disableMainWrapper transparentBackground>
          <div
            sx={{
              minHeight: '500px',
              pt: 3,
              px: 0
            }}
          >
            <Container>
              <Grid
                columns={[
                  null,
                  null,
                  'minmax(200px, 0.375fr) minmax(0, 1.625fr)' /* Sidebar min 200px, Content flexible */,
                  'minmax(200px, 0.4fr) minmax(0, 1.6fr)' /* Sidebar min 200px, Content flexible */
                ]}
                gap={[null, 4]}
              >
                <aside sx={{ mb: [4, null] }}>
                  <HomeNavigation />
                </aside>
                <main role='main'>
                  <SkipNavContent />
                  <div
                    sx={{
                      position: 'relative',
                      borderTopRightRadius: '3em',
                      borderTopLeftRadius: '.5em',
                      px: [3, 4],
                      pt: [2, 3]
                    }}
                  >
                    <div
                      sx={{
                        maxWidth: '1200px'
                      }}
                    >
                      <section>
                        <HomeHeaderContent />
                      </section>
                      <HomeWidgets />
                    </div>
                  </div>
                  <Footer />
                  <HCard />
                </main>
              </Grid>
            </Container>
          </div>
        </Layout>
      </div>
    </Fragment>
  )
}

export const Head = () => <HomeHead />

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        avatarURL
        description
        headline
        subhead
        title
        titleTemplate
      }
    }
  }
`

export default HomeTemplate
