import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  graphql: jest.fn()
}))

jest.mock('../../../theme/src/components/category-index-layout', () => {
  const React = require('react')
  const actual = jest.requireActual('../../../theme/src/components/category-index-layout')
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
jest.mock('../../../theme/src/components/layout', () => ({ children, transparentBackground }) => (
  <div data-testid='layout' data-transparent={transparentBackground ? 'true' : 'false'}>
    {children}
  </div>
))
jest.mock('../../../theme/src/components/blog/page-header', () => ({ children }) => <h1>{children}</h1>)
jest.mock('../../../theme/src/components/blog/post-timeline-index', () => {
  const React = require('react')
  return ({ afterFeatured, posts }) =>
    React.createElement(
      React.Fragment,
      null,
      (Array.isArray(posts) ? posts : []).map(p =>
        React.createElement(
          'div',
          {
            'data-testid': 'post-timeline-slot',
            key: p.fields.id,
            'data-category': p.fields.category,
            'data-link': p.fields.path,
            'data-soundcloud': p.frontmatter.soundcloudId ?? '',
            'data-youtube': p.frontmatter.youtubeSrc ?? ''
          },
          p.frontmatter.title
        )
      ),
      afterFeatured ?? null
    )
})
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

jest.mock('../../../theme/src/hooks/use-site-metadata', () => ({
  __esModule: true,
  default: jest.fn()
}))

import MusicPage, { Head } from '../../../www.chrisvogt.me/src/pages/music'
import { getPosts } from '../../../theme/src/hooks/use-recent-posts'
import useSiteMetadata from '../../../theme/src/hooks/use-site-metadata'
import { TestProvider } from '../testUtils'

describe('www.chrisvogt.me Music page', () => {
  const mockData = { allMdx: { edges: [] } }

  const musicNode = overrides => ({
    fields: {
      category: 'music',
      id: 'm1',
      path: '/music/song/',
      ...overrides?.fields
    },
    frontmatter: {
      date: 'March 1, 2025',
      title: 'Original',
      soundcloudId: null,
      youtubeSrc: null,
      ...overrides?.frontmatter
    }
  })

  beforeEach(() => {
    getPosts.mockReset()
    useSiteMetadata.mockImplementation(() => ({
      musicIndexLead: 'Lead line for music index tests.'
    }))
  })

  it('renders music posts in a single column', () => {
    getPosts.mockReturnValue([
      musicNode(),
      musicNode({
        fields: { category: 'music/covers', id: 'm2', path: '/music/cover/' },
        frontmatter: {
          date: 'April 1, 2025',
          title: 'Cover tune',
          youtubeSrc: 'https://www.youtube.com/embed/abc'
        }
      })
    ])

    render(
      <TestProvider>
        <MusicPage data={mockData} />
      </TestProvider>
    )

    expect(screen.getByTestId('layout')).toHaveAttribute('data-transparent', 'true')
    expect(screen.getByText('My Music')).toBeInTheDocument()
    expect(screen.getByText('Lead line for music index tests.')).toBeInTheDocument()
    const cards = screen.getAllByTestId('post-timeline-slot')
    expect(cards).toHaveLength(2)
    expect(cards[0]).toHaveAttribute('data-category', 'music')
    expect(cards[1]).toHaveAttribute('data-category', 'music/covers')
    expect(cards[1]).toHaveAttribute('data-youtube', 'https://www.youtube.com/embed/abc')
    expect(screen.getByRole('region', { name: 'Music posts' })).toBeInTheDocument()
    expect(screen.getByTestId('music-repertoire-promo')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /My piano repertoire/i })).toHaveAttribute(
      'href',
      'https://repertoire.chrisvogt.me/'
    )
  })

  it('uses the default music lead when musicIndexLead is blank', () => {
    useSiteMetadata.mockImplementation(() => ({ musicIndexLead: '   ' }))
    getPosts.mockReturnValue([musicNode()])

    render(
      <TestProvider>
        <MusicPage data={mockData} />
      </TestProvider>
    )

    expect(screen.getByText('Original songs, covers, and audio posts.')).toBeInTheDocument()
    expect(screen.getByTestId('music-repertoire-promo')).toBeInTheDocument()
  })

  it('filters out non-music posts', () => {
    getPosts.mockReturnValue([
      musicNode(),
      {
        fields: { category: 'travel', id: 't', path: '/travel/x/' },
        frontmatter: { date: 'Jan 1', title: 'Trip' }
      }
    ])

    render(
      <TestProvider>
        <MusicPage data={mockData} />
      </TestProvider>
    )

    expect(screen.getAllByTestId('post-timeline-slot')).toHaveLength(1)
    expect(screen.queryByText('Trip')).not.toBeInTheDocument()
    expect(screen.getByTestId('music-repertoire-promo')).toBeInTheDocument()
  })

  it('shows empty state when there are no music posts', () => {
    getPosts.mockReturnValue([])

    render(
      <TestProvider>
        <MusicPage data={mockData} />
      </TestProvider>
    )

    expect(screen.queryAllByTestId('post-timeline-slot')).toHaveLength(0)
    expect(screen.queryByTestId('music-repertoire-promo')).not.toBeInTheDocument()
    expect(screen.getByText('No music posts yet. Check back soon!')).toBeInTheDocument()
  })

  it('treats missing getPosts data as empty', () => {
    getPosts.mockReturnValue(undefined)

    render(
      <TestProvider>
        <MusicPage data={mockData} />
      </TestProvider>
    )

    expect(screen.getByText('No music posts yet. Check back soon!')).toBeInTheDocument()
    expect(screen.queryByTestId('music-repertoire-promo')).not.toBeInTheDocument()
  })

  it('Head renders SEO for /music/', () => {
    render(
      <TestProvider>
        <Head />
      </TestProvider>
    )

    const seo = screen.getByTestId('seo')
    expect(seo).toHaveAttribute('data-canonical-path', '/music/')
    expect(seo.getAttribute('data-title')).toContain('Music')
    expect(seo.getAttribute('data-description')).toContain('chrisvogt.me')
  })
})
