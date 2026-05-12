import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('gatsby', () => ({
  graphql: jest.fn(),
  Link: ({ children, to, ...rest }) => (
    <a href={typeof to === 'string' ? to : '#'} {...rest}>
      {children}
    </a>
  )
}))

import TravelJournalIndex from '../../../www.chrisvogt.me/src/components/travel-journal-index'
import { TestProvider } from '../testUtils'

/** Carousel advance ~= interval + crossfade in travel-journal-index */
const CAROUSEL_STEP_MS = 3000 + 300

const originalIntersectionObserver = global.IntersectionObserver

describe('travel-journal-index (www)', () => {
  const cloud = n => `https://res.cloudinary.com/chrisvogt/image/upload/v173000000${n}/blog/t${n}.jpg`

  const makePost = (overrides = {}) => ({
    fields: {
      category: 'travel',
      id: 't1',
      path: '/travel/default/',
      ...overrides.fields
    },
    frontmatter: {
      date: 'January 1, 2025',
      excerpt: 'Excerpt text.',
      thumbnails: [cloud('1')],
      title: 'Belize',
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
        <TravelJournalIndex posts={[]} />
      </TestProvider>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders featured masthead plus read more for a single travel post', () => {
    render(
      <TestProvider>
        <TravelJournalIndex posts={[makePost()]} />
      </TestProvider>
    )
    expect(screen.getByTestId('travel-featured-entry')).toBeInTheDocument()
    expect(screen.queryAllByTestId('travel-entry')).toHaveLength(0)
    expect(screen.getByRole('heading', { level: 2, name: 'Belize' })).toBeInTheDocument()
    expect(screen.getAllByTestId('travel-read-more-link')).toHaveLength(1)
    expect(screen.queryByTestId('travel-featured-carousel-icon')).not.toBeInTheDocument()
  })

  it('shows carousel badge when featured has multiple thumbnails and advances slides on timers', async () => {
    jest.useFakeTimers()
    try {
      render(
        <TestProvider>
          <TravelJournalIndex
            posts={[
              makePost({
                frontmatter: {
                  title: 'Multi',
                  thumbnails: [cloud('91'), cloud('92')]
                }
              }),
              makePost({
                fields: { id: 't2', path: '/travel/next/' },
                frontmatter: { title: 'Next', thumbnails: [cloud('3')] }
              })
            ]}
          />
        </TestProvider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('travel-featured-carousel-icon')).toBeInTheDocument()
      })

      screen.getByAltText(/^Multi: photo 1 of 2$/)

      await act(async () => {
        jest.advanceTimersByTime(CAROUSEL_STEP_MS)
      })

      await waitFor(() => {
        expect(screen.getByAltText(/^Multi: photo 2 of 2$/)).toBeInTheDocument()
      })
    } finally {
      act(() => {
        jest.runOnlyPendingTimers()
      })
      jest.useRealTimers()
    }
  })

  it('shows carousel +N cue when truncated to eight slides after cap', () => {
    jest.useFakeTimers()
    const thumbs = Array.from({ length: 9 }).map(
      (_, i) => `https://res.cloudinary.com/chrisvogt/image/upload/v177000010${i}/g/x${i}.jpg`
    )
    try {
      render(
        <TestProvider>
          <TravelJournalIndex posts={[makePost({ frontmatter: { title: 'Many', thumbnails: thumbs } })]} />
        </TestProvider>
      )
      expect(screen.getByTestId('travel-featured-carousel-icon')).toBeInTheDocument()
      expect(screen.getByText('+3')).toBeInTheDocument()
    } finally {
      act(() => {
        jest.runOnlyPendingTimers()
      })
      jest.useRealTimers()
    }
  })

  it('shows timeline stamps plus read-more on each stamp and featured row', () => {
    render(
      <TestProvider>
        <TravelJournalIndex
          posts={[
            makePost(),
            makePost({
              fields: { id: 'b', category: 'travel/pnw', path: '/travel/pnw/' },
              frontmatter: { title: 'PNW', excerpt: 'Mtns', thumbnails: ['https://cdn.example/z.jpg'] }
            }),
            makePost({
              fields: { id: 'c', path: '/travel/tiny/' },
              frontmatter: { title: 'Tiny', thumbnails: [], date: 'Feb 1', excerpt: null }
            })
          ]}
        />
      </TestProvider>
    )

    expect(screen.getAllByTestId('travel-entry')).toHaveLength(2)
    const readLinks = screen.getAllByTestId('travel-read-more-link')
    expect(readLinks).toHaveLength(3)
    expect(readLinks[1]).toHaveAttribute('href', '/travel/pnw/')
  })

  it('shows hero frame without image when thumbnails are missing', () => {
    render(
      <TestProvider>
        <TravelJournalIndex posts={[makePost({ frontmatter: { thumbnails: null } })]} />
      </TestProvider>
    )
    expect(screen.getByTestId('travel-featured-hero')).toBeInTheDocument()
    expect(screen.queryAllByRole('img')).toHaveLength(0)
  })

  it('uses Untitled headline when timeline title is not a string', () => {
    render(
      <TestProvider>
        <TravelJournalIndex
          posts={[
            makePost(),
            makePost({
              fields: { id: 'unt', path: '/travel/u/' },
              frontmatter: { title: undefined, thumbnails: [], excerpt: '' }
            })
          ]}
        />
      </TestProvider>
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Untitled' })).toBeInTheDocument()
  })
})
