/** @jsx jsx */
import { Container, jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Flex } from '@theme-ui/components'
import { Fragment } from 'react'
import { graphql } from 'gatsby'

import AnimatedPageBackground from '../../../theme/src/components/animated-page-background'
import { getPosts } from '../../../theme/src/hooks/use-recent-posts'
import Layout from '../../../theme/src/components/layout'
import PageHeader from '../../../theme/src/components/blog/page-header'
import PostCard from '../../../theme/src/components/widgets/recent-posts/post-card'
import Seo from '../../../theme/src/components/seo'

const MusicPage = ({ data }) => {
  const posts = getPosts(data)?.filter(post => post.fields.category?.startsWith('music'))
  return (
    <Fragment>
      <AnimatedPageBackground overlayHeight='min(75vh, 1000px)' />
      <div
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        <Layout transparentBackground>
          <Flex
            sx={{
              flexDirection: 'column',
              flexGrow: 1,
              position: 'relative',
              py: 3
            }}
          >
            <Container sx={{ flexGrow: 1, width: ['', '', 'max(95ch, 75vw)'] }}>
              <PageHeader>My Music</PageHeader>

              <Themed.div
                sx={{
                  display: 'grid',
                  gridGap: [3, 3, 4],
                  gridTemplateColumns: ['1fr', '1fr 1fr'],
                  mt: 4
                }}
              >
                {posts.map(post => (
                  <PostCard
                    category={post.fields.category}
                    date={post.frontmatter.date}
                    key={post.fields.id}
                    link={post.fields.path}
                    soundcloudId={post.frontmatter.soundcloudId}
                    title={post.frontmatter.title}
                    youtubeSrc={post.frontmatter.youtubeSrc}
                  />
                ))}
              </Themed.div>
            </Container>
          </Flex>
        </Layout>
      </div>
    </Fragment>
  )
}

export const Head = () => (
  <Seo
    title="Chris Vogt's Music - Original and Cover Songs"
    description="Explore Chris Vogt's collection of original songs and covers. Listen to unique tracks and discover the stories behind the music on chrisvogt.me."
  >
    <meta property='og:url' content='https://www.chrisvogt.me/music/' />
    <meta property='og:type' content='website' />
  </Seo>
)

export const pageQuery = graphql`
  query QueryMusicPosts {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          fields {
            category
            id
            path
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            description
            slug
            soundcloudId
            title
            youtubeSrc
          }
        }
      }
    }
  }
`

export default MusicPage
