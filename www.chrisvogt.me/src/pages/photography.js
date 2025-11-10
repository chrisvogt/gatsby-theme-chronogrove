/** @jsx jsx */
import { Container, jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Flex } from '@theme-ui/components'
import { graphql } from 'gatsby'

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

const PhotographyPage = ({ data }) => {
  const posts = getPosts(data)?.filter(post => post.fields.category?.startsWith('photography'))

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
        <Container sx={{ flexGrow: 1, width: ['', '', 'max(95ch, 75vw)'] }}>
          <PageHeader>My Photo Galleries</PageHeader>

          <Themed.p>
            These galleries are blog posts with photos and videos I've captured while traveling or at events.
          </Themed.p>

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
                banner={post.frontmatter.banner}
                category={post.fields.category}
                date={post.frontmatter.date}
                key={post.fields.id}
                link={post.fields.path}
                title={post.frontmatter.title}
              />
            ))}
          </Themed.div>
        </Container>
      </Flex>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Chris Vogt's Photo Galleries - Street & Travel Photography"
    description="Explore Chris Vogt's photo galleries featuring street and travel photography. Each gallery showcases unique perspectives and moments captured with a Sony Alpha camera on chrisvogt.me."
  >
    <meta property='og:url' content='https://www.chrisvogt.me/photography/' />
    <meta property='og:type' content='website' />
  </Seo>
)

export const pageQuery = graphql`
  query QueryRecentPosts {
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
            title
          }
        }
      }
    }
  }
`

export default PhotographyPage
