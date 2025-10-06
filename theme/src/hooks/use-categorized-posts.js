import { useStaticQuery, graphql } from 'gatsby'

const useCategorizedPosts = () => {
  const queryResult = useStaticQuery(graphql`
    query CategorizedPosts {
      allMdx(sort: { frontmatter: { date: DESC } }) {
        edges {
          node {
            excerpt(pruneLength: 255)
            fields {
              category
              id
              slug
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
  `)

  const { allMdx: { edges = [] } = {} } = queryResult
  const allPosts = edges.map(({ node }) => node)

  // Helper function to check if a post is a recap
  const isRecapPost = post => {
    return (
      post.frontmatter.title?.toLowerCase().includes('recap') ||
      (post.fields.category === 'personal' && post.frontmatter.title?.toLowerCase().includes('recap'))
    )
  }

  // Helper function to check if a post is music-related
  const isMusicPost = post => {
    return post.fields.category?.startsWith('music') || post.fields.category === 'music'
  }

  // Helper function to check if a post is photography-related
  const isPhotographyPost = post => {
    return post.fields.category?.startsWith('photography')
  }

  // Helper function to check if a post is personal category
  const isPersonalPost = post => {
    return post.fields.category === 'personal'
  }

  // Get latest recaps (up to 2, including "now" page as the latest)
  const latestRecaps = allPosts.filter(post => isRecapPost(post)).slice(0, 2)

  // Get latest music posts (2 posts)
  const latestMusicPosts = allPosts.filter(post => isMusicPost(post)).slice(0, 2)

  // Get latest photography posts (2 posts)
  const latestPhotographyPosts = allPosts.filter(post => isPhotographyPost(post)).slice(0, 2)

  // Get latest non-personal posts (2 posts, excluding recaps, music, photography, and personal)
  const latestOtherPosts = allPosts
    .filter(
      post =>
        !isRecapPost(post) &&
        !isMusicPost(post) &&
        !isPhotographyPost(post) &&
        !isPersonalPost(post) &&
        post.frontmatter.slug !== 'now'
    )
    .slice(0, 2)

  // Create deduplicated list ensuring no post appears twice
  const deduplicatedPosts = []
  const usedPostIds = new Set()

  // Add recaps first
  latestRecaps.forEach(post => {
    if (!usedPostIds.has(post.fields.id)) {
      deduplicatedPosts.push({ ...post, section: 'recaps' })
      usedPostIds.add(post.fields.id)
    }
  })

  // Add music posts if not already included
  latestMusicPosts.forEach(post => {
    if (!usedPostIds.has(post.fields.id)) {
      deduplicatedPosts.push({ ...post, section: 'music' })
      usedPostIds.add(post.fields.id)
    }
  })

  // Add photography posts if not already included
  latestPhotographyPosts.forEach(post => {
    if (!usedPostIds.has(post.fields.id)) {
      deduplicatedPosts.push({ ...post, section: 'photography' })
      usedPostIds.add(post.fields.id)
    }
  })

  // Add other posts if not already included
  latestOtherPosts.forEach(post => {
    if (!usedPostIds.has(post.fields.id)) {
      deduplicatedPosts.push({ ...post, section: 'other' })
      usedPostIds.add(post.fields.id)
    }
  })

  return {
    posts: deduplicatedPosts,
    recaps: latestRecaps,
    music: latestMusicPosts,
    photography: latestPhotographyPosts,
    other: latestOtherPosts
  }
}

export default useCategorizedPosts
