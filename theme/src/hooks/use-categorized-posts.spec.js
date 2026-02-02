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

  it('handles deduplication when posts appear in multiple categories', () => {
    const mockData = {
      allMdx: {
        edges: [
          {
            node: {
              frontmatter: {
                title: 'Music Post',
                slug: 'music-post',
                date: '2025-01-01',
                banner: 'banner1.jpg'
              },
              fields: {
                category: 'music',
                id: '1',
                path: '/music/music-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Photography Post',
                slug: 'photo-post',
                date: '2025-01-02',
                banner: 'banner2.jpg'
              },
              fields: {
                category: 'photography',
                id: '2',
                path: '/blog/photo-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Tech Post',
                slug: 'tech-post',
                date: '2025-01-03',
                banner: 'banner3.jpg'
              },
              fields: {
                category: 'tech',
                id: '3',
                path: '/blog/tech-post'
              }
            }
          }
        ]
      }
    }

    useStaticQuery.mockReturnValue(mockData)

    const result = useCategorizedPosts()

    // Verify deduplication works - posts should only appear once in the posts array
    expect(result.posts).toHaveLength(3)

    // Check that each post has a section assigned
    expect(result.posts.every(post => post.section)).toBe(true)

    // Verify no duplicate IDs in the posts array
    const postIds = result.posts.map(post => post.fields.id)
    const uniqueIds = new Set(postIds)
    expect(postIds).toHaveLength(uniqueIds.size)
  })

  it('handles true deduplication when same post ID appears in multiple categories', () => {
    const mockData = {
      allMdx: {
        edges: [
          {
            node: {
              frontmatter: {
                title: 'Music Post',
                slug: 'music-post',
                date: '2025-01-01',
                banner: 'banner1.jpg'
              },
              fields: {
                category: 'music',
                id: '1',
                path: '/music/music-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Another Music Post',
                slug: 'another-music-post',
                date: '2025-01-02',
                banner: 'banner2.jpg'
              },
              fields: {
                category: 'music',
                id: '1', // Same ID as first post - this should trigger deduplication
                path: '/music/another-music-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Photography Post',
                slug: 'photo-post',
                date: '2025-01-03',
                banner: 'banner3.jpg'
              },
              fields: {
                category: 'photography',
                id: '2',
                path: '/blog/photo-post'
              }
            }
          }
        ]
      }
    }

    useStaticQuery.mockReturnValue(mockData)

    const result = useCategorizedPosts()

    // Verify that deduplication works - only 2 unique posts should be in the array
    expect(result.posts).toHaveLength(2)

    // Verify sections are assigned correctly
    expect(result.posts[0].section).toBe('music')
    expect(result.posts[1].section).toBe('photography')

    // Verify no duplicate IDs
    const postIds = result.posts.map(post => post.fields.id)
    const uniqueIds = new Set(postIds)
    expect(postIds).toHaveLength(uniqueIds.size)
  })

  it('handles edge case where post would be duplicated across categories', () => {
    const mockData = {
      allMdx: {
        edges: [
          {
            node: {
              frontmatter: {
                title: 'Duplicate Test Post',
                slug: 'duplicate-test',
                date: '2025-01-01',
                banner: 'banner1.jpg'
              },
              fields: {
                category: 'music',
                id: '1',
                path: '/music/duplicate-test'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Another Post',
                slug: 'another-post',
                date: '2025-01-02',
                banner: 'banner2.jpg'
              },
              fields: {
                category: 'photography',
                id: '2',
                path: '/blog/another-post'
              }
            }
          }
        ]
      }
    }

    useStaticQuery.mockReturnValue(mockData)

    const result = useCategorizedPosts()

    // Verify that posts are properly deduplicated
    expect(result.posts).toHaveLength(2)
    expect(result.posts[0].fields.id).toBe('1')
    expect(result.posts[1].fields.id).toBe('2')

    // Verify sections are assigned correctly
    expect(result.posts[0].section).toBe('music')
    expect(result.posts[1].section).toBe('photography')
  })

  it('handles complex deduplication scenario with overlapping categories', () => {
    const mockData = {
      allMdx: {
        edges: [
          {
            node: {
              frontmatter: {
                title: 'Recap Post',
                slug: 'recap-post',
                date: '2025-01-01',
                banner: 'banner1.jpg'
              },
              fields: {
                category: 'personal',
                id: '1',
                path: '/blog/recap-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Music Post',
                slug: 'music-post',
                date: '2025-01-02',
                banner: 'banner2.jpg'
              },
              fields: {
                category: 'music',
                id: '2',
                path: '/music/music-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Another Music Post',
                slug: 'another-music-post',
                date: '2025-01-03',
                banner: 'banner3.jpg'
              },
              fields: {
                category: 'music',
                id: '2', // Same ID as previous music post
                path: '/music/another-music-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Photography Post',
                slug: 'photo-post',
                date: '2025-01-04',
                banner: 'banner4.jpg'
              },
              fields: {
                category: 'photography',
                id: '3',
                path: '/blog/photo-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Another Photography Post',
                slug: 'another-photo-post',
                date: '2025-01-05',
                banner: 'banner5.jpg'
              },
              fields: {
                category: 'photography',
                id: '3', // Same ID as previous photography post
                path: '/blog/another-photo-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Tech Post',
                slug: 'tech-post',
                date: '2025-01-06',
                banner: 'banner6.jpg'
              },
              fields: {
                category: 'tech',
                id: '4',
                path: '/blog/tech-post'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Another Tech Post',
                slug: 'another-tech-post',
                date: '2025-01-07',
                banner: 'banner7.jpg'
              },
              fields: {
                category: 'tech',
                id: '4', // Same ID as previous tech post
                path: '/blog/another-tech-post'
              }
            }
          }
        ]
      }
    }

    useStaticQuery.mockReturnValue(mockData)

    const result = useCategorizedPosts()

    // Should have 4 unique posts (1 recap + 1 music + 1 photography + 1 tech)
    expect(result.posts).toHaveLength(4)

    // Verify sections are assigned correctly
    expect(result.posts[0].section).toBe('recaps')
    expect(result.posts[1].section).toBe('music')
    expect(result.posts[2].section).toBe('photography')
    expect(result.posts[3].section).toBe('other')

    // Verify no duplicate IDs
    const postIds = result.posts.map(post => post.fields.id)
    const uniqueIds = new Set(postIds)
    expect(postIds).toHaveLength(uniqueIds.size)
  })

  it('handles edge case where recap post ID is already used', () => {
    const mockData = {
      allMdx: {
        edges: [
          {
            node: {
              frontmatter: {
                title: 'First Recap',
                slug: 'first-recap',
                date: '2025-01-01',
                banner: 'banner1.jpg'
              },
              fields: {
                category: 'personal',
                id: '1',
                path: '/blog/first-recap'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Second Recap',
                slug: 'second-recap',
                date: '2025-01-02',
                banner: 'banner2.jpg'
              },
              fields: {
                category: 'personal',
                id: '1', // Same ID as first recap
                path: '/blog/second-recap'
              }
            }
          }
        ]
      }
    }

    useStaticQuery.mockReturnValue(mockData)

    const result = useCategorizedPosts()

    // Should only have 1 recap due to deduplication
    expect(result.posts).toHaveLength(1)
    expect(result.posts[0].section).toBe('recaps')
    expect(result.posts[0].fields.id).toBe('1')
  })

  it('passes through thumbnails field from frontmatter', () => {
    const mockData = {
      allMdx: {
        edges: [
          {
            node: {
              frontmatter: {
                title: 'October Recap',
                slug: 'october-recap',
                date: '2025-10-31',
                banner: 'banner1.jpg',
                thumbnails: ['thumb1.jpg', 'thumb2.jpg', 'thumb3.jpg', 'thumb4.jpg']
              },
              fields: {
                category: 'personal',
                id: '1',
                path: '/blog/october-recap'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Travel Photos',
                slug: 'travel-photos',
                date: '2025-10-15',
                banner: 'banner2.jpg',
                thumbnails: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
              },
              fields: {
                category: 'photography/travel',
                id: '2',
                path: '/blog/travel-photos'
              }
            }
          },
          {
            node: {
              frontmatter: {
                title: 'Old Post Without Thumbnails',
                slug: 'old-post',
                date: '2025-10-01',
                banner: 'banner3.jpg'
                // No thumbnails field
              },
              fields: {
                category: 'meta',
                id: '3',
                path: '/blog/old-post'
              }
            }
          }
        ]
      }
    }

    useStaticQuery.mockReturnValue(mockData)

    const result = useCategorizedPosts()

    // Verify thumbnails are passed through for posts that have them
    expect(result.recaps[0].frontmatter.thumbnails).toEqual(['thumb1.jpg', 'thumb2.jpg', 'thumb3.jpg', 'thumb4.jpg'])
    expect(result.photography[0].frontmatter.thumbnails).toEqual(['photo1.jpg', 'photo2.jpg', 'photo3.jpg'])

    // Verify posts without thumbnails work correctly
    expect(result.other[0].frontmatter.thumbnails).toBeUndefined()
  })
})
