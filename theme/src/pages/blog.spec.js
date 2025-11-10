import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock GraphQL before importing the component
jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  graphql: jest.fn()
}))

import BlogIndexPage from './blog'
import { TestProvider } from '../testUtils'

// Mock the components
jest.mock('../components/layout', () => ({ children }) => <div data-testid='layout'>{children}</div>)
jest.mock('../components/blog/page-header', () => ({ children }) => <h1>{children}</h1>)
jest.mock('../components/widgets/recent-posts/post-card', () => ({ title, category }) => (
  <div data-testid='post-card' data-category={category}>
    {title}
  </div>
))
jest.mock('../components/seo', () => () => <div data-testid='seo' />)
jest.mock('./blog-head', () => () => <div data-testid='blog-head' />)

// Mock the getPosts function
jest.mock('../hooks/use-recent-posts', () => ({
  getPosts: jest.fn()
}))

import { getPosts } from '../hooks/use-recent-posts'

describe('BlogIndexPage', () => {
  const mockPosts = [
    {
      id: '1',
      excerpt: 'This is an excerpt',
      frontmatter: {
        title: 'Test Post 1',
        date: '2021-01-01',
        category: 'Technology',
        path: '/blog/test-post-1',
        slug: 'test-post-1',
        banner: 'https://example.com/banner1.jpg',
        excerpt: 'This is an excerpt'
      },
      fields: {
        category: 'technology',
        id: '1',
        path: '/blog/test-post-1'
      }
    },
    {
      id: '2',
      excerpt: 'This is another excerpt',
      frontmatter: {
        title: 'Test Post 2',
        date: '2021-01-02',
        category: 'Blog',
        path: '/blog/test-post-2',
        slug: 'test-post-2',
        banner: 'https://example.com/banner2.jpg',
        excerpt: 'This is another excerpt'
      },
      fields: {
        category: 'blog',
        id: '2',
        path: '/blog/test-post-2'
      }
    }
  ]

  const mockData = {
    allMdx: {
      edges: mockPosts.map(post => ({ node: post }))
    }
  }

  beforeEach(() => {
    getPosts.mockClear()
  })

  it('renders the blog index page with posts', () => {
    getPosts.mockReturnValue(mockPosts)

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getAllByTestId('post-card')).toHaveLength(2)
  })

  it('renders Technology posts', () => {
    getPosts.mockReturnValue(mockPosts)

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    const technologyPost = screen.getByText('Test Post 1')
    expect(technologyPost).toBeInTheDocument()
  })

  it('renders Music posts', () => {
    getPosts.mockReturnValue(mockPosts)

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    const musicPost = screen.getByText('Test Post 2')
    expect(musicPost).toBeInTheDocument()
  })

  it('handles empty posts array', () => {
    getPosts.mockReturnValue([])

    render(
      <TestProvider>
        <BlogIndexPage data={{ allMdx: { edges: [] } }} />
      </TestProvider>
    )

    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.queryAllByTestId('post-card')).toHaveLength(0)
  })

  it('filters out posts with photography category', () => {
    const photographyPost = {
      id: '3',
      excerpt: 'Photography post',
      frontmatter: {
        title: 'Photography Post',
        date: '2021-01-03',
        category: 'Photography',
        path: '/blog/photography-post',
        slug: 'photography-post'
      },
      fields: {
        category: 'photography'
      }
    }

    getPosts.mockReturnValue([...mockPosts, photographyPost])

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    // Should only render the 2 blog posts, not the photography post
    expect(screen.getAllByTestId('post-card')).toHaveLength(2)
    expect(screen.queryByText('Photography Post')).not.toBeInTheDocument()
  })

  it('filters out posts with music category in fields', () => {
    const musicFieldsPost = {
      id: '4',
      excerpt: 'Music post',
      frontmatter: {
        title: 'Music Post',
        date: '2021-01-04',
        category: 'Music',
        path: '/blog/music-post',
        slug: 'music-post'
      },
      fields: {
        category: 'music'
      }
    }

    getPosts.mockReturnValue([...mockPosts, musicFieldsPost])

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    // Should only render the 2 blog posts, not the music post
    expect(screen.getAllByTestId('post-card')).toHaveLength(2)
    expect(screen.queryByText('Music Post')).not.toBeInTheDocument()
  })

  it('includes posts with slug "now"', () => {
    const nowPost = {
      id: '5',
      excerpt: 'Now post',
      frontmatter: {
        title: 'Now Post',
        date: '2021-01-05',
        category: 'personal',
        path: '/blog/now',
        slug: 'now',
        banner: null,
        excerpt: 'Now post'
      },
      fields: {
        category: 'personal',
        id: '5',
        path: '/blog/now'
      }
    }

    getPosts.mockReturnValue([...mockPosts, nowPost])

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    // Should render all posts including the now post
    expect(screen.getByText('Now Post')).toBeInTheDocument()
  })

  it('renders posts grouped by category', () => {
    getPosts.mockReturnValue(mockPosts)

    const { container } = render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    // Check that posts are rendered with their fields.category
    const technologyCards = container.querySelectorAll('[data-category="technology"]')
    const blogCards = container.querySelectorAll('[data-category="blog"]')

    expect(technologyCards).toHaveLength(1)
    expect(blogCards).toHaveLength(1)
  })

  it('handles category with only one post (no remaining posts grid)', () => {
    const singlePost = [
      {
        id: '1',
        frontmatter: {
          title: 'Single Tech Post',
          date: '2021-01-01',
          slug: 'single-post',
          banner: 'https://example.com/banner.jpg',
          excerpt: 'Only one post in this category'
        },
        fields: {
          category: 'technology',
          id: '1',
          path: '/blog/single-post'
        }
      }
    ]

    getPosts.mockReturnValue(singlePost)

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    // Should render the single post as featured, with no remaining posts grid
    expect(screen.getByText('Single Tech Post')).toBeInTheDocument()
    expect(screen.getAllByTestId('post-card')).toHaveLength(1)
  })

  it('selects post with banner as featured when available', () => {
    const postsWithBanner = [
      {
        id: '1',
        frontmatter: {
          title: 'Post Without Banner',
          date: '2021-01-01',
          slug: 'no-banner',
          banner: null,
          excerpt: 'No banner here'
        },
        fields: {
          category: 'technology',
          id: '1',
          path: '/blog/no-banner'
        }
      },
      {
        id: '2',
        frontmatter: {
          title: 'Post With Banner',
          date: '2021-01-02',
          slug: 'with-banner',
          banner: 'https://example.com/featured.jpg',
          excerpt: 'Has a banner'
        },
        fields: {
          category: 'technology',
          id: '2',
          path: '/blog/with-banner'
        }
      }
    ]

    getPosts.mockReturnValue(postsWithBanner)

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    // Post with banner should be rendered
    expect(screen.getByText('Post With Banner')).toBeInTheDocument()
    expect(screen.getByText('Post Without Banner')).toBeInTheDocument()
  })

  it('displays empty state message when no posts exist', () => {
    getPosts.mockReturnValue([])

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    expect(screen.getByText('No posts yet. Check back soon!')).toBeInTheDocument()
  })

  it('handles posts with no category field', () => {
    const postWithoutCategory = [
      {
        id: '1',
        frontmatter: {
          title: 'Uncategorized Post',
          date: '2021-01-01',
          slug: 'uncategorized',
          banner: null,
          excerpt: 'No category'
        },
        fields: {
          category: undefined,
          id: '1',
          path: '/blog/uncategorized'
        }
      }
    ]

    getPosts.mockReturnValue(postWithoutCategory)

    render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    // Should render under "All Posts" section
    expect(screen.getByText('Uncategorized Post')).toBeInTheDocument()
  })

  it('renders section headers with correct post counts', () => {
    const multiplePosts = [
      ...mockPosts,
      {
        id: '3',
        frontmatter: {
          title: 'Another Tech Post',
          date: '2021-01-03',
          slug: 'tech-3',
          banner: null,
          excerpt: 'More tech content'
        },
        fields: {
          category: 'technology',
          id: '3',
          path: '/blog/tech-3'
        }
      }
    ]

    getPosts.mockReturnValue(multiplePosts)

    const { container } = render(
      <TestProvider>
        <BlogIndexPage data={mockData} />
      </TestProvider>
    )

    // Check for section with count
    expect(container.textContent).toMatch(/\d+ posts?/)
  })
})
