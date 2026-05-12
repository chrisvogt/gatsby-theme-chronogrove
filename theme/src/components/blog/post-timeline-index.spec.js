import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('gatsby', () => ({
  Link: ({ children, to, ...rest }) => (
    <a href={typeof to === 'string' ? to : '#'} {...rest}>
      {children}
    </a>
  )
}))

import PostTimelineIndex from './post-timeline-index'
import { TestProvider } from '../../testUtils'

const originalIntersectionObserver = global.IntersectionObserver

describe('PostTimelineIndex', () => {
  const cloud = n => `https://res.cloudinary.com/example/image/upload/v173000000${n}/x${n}.jpg`

  const makePost = (overrides = {}) => ({
    fields: {
      category: 'blog',
      id: 'p1',
      path: '/blog/first/',
      ...overrides.fields
    },
    frontmatter: {
      banner: cloud('0'),
      date: 'January 1, 2025',
      excerpt: 'Hello.',
      thumbnails: [cloud('1')],
      title: 'First Post',
      ...overrides.frontmatter
    }
  })

  beforeEach(() => {
    jest.spyOn(global, 'Image').mockImplementation(function MockImage() {
      this.src = ''
    })
    global.IntersectionObserver = jest.fn().mockImplementation(cb => ({
      disconnect: jest.fn(),
      observe: jest.fn(el => {
        cb([{ isIntersecting: true, target: el }])
      }),
      unobserve: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: []
    }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
    global.IntersectionObserver = originalIntersectionObserver
  })

  it('renders nothing when posts is empty', () => {
    const { container } = render(
      <TestProvider>
        <PostTimelineIndex posts={[]} />
      </TestProvider>
    )
    expect(container.firstChild).toBeNull()
  })

  it('uses default post-timeline test ids and featured + stamp rows', () => {
    render(
      <TestProvider>
        <PostTimelineIndex
          posts={[
            makePost(),
            makePost({
              fields: { id: 'p2', path: '/blog/second/' },
              frontmatter: { title: 'Second', thumbnails: [cloud('2')] }
            })
          ]}
        />
      </TestProvider>
    )

    expect(screen.getByTestId('post-timeline-featured-entry')).toBeInTheDocument()
    expect(screen.getAllByTestId('post-timeline-entry')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 2, name: 'First Post' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Second' })).toBeInTheDocument()
  })

  it('featured carousel hero receives hover handlers when multiple slides exist', () => {
    render(
      <TestProvider>
        <PostTimelineIndex
          posts={[
            makePost({
              frontmatter: {
                thumbnails: [cloud('1'), cloud('2')]
              }
            })
          ]}
        />
      </TestProvider>
    )

    const hero = screen.getByTestId('post-timeline-featured-hero')
    fireEvent.mouseEnter(hero)
    fireEvent.mouseLeave(hero)
    expect(hero).toBeInTheDocument()
  })

  it('timelineAsideMedia shows embed asides (no image carousel hero)', () => {
    render(
      <TestProvider>
        <PostTimelineIndex
          posts={[
            makePost({
              frontmatter: {
                banner: null,
                thumbnails: [],
                title: 'MV',
                youtubeSrc: 'https://www.youtube.com/embed/abc123xyz'
              }
            }),
            makePost({
              fields: { id: 'p2', path: '/music/sc/' },
              frontmatter: {
                banner: null,
                excerpt: 'SC track',
                soundcloudId: '501234567',
                thumbnails: [],
                title: 'SoundCloud tune'
              }
            })
          ]}
          timelineAsideMedia
        />
      </TestProvider>
    )

    expect(screen.getByTestId('post-timeline-featured-embed-aside')).toBeInTheDocument()
    expect(screen.queryByTestId('post-timeline-featured-hero')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('post-timeline-entry-embed-aside')).toHaveLength(1)
    expect(document.querySelector('iframe[src*="soundcloud.com/player"]')).toBeTruthy()
  })

  it('timelineAsideMedia uses muted placeholder when featured post has no embeds', () => {
    render(
      <TestProvider>
        <PostTimelineIndex
          posts={[
            makePost({
              frontmatter: {
                banner: null,
                soundcloudId: null,
                thumbnails: [],
                title: 'No embed',
                youtubeSrc: null
              }
            })
          ]}
          timelineAsideMedia
        />
      </TestProvider>
    )

    const aside = screen.getByTestId('post-timeline-featured-embed-aside')
    expect(aside).toBeInTheDocument()
    expect(aside.querySelector('iframe')).toBeNull()
  })

  it('timelineAsideMedia uses muted placeholder for stamp rows without embeds', () => {
    render(
      <TestProvider>
        <PostTimelineIndex
          posts={[
            makePost({
              frontmatter: {
                thumbnails: [cloud('1')],
                title: 'Video post',
                youtubeSrc: 'https://www.youtube.com/embed/demoVid01'
              }
            }),
            makePost({
              fields: { id: 'p2', path: '/music/plain/' },
              frontmatter: {
                banner: null,
                soundcloudId: null,
                thumbnails: [],
                title: 'Plain track',
                youtubeSrc: null
              }
            })
          ]}
          timelineAsideMedia
        />
      </TestProvider>
    )

    const stampAsides = screen.getAllByTestId('post-timeline-entry-embed-aside')
    expect(stampAsides).toHaveLength(1)
    expect(stampAsides[0].querySelector('iframe')).toBeNull()
  })
})
