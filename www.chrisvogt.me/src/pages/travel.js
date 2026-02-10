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

const getColumnCount = postsCount => {
  let columnCount
  switch (postsCount) {
    case 1:
      columnCount = 1
      break
    case 2:
      columnCount = 2
      break
    default:
      columnCount = 3
  }
  return columnCount
}

const TravelPage = ({ data }) => {
  const posts =
    getPosts(data)?.filter(post => post.fields.category === 'travel' || post.fields.category?.startsWith('travel/')) ||
    []

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
              <PageHeader>Travel</PageHeader>

              <Themed.p>Narrative posts and photo galleries from trips and destinations.</Themed.p>

              <Themed.div
                sx={{
                  display: 'grid',
                  gridAutoRows: '1fr',
                  gridGap: [3, 3, 4],
                  gridTemplateColumns: [
                    '',
                    '1fr 1fr',
                    '1fr 1fr',
                    '1fr 1fr',
                    `repeat(${getColumnCount(posts.length)}, 1fr)`
                  ],
                  mt: 4
                }}
              >
                {posts.map(post => (
                  <PostCard
                    category={post.fields.category}
                    date={post.frontmatter.date}
                    key={post.fields.id}
                    link={post.fields.path}
                    thumbnails={post.frontmatter.thumbnails}
                    title={post.frontmatter.title}
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
    title='Travel — Chris Vogt'
    description='Travel posts and photo galleries from trips and destinations. Narrative stories and photos from Belize, Alaska, the Caribbean, and more.'
  >
    <meta property='og:url' content='https://www.chrisvogt.me/travel/' />
    <meta property='og:type' content='website' />
  </Seo>
)

export const pageQuery = graphql`
  query TravelPagePosts {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          fields {
            category
            id
            path
          }
          frontmatter {
            banner
            date(formatString: "MMMM DD, YYYY")
            description
            slug
            thumbnails
            title
          }
        }
      }
    }
  }
`

export default TravelPage
