/** @jsx jsx */
import { jsx, Container } from 'theme-ui'
import { graphql } from 'gatsby'
import { Fragment } from 'react'
import { SkipNavContent } from '../components/skip-nav'
import {
  HomeDashboardGrid,
  homeDashboardMainInnerMaxWidthSx,
  homeDashboardMainShellSx,
  homeDashboardPageOuterSx
} from '@chronogrove/ui/home-dashboard-layout'

import AnimatedPageBackground from '../components/animated-page-background'
import Footer from '../components/footer'
import HCard from '../components/h-card.js'
import HomeHeaderContent from '../components/home-header-content'
import HomeNavigation from '../components/home-navigation.js'
import HomeWidgets from '../components/home-widgets'
import Layout from '../components/layout'
import ScrollToHashWhenReady from '../components/scroll-to-hash-when-ready'
import HomeHead from './home-head'

const HomeTemplate = () => {
  return (
    <Fragment>
      <ScrollToHashWhenReady />
      <AnimatedPageBackground />
      <div
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        <Layout hideFooter disableMainWrapper transparentBackground>
          <div sx={homeDashboardPageOuterSx}>
            <Container>
              <HomeDashboardGrid
                aside={<HomeNavigation />}
                main={
                  <main role='main'>
                    <SkipNavContent />
                    <div sx={homeDashboardMainShellSx}>
                      <div sx={homeDashboardMainInnerMaxWidthSx}>
                        <section id='top'>
                          <HomeHeaderContent />
                        </section>
                        <HomeWidgets />
                      </div>
                    </div>
                    <Footer />
                    <HCard />
                  </main>
                }
              />
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
