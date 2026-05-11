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
    ({ title, category, link, soundcloudId, youtubeSrc }) => (
      <div
        data-testid='post-card'
        data-category={category}
        data-link={link}
        data-soundcloud={soundcloudId ?? ''}
        data-youtube={youtubeSrc ?? ''}
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

import MusicPage, { Head } from '../../../www.chrisvogt.me/src/pages/music'
import { getPosts } from '../../../theme/src/hooks/use-recent-posts'
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
    const cards = screen.getAllByTestId('post-card')
    expect(cards).toHaveLength(2)
    expect(cards[0]).toHaveAttribute('data-category', 'music')
    expect(cards[1]).toHaveAttribute('data-category', 'music/covers')
    expect(cards[1]).toHaveAttribute('data-youtube', 'https://www.youtube.com/embed/abc')
    expect(screen.getByRole('region', { name: 'Music posts' })).toBeInTheDocument()
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

    expect(screen.getAllByTestId('post-card')).toHaveLength(1)
    expect(screen.queryByText('Trip')).not.toBeInTheDocument()
  })

  it('shows empty state when there are no music posts', () => {
    getPosts.mockReturnValue([])

    render(
      <TestProvider>
        <MusicPage data={mockData} />
      </TestProvider>
    )

    expect(screen.queryAllByTestId('post-card')).toHaveLength(0)
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
