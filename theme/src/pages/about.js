import React from 'react'
import { Container, Flex } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import Layout from '../components/layout'
import Seo from '../components/seo'

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
            Welcome to my personal website and digital space. This is where I share my thoughts, experiences, and
            creative work with the world.
          </Themed.p>

          <Themed.p>
            This site is built with Gatsby and powered by the Chronogrove theme, featuring a modern dashboard-style
            homepage with integrated widgets that showcase various aspects of my digital life and activities.
          </Themed.p>

          <Themed.p>
            Feel free to explore the different sections, check out my recent posts, and connect with me through the
            various social platforms linked throughout the site.
          </Themed.p>
        </Container>
      </Flex>
    </Layout>
  )
}

export const Head = () => <Seo title='About' />

export default AboutPage
