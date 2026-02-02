import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RecentPostsWidget from './recent-posts-widget'
import useCategorizedPosts from '../../../hooks/use-categorized-posts'

// Mock the useCategorizedPosts hook
jest.mock('../../../hooks/use-categorized-posts')

// Mock the PostCard component
jest.mock('./post-card', () => ({ title, thumbnails }) => (
  <div data-testid='post-card' data-has-thumbnails={thumbnails && thumbnails.length > 0}>
    {title}
  </div>
))

// Mock other components
jest.mock('../call-to-action', () => ({ title, to }) => <a href={to}>{title}</a>)

jest.mock('../widget', () => ({ children }) => <div>{children}</div>)
jest.mock('../widget-header', () => ({ aside, children }) => (
  <header>
    <div>{children}</div>
    {aside}
  </header>
))

describe('RecentPostsWidget', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders categorized posts sections', () => {
    useCategorizedPosts.mockReturnValue({
      posts: [
        {
          frontmatter: {
            banner: 'banner1.jpg',
            date: '2024-10-01',
            title: 'September Recap'
          },
          fields: {
            category: 'personal',
            id: '1',
            path: '/blog/september-recap'
          },
          section: 'recaps'
        },
        {
          frontmatter: {
            banner: 'banner2.jpg',
            date: '2024-10-02',
            title: 'Piano Practice'
          },
          fields: {
            category: 'music',
            id: '2',
            path: '/music/piano-practice'
          },
          section: 'music'
        },
        {
          frontmatter: {
            banner: 'banner3.jpg',
            date: '2024-10-03',
            title: 'Travel Photos'
          },
          fields: {
            category: 'photography/travel',
            id: '3',
            path: '/blog/travel-photos'
          },
          section: 'photography'
        },
        {
          frontmatter: {
            banner: 'banner4.jpg',
            date: '2024-10-04',
            title: 'Blog Evolution'
          },
          fields: {
            category: 'meta',
            id: '4',
            path: '/blog/evolution'
          },
          section: 'other'
        }
      ],
      recaps: [],
      music: [],
      photography: [],
      other: []
    })

    render(<RecentPostsWidget />)

    // Verify section headers are rendered
    expect(screen.getByText('Recaps')).toBeInTheDocument()
    expect(screen.getByText('Music')).toBeInTheDocument()
    expect(screen.getByText('Photography')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()

    // Verify all post cards are rendered
    const postCards = screen.getAllByTestId('post-card')
    expect(postCards).toHaveLength(4)
    expect(postCards[0]).toHaveTextContent('September Recap')
    expect(postCards[1]).toHaveTextContent('Piano Practice')
    expect(postCards[2]).toHaveTextContent('Travel Photos')
    expect(postCards[3]).toHaveTextContent('Blog Evolution')

    // Verify the call-to-action is rendered
    expect(screen.getByText(/Browse all published content/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Browse all published content/i })).toHaveAttribute('href', '/blog')
  })

  it('renders only recaps section when only recaps are available', () => {
    useCategorizedPosts.mockReturnValue({
      posts: [
        {
          frontmatter: {
            banner: 'banner1.jpg',
            date: '2024-10-01',
            title: 'September Recap'
          },
          fields: {
            category: 'personal',
            id: '1',
            path: '/blog/september-recap'
          },
          section: 'recaps'
        },
        {
          frontmatter: {
            banner: 'banner2.jpg',
            date: '2024-10-02',
            title: 'July Recap'
          },
          fields: {
            category: 'personal',
            id: '2',
            path: '/blog/july-recap'
          },
          section: 'recaps'
        }
      ],
      recaps: [],
      music: [],
      photography: [],
      other: []
    })

    render(<RecentPostsWidget />)

    // Verify only recaps section is rendered
    expect(screen.getByText('Recaps')).toBeInTheDocument()
    expect(screen.queryByText('Music')).not.toBeInTheDocument()
    expect(screen.queryByText('Photography')).not.toBeInTheDocument()
    expect(screen.queryByText('Posts')).not.toBeInTheDocument()

    // Verify post cards are rendered
    const postCards = screen.getAllByTestId('post-card')
    expect(postCards).toHaveLength(2)
    expect(postCards[0]).toHaveTextContent('September Recap')
    expect(postCards[1]).toHaveTextContent('July Recap')
  })

  it('renders empty state when no posts are available', () => {
    useCategorizedPosts.mockReturnValue({
      posts: [],
      recaps: [],
      music: [],
      photography: [],
      other: []
    })

    render(<RecentPostsWidget />)

    // Verify no section headers are rendered
    expect(screen.queryByText('Recaps')).not.toBeInTheDocument()
    expect(screen.queryByText('Music')).not.toBeInTheDocument()
    expect(screen.queryByText('Photography')).not.toBeInTheDocument()
    expect(screen.queryByText('Posts')).not.toBeInTheDocument()

    // Verify no post cards are rendered
    expect(screen.queryByTestId('post-card')).not.toBeInTheDocument()

    // Verify the call-to-action is still rendered
    expect(screen.getByText(/Browse all published content/i)).toBeInTheDocument()
  })

  it('displays correct count for recaps section', () => {
    useCategorizedPosts.mockReturnValue({
      posts: [
        {
          frontmatter: {
            banner: 'banner1.jpg',
            date: '2024-10-01',
            title: 'September Recap'
          },
          fields: {
            category: 'personal',
            id: '1',
            path: '/blog/september-recap'
          },
          section: 'recaps'
        },
        {
          frontmatter: {
            banner: 'banner2.jpg',
            date: '2024-10-02',
            title: 'July Recap'
          },
          fields: {
            category: 'personal',
            id: '2',
            path: '/blog/july-recap'
          },
          section: 'recaps'
        },
        {
          frontmatter: {
            banner: 'banner3.jpg',
            date: '2024-10-03',
            title: 'June Recap'
          },
          fields: {
            category: 'personal',
            id: '3',
            path: '/blog/june-recap'
          },
          section: 'recaps'
        }
      ],
      recaps: [],
      music: [],
      photography: [],
      other: []
    })

    render(<RecentPostsWidget />)

    // Verify section headers are rendered without count
    expect(screen.getByText('Recaps')).toBeInTheDocument()
    expect(screen.queryByText('(3)')).not.toBeInTheDocument()
  })

  it('passes thumbnails to recaps and photography sections', () => {
    useCategorizedPosts.mockReturnValue({
      posts: [
        {
          frontmatter: {
            banner: 'banner1.jpg',
            date: '2024-10-01',
            title: 'October Recap',
            thumbnails: ['thumb1.jpg', 'thumb2.jpg', 'thumb3.jpg', 'thumb4.jpg']
          },
          fields: {
            category: 'personal',
            id: '1',
            path: '/blog/october-recap'
          },
          section: 'recaps'
        },
        {
          frontmatter: {
            banner: 'banner2.jpg',
            date: '2024-10-02',
            title: 'Travel Photos',
            thumbnails: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
          },
          fields: {
            category: 'photography/travel',
            id: '2',
            path: '/blog/travel-photos'
          },
          section: 'photography'
        }
      ],
      recaps: [],
      music: [],
      photography: [],
      other: []
    })

    render(<RecentPostsWidget />)

    // Verify post cards are rendered with thumbnails
    const postCards = screen.getAllByTestId('post-card')
    expect(postCards).toHaveLength(2)

    // Check that thumbnails are being passed (via data attribute)
    expect(postCards[0]).toHaveAttribute('data-has-thumbnails', 'true')
    expect(postCards[1]).toHaveAttribute('data-has-thumbnails', 'true')
  })

  it('handles posts without thumbnails in recaps section', () => {
    useCategorizedPosts.mockReturnValue({
      posts: [
        {
          frontmatter: {
            banner: 'banner1.jpg',
            date: '2024-10-01',
            title: 'Old Recap',
            thumbnails: null
          },
          fields: {
            category: 'personal',
            id: '1',
            path: '/blog/old-recap'
          },
          section: 'recaps'
        }
      ],
      recaps: [],
      music: [],
      photography: [],
      other: []
    })

    render(<RecentPostsWidget />)

    // Verify post card is rendered (thumbnails prop will be null)
    const postCard = screen.getByTestId('post-card')
    expect(postCard).toHaveTextContent('Old Recap')
    // When thumbnails is null/undefined, the attribute won't be present
    expect(postCard).not.toHaveAttribute('data-has-thumbnails', 'true')
  })
})
