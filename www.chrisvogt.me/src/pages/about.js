import React from 'react'
import { Container, Flex } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import Layout from 'gatsby-theme-chronogrove/src/components/layout'
import Seo from 'gatsby-theme-chronogrove/src/components/seo'
import CareerPathVisualization from '../../components/CareerPathVisualization'

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
          <Themed.h1>About Me</Themed.h1>

          <Themed.p>
            By day, I'm a Principal Software Engineer at GoDaddy. I've been there since 2017 — nearly nine years — and I
            work on the Airo-Growth-Innovation (AGI) team. We build intelligent customer dashboards, the recommendations
            you see across GoDaddy, and GoDaddy Airo™. This site isn't about work, though. It's where I follow my
            curiosity, experiment with ideas, and write code just for fun.
          </Themed.p>

          <Themed.p>
            Most evenings, you'll find me at the piano — practicing, recording, or just playing around with sound. I've
            been slowly teaching myself music, and I'm figuring out how to bring what I know from tech into making
            music. I also spend a lot of time with friends in the city and love connecting with people who are
            passionate about what they do.
          </Themed.p>

          <Themed.h2 sx={{ mt: 5 }}>Career Journey</Themed.h2>

          <Themed.p>
            The chart below shows how my career has actually played out: print and design first (OfficeMax, FedEx
            Kinko's, then creative and freelance work), then IT and systems (contract roles, then Apogee Physicians and
            Encore Discovery Solutions), and finally a shift into software engineering that led to web and front-end
            roles and, in 2017, to GoDaddy, where I've been ever since.
          </Themed.p>

          <Themed.p sx={{ fontSize: 1, color: 'textMuted', fontStyle: 'italic', mb: 4 }}>
            Click on any node below to learn more about that role or transition.
          </Themed.p>
        </Container>

        {/* Career visualization outside container for full width */}
        <CareerPathVisualization />
      </Flex>
    </Layout>
  )
}

export const Head = () => <Seo title='About Me' />

export default AboutPage
