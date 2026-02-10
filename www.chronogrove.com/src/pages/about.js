import React from 'react'
import { Container, Flex } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import Layout from 'gatsby-theme-chronogrove/src/components/layout'
import Seo from 'gatsby-theme-chronogrove/src/components/seo'

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
          <Themed.h1>About Chronogrove</Themed.h1>

          <Themed.p>
            Chronogrove is a modern Gatsby theme designed for developers and creators who want to showcase their digital
            life through an interactive dashboard-style homepage. Built with React 18, Theme UI, and Redux Toolkit, it
            provides a comprehensive platform for personal websites and blogs.
          </Themed.p>

          <Themed.h2>Key Features</Themed.h2>

          <Themed.p>
            <strong>Dashboard Homepage:</strong> A sophisticated widget system that displays real-time data from various
            platforms including GitHub, Spotify, Goodreads, Instagram, Steam, and Flickr. Each widget is carefully
            designed with loading states, error handling, and responsive layouts.
          </Themed.p>

          <Themed.p>
            <strong>Content Management:</strong> Full MDX support for blog posts and pages, allowing you to embed React
            components directly in your content. Includes built-in shortcodes for YouTube, Spotify, SoundCloud, and
            more.
          </Themed.p>

          <Themed.p>
            <strong>Design System:</strong> Built on Theme UI with comprehensive dark/light mode support, responsive
            design patterns, and accessibility-first components. The theme is fully customizable while maintaining
            design consistency.
          </Themed.p>

          <Themed.h2>Technical Excellence</Themed.h2>

          <Themed.p>
            The theme follows modern React patterns with functional components, hooks, and comprehensive testing using
            Jest and React Testing Library. It includes performance optimizations like lazy loading, code splitting, and
            optimized image handling.
          </Themed.p>

          <Themed.p>
            Built as a monorepo with Yarn workspaces, Chronogrove separates theme code from content, making it easy to
            maintain and customize while keeping your personal data separate from the reusable theme components.
          </Themed.p>

          <Themed.h2>Getting Started</Themed.h2>

          <Themed.p>
            Check out the{' '}
            <Themed.a href='https://github.com/chrisvogt/gatsby-theme-chronogrove'>GitHub repository</Themed.a> for
            installation instructions, configuration options, and comprehensive documentation. The theme is designed to
            be developer-friendly with clear patterns and extensive customization options.
          </Themed.p>
        </Container>
      </Flex>
    </Layout>
  )
}

export const Head = () => <Seo title='About Chronogrove Theme' />

export default AboutPage
