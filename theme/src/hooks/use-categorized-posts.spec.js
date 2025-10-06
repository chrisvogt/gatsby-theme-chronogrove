import { useStaticQuery } from 'gatsby'
import useCategorizedPosts from './use-categorized-posts'

// Mock Gatsby's useStaticQuery and graphql
jest.mock('gatsby', () => ({
  useStaticQuery: jest.fn(),
  graphql: jest.fn()
}))

describe('useCategorizedPosts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockQueryResult = {
    allMdx: {
      edges: [
        {
          node: {
            frontmatter: {
              title: 'September 2025 Recap',
              slug: 'september-2025-recap',
              date: '2025-09-30',
              banner: 'banner1.jpg'
            },
            fields: {
              category: 'personal',
              id: '1',
              path: '/blog/september-2025-recap'
            }
          }
        },
        {
          node: {
            frontmatter: {
              title: 'July 2025 Recap',
              slug: 'july-2025-recap',
              date: '2025-07-31',
              banner: 'banner2.jpg'
            },
            fields: {
              category: 'personal',
              id: '2',
              path: '/blog/july-2025-recap'
            }
          }
        },
        {
          node: {
            frontmatter: {
              title: 'June 2025 Recap',
              slug: 'june-2025-recap',
              date: '2025-06-30',
              banner: 'banner3.jpg'
            },
            fields: {
              category: 'personal',
              id: '3',
              path: '/blog/june-2025-recap'
            }
          }
        },
        {
          node: {
            frontmatter: {
              title: 'Here and Now Piano Cover',
              slug: 'here-and-now',
              date: '2025-06-19',
              banner: 'banner4.jpg'
            },
            fields: {
              category: 'music/piano-covers',
              id: '4',
              path: '/music/here-and-now'
            }
          }
        },
        {
          node: {
            frontmatter: {
              title: 'Belize Travel Photos',
              slug: 'belize',
              date: '2024-07-06',
              banner: 'banner5.jpg'
            },
            fields: {
              category: 'photography/travel',
              id: '5',
              path: '/blog/belize'
            }
          }
        },
        {
          node: {
            frontmatter: {
              title: 'Evolution of My Blog',
              slug: 'evolution-blog',
              date: '2024-06-18',
              banner: 'banner6.jpg'
            },
            fields: {
              category: 'meta',
              id: '6',
              path: '/blog/evolution-blog'
            }
          }
        },
        {
          node: {
            frontmatter: {
              title: 'Now Page',
              slug: 'now',
              date: '2025-09-30',
              banner: 'banner7.jpg'
            },
            fields: {
              category: 'personal',
              id: '7',
              path: '/now'
            }
          }
        }
      ]
    }
  }

  it('returns categorized posts with deduplication', () => {
    useStaticQuery.mockReturnValue(mockQueryResult)

    const result = useCategorizedPosts()

    expect(result.recaps).toHaveLength(2)
    expect(result.recaps[0].frontmatter.title).toBe('September 2025 Recap')
    expect(result.recaps[1].frontmatter.title).toBe('July 2025 Recap')

    expect(result.music).toHaveLength(1)
    expect(result.music[0].frontmatter.title).toBe('Here and Now Piano Cover')

    expect(result.photography).toHaveLength(1)
    expect(result.photography[0].frontmatter.title).toBe('Belize Travel Photos')

    expect(result.other).toHaveLength(1)
    expect(result.other[0].frontmatter.title).toBe('Evolution of My Blog')

    // Check that posts array contains deduplicated posts
    expect(result.posts).toHaveLength(5) // 2 recaps + 1 music + 1 photography + 1 other
    expect(result.posts.every(post => post.section)).toBe(true)
  })

  it('excludes Now page from recaps', () => {
    useStaticQuery.mockReturnValue(mockQueryResult)

    const result = useCategorizedPosts()

    // Now page should not be in recaps
    expect(result.recaps.every(post => post.frontmatter.slug !== 'now')).toBe(true)
  })

  it('handles empty query result', () => {
    useStaticQuery.mockReturnValue({ allMdx: { edges: [] } })

    const result = useCategorizedPosts()

    expect(result.recaps).toHaveLength(0)
    expect(result.music).toHaveLength(0)
    expect(result.photography).toHaveLength(0)
    expect(result.other).toHaveLength(0)
    expect(result.posts).toHaveLength(0)
  })

  it('handles missing query result', () => {
    useStaticQuery.mockReturnValue({})

    const result = useCategorizedPosts()

    expect(result.recaps).toHaveLength(0)
    expect(result.music).toHaveLength(0)
    expect(result.photography).toHaveLength(0)
    expect(result.other).toHaveLength(0)
    expect(result.posts).toHaveLength(0)
  })

  it('correctly identifies recap posts', () => {
    const mockData = {
      allMdx: {
        edges: [
          {
            node: {
              frontmatter: {
                title: 'Monthly Recap',
                slug: 'monthly-recap',
                date: '2025-01-01',
                banner: 'banner.jpg'
              },
              fields: {
                category: 'personal',
                id: '1',
                path: '/blog/monthly-recap'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Regular Blog Post',
                slug: 'regular-post',
                date: '2025-01-02',
                banner: 'banner2.jpg'
              },
              fields: {
                category: 'personal',
                id: '2',
                path: '/blog/regular-post'
              }
            }
          }
        ]
      }
    }

    useStaticQuery.mockReturnValue(mockData)

    const result = useCategorizedPosts()

    expect(result.recaps).toHaveLength(1)
    expect(result.recaps[0].frontmatter.title).toBe('Monthly Recap')
  })

  it('correctly identifies music posts', () => {
    const mockData = {
      allMdx: {
        edges: [
          {
            node: {
              frontmatter: {
                title: 'Piano Practice',
                slug: 'piano-practice',
                date: '2025-01-01',
                banner: 'banner.jpg'
              },
              fields: {
                category: 'music',
                id: '1',
                path: '/music/piano-practice'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Piano Covers',
                slug: 'piano-covers',
                date: '2025-01-02',
                banner: 'banner2.jpg'
              },
              fields: {
                category: 'music/piano-covers',
                id: '2',
                path: '/music/piano-covers'
              }
            }
          }
        ]
      }
    }

    useStaticQuery.mockReturnValue(mockData)

    const result = useCategorizedPosts()

    expect(result.music).toHaveLength(2)
    expect(result.music[0].frontmatter.title).toBe('Piano Practice')
    expect(result.music[1].frontmatter.title).toBe('Piano Covers')
  })

  it('correctly identifies photography posts', () => {
    const mockData = {
      allMdx: {
        edges: [
          {
            node: {
              frontmatter: {
                title: 'Travel Photos',
                slug: 'travel-photos',
                date: '2025-01-01',
                banner: 'banner.jpg'
              },
              fields: {
                category: 'photography/travel',
                id: '1',
                path: '/blog/travel-photos'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Event Photos',
                slug: 'event-photos',
                date: '2025-01-02',
                banner: 'banner2.jpg'
              },
              fields: {
                category: 'photography/events',
                id: '2',
                path: '/blog/event-photos'
              }
            }
          }
        ]
      }
    }

    useStaticQuery.mockReturnValue(mockData)

    const result = useCategorizedPosts()

    expect(result.photography).toHaveLength(2)
    expect(result.photography[0].frontmatter.title).toBe('Travel Photos')
    expect(result.photography[1].frontmatter.title).toBe('Event Photos')
  })
})
