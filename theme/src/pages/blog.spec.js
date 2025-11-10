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
})
