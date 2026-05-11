import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  graphql: jest.fn()
}))

jest.mock('../../../theme/src/components/animated-page-background', () => ({ overlayHeight }) => (
  <div data-testid='animated-background' data-overlay-height={overlayHeight} />
))
jest.mock('../../../theme/src/components/layout', () => ({ children, transparentBackground }) => (
  <div data-testid='layout' data-transparent={transparentBackground ? 'true' : 'false'}>
    {children}
  </div>
))
jest.mock('../../../theme/src/components/blog/page-header', () => ({ children }) => <h1>{children}</h1>)
jest.mock(
  '../../../theme/src/components/widgets/recent-posts/post-card',
  () =>
    ({ title, category, excerpt, link, thumbnails }) => (
      <div
        data-testid='post-card'
        data-category={category}
        data-link={link}
        data-excerpt={excerpt ?? ''}
        data-thumbnails={thumbnails ? thumbnails.join(',') : ''}
      >
        {title}
      </div>
    )
)
jest.mock('../../../theme/src/components/seo', () => {
  const MockSeo = ({ canonicalPath, title, description, children }) => (
    <div data-testid='seo' data-canonical-path={canonicalPath} data-title={title} data-description={description}>
      {children}
    </div>
  )
  return { __esModule: true, default: MockSeo }
})

jest.mock('../../../theme/src/hooks/use-recent-posts', () => ({
  getPosts: jest.fn()
}))

import TravelPage, { Head } from '../../../www.chrisvogt.me/src/pages/travel'
import { getPosts } from '../../../theme/src/hooks/use-recent-posts'
import { TestProvider } from '../testUtils'

describe('www.chrisvogt.me Travel page', () => {
  const mockData = { allMdx: { edges: [] } }

  const travelNode = overrides => ({
    fields: {
      category: 'travel',
      id: 't1',
      path: '/travel/belize/',
      ...overrides?.fields
    },
    frontmatter: {
      date: 'January 1, 2025',
      excerpt: 'Island hopping and reef days.',
      thumbnails: ['https://example.com/a.jpg'],
      title: 'Belize',
      ...overrides?.frontmatter
    }
  })

  beforeEach(() => {
    getPosts.mockReset()
  })

  it('renders travel posts with home-style cards and excerpt', () => {
    getPosts.mockReturnValue([
      travelNode(),
      travelNode({
        fields: { category: 'travel/pnw', id: 't2', path: '/travel/pnw/' },
        frontmatter: {
          date: 'February 1, 2025',
          excerpt: 'Mountains and coast.',
          thumbnails: ['https://example.com/b.jpg'],
          title: 'Pacific Northwest'
        }
      })
    ])

    render(
      <TestProvider>
        <TravelPage data={mockData} />
      </TestProvider>
    )

    expect(screen.getByTestId('layout')).toHaveAttribute('data-transparent', 'true')
    expect(screen.getByTestId('animated-background')).toHaveAttribute('data-overlay-height', 'min(75vh, 1000px)')
    expect(screen.getByText('Travel')).toBeInTheDocument()
    expect(screen.getByText('Narrative posts and photo galleries from trips and destinations.')).toBeInTheDocument()

    const cards = screen.getAllByTestId('post-card')
    expect(cards).toHaveLength(2)
    expect(cards[0]).toHaveAttribute('data-category', 'travel')
    expect(cards[0]).toHaveAttribute('data-excerpt', 'Island hopping and reef days.')
    expect(cards[1]).toHaveAttribute('data-category', 'travel/pnw')
    expect(screen.getByRole('region', { name: 'Travel posts' })).toBeInTheDocument()
  })

  it('filters out non-travel posts', () => {
    getPosts.mockReturnValue([
      travelNode(),
      {
        fields: { category: 'technology', id: 'x', path: '/blog/tech/' },
        frontmatter: { date: 'Jan 1', title: 'Tech', excerpt: '', thumbnails: [] }
      }
    ])

    render(
      <TestProvider>
        <TravelPage data={mockData} />
      </TestProvider>
    )

    expect(screen.getAllByTestId('post-card')).toHaveLength(1)
    expect(screen.getByText('Belize')).toBeInTheDocument()
    expect(screen.queryByText('Tech')).not.toBeInTheDocument()
  })

  it('shows empty state when there are no travel posts', () => {
    getPosts.mockReturnValue([
      {
        fields: { category: 'music', id: 'm', path: '/music/x/' },
        frontmatter: { date: 'Jan 1', title: 'Song', excerpt: '', thumbnails: [] }
      }
    ])

    render(
      <TestProvider>
        <TravelPage data={mockData} />
      </TestProvider>
    )

    expect(screen.queryAllByTestId('post-card')).toHaveLength(0)
    expect(screen.getByText('No travel posts yet. Check back soon!')).toBeInTheDocument()
  })

  it('treats missing getPosts data as empty', () => {
    getPosts.mockReturnValue(undefined)

    render(
      <TestProvider>
        <TravelPage data={mockData} />
      </TestProvider>
    )

    expect(screen.getByText('No travel posts yet. Check back soon!')).toBeInTheDocument()
  })

  it('Head renders SEO for /travel/', () => {
    render(
      <TestProvider>
        <Head />
      </TestProvider>
    )

    const seo = screen.getByTestId('seo')
    expect(seo).toHaveAttribute('data-canonical-path', '/travel/')
    expect(seo).toHaveAttribute('data-title', 'Travel — Chris Vogt')
    expect(seo.getAttribute('data-description')).toContain('Belize')
  })
})
