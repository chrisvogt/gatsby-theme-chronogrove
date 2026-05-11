import React from 'react'
import { Container, Flex } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import Layout from 'gatsby-theme-chronogrove/src/components/layout'
import Seo from 'gatsby-theme-chronogrove/src/components/seo'
import CareerPathCurve from '../../components/CareerPathCurve'

const AboutPage = () => {
  return (
    <Layout>
      <Flex
        sx={{
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
          py: 3
        }}
      >
        <Container sx={{ width: ['', '', 'max(80ch, 50vw)'], lineHeight: 1.7 }}>
          <Themed.h1>About</Themed.h1>

          <Themed.p>
            By day I'm a Principal Software Engineer at GoDaddy—there since 2017, on the Airo-Growth-Innovation (AGI)
            team. We ship intelligent customer dashboards, the recommendations surfaced across GoDaddy, and GoDaddy
            Airo™. Off the clock I keep this site: experiments, long posts, and tooling I build because the problem
            interests me, not because it was assigned.
          </Themed.p>

          <Themed.p>
            Most evenings I'm at the piano—practicing, recording, or messing with arrangements. I am self-taught on the
            instrument and borrow habits from engineering—tight feedback loops, versioning my own practice notes—where
            they help. Weekends skew social: friends across San Francisco who care a lot about what they make, whether
            that is code, music, or neither.
          </Themed.p>

          <Themed.h2 sx={{ mt: 5 }}>Career journey</Themed.h2>

          <Themed.p>
            Retail print and design first in Arizona (OfficeMax, FedEx Kinko's), then freelance creative work, then IT
            contracts, Apogee Physicians, Encore Discovery Solutions—then a deliberate turn into software engineering
            through web and front-end roles until GoDaddy brought me on in 2017. The SVG curve is that path in order,
            without the usual résumé flattening.
          </Themed.p>
        </Container>

        <CareerPathCurve />
      </Flex>
    </Layout>
  )
}

export const Head = () => <Seo canonicalPath='/about/' title='About' />

export default AboutPage
