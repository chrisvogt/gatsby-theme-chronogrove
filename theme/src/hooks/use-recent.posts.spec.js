import { renderHook } from '@testing-library/react-hooks'
import { useStaticQuery } from 'gatsby'
import useRecentPosts, { getPosts } from './use-recent-posts'

const data = {
  allMdx: {
    edges: [
      {
        node: {
          excerpt: "One simple thing and you'll never believe what happened!",
          fields: {
            id: 'post-identifier',
            category: 'general',
            slug: 'a-blog-article'
          },
          frontmatter: {
            banner: 'https://placekitten.com/300/300',
            title: 'A Blog Article',
            slug: 'a-blog-article'
          }
        }
      },
      {
        node: {
          excerpt: 'Another interesting post!',
          fields: {
            id: 'post-identifier-2',
            category: 'general',
            slug: 'another-article'
          },
          frontmatter: {
            banner: 'https://placekitten.com/300/300',
            title: 'Another Article',
            slug: 'another-article'
          }
        }
      },
      {
        node: {
          excerpt: 'A now page post',
          fields: {
            id: 'now-post',
            category: 'general',
            slug: 'now'
          },
          frontmatter: {
            banner: 'https://placekitten.com/300/300',
            title: 'Now Page',
            slug: 'now'
          }
        }
      }
    ]
  }
}

jest.mock('gatsby')

describe('useRecentPosts', () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => data)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns the latest posts', () => {
    const { result } = renderHook(() => useRecentPosts())
    expect(result.current).toEqual([
      {
        ...data.allMdx.edges[0].node
      },
      {
        ...data.allMdx.edges[1].node
      },
      {
        ...data.allMdx.edges[2].node
      }
    ])
  })

  it('includes posts with slug "now"', () => {
    const { result } = renderHook(() => useRecentPosts())
    const nowPost = result.current.find(post => post.frontmatter.slug === 'now')
    expect(nowPost).toBeDefined()
    expect(nowPost.frontmatter.title).toBe('Now Page')
  })

  it('returns limited posts when limit is provided', () => {
    const { result } = renderHook(() => useRecentPosts(1))
    expect(result.current).toHaveLength(1)
    expect(result.current[0]).toEqual({
      ...data.allMdx.edges[0].node
    })
  })

  it('returns all posts when limit is null', () => {
    const { result } = renderHook(() => useRecentPosts(null))
    expect(result.current).toHaveLength(3) // Including the 'now' post
  })

  it('handles missing allMdx', () => {
    useStaticQuery.mockImplementation(() => ({}))
    const { result } = renderHook(() => useRecentPosts())
    expect(result.current).toEqual([])
  })

  it('handles missing edges', () => {
    useStaticQuery.mockImplementation(() => ({ allMdx: {} }))
    const { result } = renderHook(() => useRecentPosts())
    expect(result.current).toEqual([])
  })

  it('handles empty edges array', () => {
    useStaticQuery.mockImplementation(() => ({ allMdx: { edges: [] } }))
    const { result } = renderHook(() => useRecentPosts())
    expect(result.current).toEqual([])
  })
})

describe('getPosts', () => {
  it('returns all posts when no limit is provided', () => {
    const result = getPosts(data)
    expect(result).toHaveLength(3) // Including the 'now' post
    expect(result[0].frontmatter.slug).toBe('a-blog-article')
    expect(result[1].frontmatter.slug).toBe('another-article')
    expect(result[2].frontmatter.slug).toBe('now')
  })

  it('returns limited posts when limit is provided', () => {
    const result = getPosts(data, 1)
    expect(result).toHaveLength(1)
    expect(result[0].frontmatter.slug).toBe('a-blog-article')
  })

  it('includes posts with slug "now"', () => {
    const result = getPosts(data)
    const nowPost = result.find(post => post.frontmatter.slug === 'now')
    expect(nowPost).toBeDefined()
    expect(nowPost.frontmatter.title).toBe('Now Page')
  })

  it('handles empty query result', () => {
    const result = getPosts({})
    expect(result).toEqual([])
  })

  it('handles query result with no allMdx', () => {
    const result = getPosts({ someOtherData: [] })
    expect(result).toEqual([])
  })

  it('handles query result with no edges', () => {
    const result = getPosts({ allMdx: {} })
    expect(result).toEqual([])
  })

  it('handles query result with empty edges array', () => {
    const result = getPosts({ allMdx: { edges: [] } })
    expect(result).toEqual([])
  })
})
