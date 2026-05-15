import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  graphql: jest.fn()
}))

jest.mock('../components/category-index-layout', () => {
  const React = require('react')
  const actual = jest.requireActual('../components/category-index-layout')
  return {
    ...actual,
    CategoryIndexHeroChrome: ({ children, overlayHeight = 'min(75vh, 1000px)' }) => (
      <>
        <div data-testid='animated-background' data-overlay-height={overlayHeight} />
        {children}
      </>
    )
  }
})
jest.mock('../components/layout', () => ({ children, transparentBackground }) => (
  <div data-testid='layout' data-transparent={transparentBackground ? 'true' : 'false'}>
    {children}
  </div>
))
jest.mock('../components/blog/page-header', () => ({ children }) => <h1>{children}</h1>)
jest.mock('../components/seo', () => {
  const MockSeo = ({ canonicalPath, title, description, children }) => (
    <div data-testid='seo' data-canonical-path={canonicalPath} data-title={title} data-description={description}>
      {children}
    </div>
  )
  return { __esModule: true, default: MockSeo }
})

jest.mock('../hooks/use-recent-posts', () => ({
  getPosts: jest.fn()
}))

import TravelPage, { Head } from '../../../../websites/www.chrisvogt.me/src/pages/travel'
import { getPosts } from '../hooks/use-recent-posts'
import { TestProvider } from '../test-utils'

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

  it('renders travel journal featured trip plus timeline stamps with excerpts', () => {
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
    expect(screen.getByRole('heading', { name: 'Travel' })).toBeInTheDocument()
    expect(screen.getByText('Narrative posts and photo galleries from trips and destinations.')).toBeInTheDocument()

    expect(screen.getByTestId('travel-featured-entry')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Belize' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Pacific Northwest' })).toBeInTheDocument()
    expect(screen.getAllByTestId('travel-entry')).toHaveLength(1)
    expect(screen.getByRole('region', { name: 'Travel posts' })).toBeInTheDocument()
  })

  it('shows a gallery cue on featured trip when thumbnails list has multiple photos', () => {
    getPosts.mockReturnValue([
      travelNode({
        fields: { id: 'travel-multi', path: '/travel/multi/' },
        frontmatter: {
          title: 'Multi-photo trip',
          thumbnails: ['https://example.com/img-a.jpg', 'https://example.com/img-b.jpg']
        }
      }),
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

    expect(screen.getByTestId('travel-featured-carousel-icon')).toBeInTheDocument()
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

    expect(screen.queryAllByTestId('travel-entry')).toHaveLength(0)
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

    expect(screen.queryByTestId('travel-featured-entry')).not.toBeInTheDocument()
    expect(screen.queryAllByTestId('travel-entry')).toHaveLength(0)
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
    expect(seo.dataset.description).toContain('Belize')
  })
})
