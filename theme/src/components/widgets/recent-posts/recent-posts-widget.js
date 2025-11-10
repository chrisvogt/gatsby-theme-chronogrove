/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Grid, Box, Text } from '@theme-ui/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCalendarAlt, faMusic, faCamera, faFileAlt } from '@fortawesome/free-solid-svg-icons'

import useCategorizedPosts from '../../../hooks/use-categorized-posts'

import CallToAction from '../call-to-action'
import PostCard from './post-card'
import Widget from '../widget'
import WidgetHeader from '../widget-header'

const SectionHeader = ({ icon, title }) => (
  <Box sx={{ mb: 3 }}>
    <Text
      sx={{
        fontSize: 2,
        fontWeight: 'bold',
        color: 'text',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      <FontAwesomeIcon
        icon={icon}
        sx={{
          width: '20px',
          height: '20px'
        }}
      />
      {title}
    </Text>
  </Box>
)

export default () => {
  const { posts } = useCategorizedPosts()

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

  const callToAction = (
    <CallToAction title='Browse all published content' to='/blog'>
      Browse All
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  // Group posts by section for display
  const postsBySection = posts.reduce((acc, post) => {
    if (!acc[post.section]) {
      acc[post.section] = []
    }
    acc[post.section].push(post)
    return acc
  }, {})

  return (
    <Widget id='posts' styleOverrides={{ pt: 0 }}>
      <WidgetHeader aside={callToAction} icon='faNewspaper'>
        Latest Posts
      </WidgetHeader>

      <div sx={{ width: '100%', mt: 4 }}>
        {/* Latest Recaps Section */}
        {postsBySection.recaps && postsBySection.recaps.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <SectionHeader icon={faCalendarAlt} title='Recaps' />
            <Grid
              sx={{
                display: 'grid',
                gridGap: [3, 3, 4],
                gridTemplateColumns: ['', '', `repeat(${getColumnCount(postsBySection.recaps.length)}, 1fr)`]
              }}
            >
              {postsBySection.recaps.map(post => (
                <PostCard
                  banner={post.frontmatter.banner}
                  category={post.fields.category}
                  date={post.frontmatter.date}
                  excerpt={post.frontmatter.excerpt}
                  key={post.fields.id}
                  link={post.fields.path}
                  title={post.frontmatter.title}
                />
              ))}
            </Grid>
          </Box>
        )}

        {/* Single Post Sections - Stacked Vertically */}
        {(postsBySection.music || postsBySection.photography || postsBySection.other) && (
          <Box>
            {/* Latest Music Section */}
            {postsBySection.music && postsBySection.music.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <SectionHeader icon={faMusic} title='Music' />
                <Grid
                  sx={{
                    display: 'grid',
                    gridAutoRows: '1fr',
                    gridGap: [2, 2, 3],
                    gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)']
                  }}
                >
                  {postsBySection.music.map(post => (
                    <PostCard
                      banner={null}
                      category={post.fields.category}
                      date={post.frontmatter.date}
                      excerpt={post.frontmatter.excerpt}
                      key={post.fields.id}
                      link={post.fields.path}
                      title={post.frontmatter.title}
                      horizontal={true}
                    />
                  ))}
                </Grid>
              </Box>
            )}

            {/* Latest Photography Section */}
            {postsBySection.photography && postsBySection.photography.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <SectionHeader icon={faCamera} title='Photography' />
                <Grid
                  sx={{
                    display: 'grid',
                    gridAutoRows: '1fr',
                    gridGap: [2, 2, 3],
                    gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)']
                  }}
                >
                  {postsBySection.photography.map(post => (
                    <PostCard
                      banner={null}
                      category={post.fields.category}
                      date={post.frontmatter.date}
                      excerpt={post.frontmatter.excerpt}
                      key={post.fields.id}
                      link={post.fields.path}
                      title={post.frontmatter.title}
                      horizontal={true}
                    />
                  ))}
                </Grid>
              </Box>
            )}

            {/* Latest Other Section */}
            {postsBySection.other && postsBySection.other.length > 0 && (
              <Box>
                <SectionHeader icon={faFileAlt} title='Posts' />
                <Grid
                  sx={{
                    display: 'grid',
                    gridAutoRows: '1fr',
                    gridGap: [2, 2, 3],
                    gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)']
                  }}
                >
                  {postsBySection.other.map(post => (
                    <PostCard
                      banner={null}
                      category={post.fields.category}
                      date={post.frontmatter.date}
                      excerpt={post.frontmatter.excerpt}
                      key={post.fields.id}
                      link={post.fields.path}
                      title={post.frontmatter.title}
                      horizontal={true}
                    />
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </div>
    </Widget>
  )
}
