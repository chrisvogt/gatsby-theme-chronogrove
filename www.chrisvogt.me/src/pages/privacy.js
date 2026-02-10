import React from 'react'
import { Container, Flex, Link } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import Layout from 'gatsby-theme-chronogrove/src/components/layout'
import Seo from 'gatsby-theme-chronogrove/src/components/seo'

const PrivacyPolicy = () => {
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
          <Themed.h1>Privacy Policy</Themed.h1>

          <Themed.p>
            Welcome to my personal website, <b>www.chrisvogt.me</b>. This Privacy Policy explains how I collect, use,
            and share information about you when you visit my website.
          </Themed.p>

          <Themed.h2>Information Collected</Themed.h2>

          <Themed.h2>Google Analytics</Themed.h2>

          <Themed.p>
            I use Google Analytics to track page views, impressions, and interactions. This data helps me understand how
            visitors use my site and improve its layout and content. The information I collect includes:
          </Themed.p>

          <Themed.ul>
            <Themed.li>How visitors find my site.</Themed.li>
            <Themed.li>How visitors navigate and use my site.</Themed.li>
            <Themed.li>Whether visitors return to my site.</Themed.li>
            <Themed.li>What content visitors engage with.</Themed.li>
          </Themed.ul>

          <Themed.p>
            Please review{' '}
            <Link href='https://policies.google.com/privacy' title='Google Privacy & Terms'>
              Google Privacy & Terms
            </Link>{' '}
            for more details on how Google Analytics collects and processes data.
          </Themed.p>

          <Themed.h2>New Relic</Themed.h2>

          <Themed.p>
            I use New Relic for both browser tracking and Application Performance Management (APM). This data helps me
            measure the performance of my site and the services it depends on.
          </Themed.p>

          <Themed.h2>Data Usage</Themed.h2>

          <Themed.p>
            The data collected through Google Analytics is used solely for personal purposes to improve the user
            experience on my website. I do not share this data with third parties for marketing or advertising purposes.
          </Themed.p>

          <Themed.p>
            <em>Last updated July 29, 2024</em>
          </Themed.p>
        </Container>
      </Flex>
    </Layout>
  )
}

export const Head = () => <Seo title='Privacy Policy' />

export default PrivacyPolicy
