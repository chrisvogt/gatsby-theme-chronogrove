/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Grid, Box, Text } from '@theme-ui/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCalendarAlt, faMusic, faMapMarkedAlt, faFileAlt, faNewspaper } from '@fortawesome/free-solid-svg-icons'

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
      <WidgetHeader aside={callToAction} icon={faNewspaper}>
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
                gridGap: [3, 3, 3, 4],
                gridTemplateColumns: [
                  '1fr',
                  '1fr',
                  '1fr',
                  `repeat(${getColumnCount(postsBySection.recaps.length)}, 1fr)`
                ]
              }}
            >
              {postsBySection.recaps.map(post => (
                <PostCard
                  key={post.fields.id}
                  category={post.fields.category}
                  date={post.frontmatter.date}
                  excerpt={post.frontmatter.excerpt}
                  link={post.fields.path}
                  thumbnails={post.frontmatter.thumbnails}
                  title={post.frontmatter.title}
                />
              ))}
            </Grid>
          </Box>
        )}

        {/* Single Post Sections - Order matches nav: Recaps, Posts, Music, Travel */}
        {(postsBySection.other || postsBySection.music || postsBySection.travel) && (
          <Box>
            {/* Posts */}
            {postsBySection.other && postsBySection.other.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <SectionHeader icon={faFileAlt} title='Posts' />
                <Grid
                  sx={{
                    display: 'grid',
                    gridAutoRows: '1fr',
                    gridGap: [2, 2, 3, 3],
                    gridTemplateColumns: ['1fr', '1fr', '1fr', 'repeat(2, 1fr)']
                  }}
                >
                  {postsBySection.other.map(post => (
                    <PostCard
                      key={post.fields.id}
                      category={post.fields.category}
                      date={post.frontmatter.date}
                      excerpt={post.frontmatter.excerpt}
                      link={post.fields.path}
                      title={post.frontmatter.title}
                      horizontal
                    />
                  ))}
                </Grid>
              </Box>
            )}

            {/* Music */}
            {postsBySection.music && postsBySection.music.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <SectionHeader icon={faMusic} title='Music' />
                <Grid
                  sx={{
                    display: 'grid',
                    gridGap: [2, 2, 3, 3],
                    gridTemplateColumns: ['1fr', '1fr', '1fr', 'repeat(2, 1fr)']
                  }}
                >
                  {postsBySection.music.map(post => (
                    <PostCard
                      key={post.fields.id}
                      category={post.fields.category}
                      date={post.frontmatter.date}
                      link={post.fields.path}
                      soundcloudId={post.frontmatter.soundcloudId}
                      title={post.frontmatter.title}
                      youtubeSrc={post.frontmatter.youtubeSrc}
                    />
                  ))}
                </Grid>
              </Box>
            )}

            {/* Travel */}
            {postsBySection.travel && postsBySection.travel.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <SectionHeader icon={faMapMarkedAlt} title='Travel' />
                <Grid
                  sx={{
                    display: 'grid',
                    gridAutoRows: '1fr',
                    gridGap: [2, 2, 3, 3],
                    gridTemplateColumns: ['1fr', '1fr', '1fr', 'repeat(2, 1fr)']
                  }}
                >
                  {postsBySection.travel.map(post => (
                    <PostCard
                      key={post.fields.id}
                      category={post.fields.category}
                      date={post.frontmatter.date}
                      link={post.fields.path}
                      thumbnails={post.frontmatter.thumbnails}
                      title={post.frontmatter.title}
                      horizontal
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
