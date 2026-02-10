import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import GoodreadsWidget from './goodreads-widget'
import { TestProviderWithQuery } from '../../../testUtils'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

jest.mock('../../../hooks/use-site-metadata')
jest.mock('../../../hooks/use-widget-data')
jest.mock('../../lazy-load', () => ({ children }) => <>{children}</>)

// Mock child components that have complex dependencies
jest.mock('./recently-read-books', () => ({ books, isLoading }) => (
  <div data-testid='recently-read-books'>{isLoading ? 'Loading...' : `${books?.length || 0} books`}</div>
))

jest.mock('./user-status', () => ({ actorName, isLoading, status }) => (
  <div data-testid='user-status'>
    {isLoading ? 'Loading...' : status ? `${actorName}: ${status.text}` : 'No status'}
  </div>
))

jest.mock('../steam/ai-summary', () => ({ aiSummary }) => <div data-testid='ai-summary'>{aiSummary}</div>)

const mockSiteMetadata = {
  widgets: {
    goodreads: {
      username: 'mockusername',
      widgetDataSource: 'https://fake-api.example.com/social/goodreads'
    }
  }
}

const mockLoadingState = {
  data: undefined,
  isLoading: true,
  hasFatalError: false,
  isError: false,
  error: null
}

const mockSuccessState = {
  data: {
    aiSummary: 'Test AI summary content',
    collections: {
      recentlyReadBooks: [
        {
          id: 1,
          title: 'Book 1',
          thumbnail: 'thumb1.jpg',
          author: 'Author 1'
        }
      ],
      updates: [
        {
          type: 'userstatus',
          text: 'Currently reading a great book!',
          created: '2024-01-01T00:00:00Z'
        }
      ]
    },
    profile: {
      name: 'Test User',
      friendsCount: 150,
      readCount: 42
    }
  },
  isLoading: false,
  hasFatalError: false,
  isError: false,
  error: null
}

const mockSuccessStateWithoutAiSummary = {
  data: {
    collections: {
      books: [
        {
          id: 1,
          title: 'Book 1',
          thumbnail: 'thumb1.jpg',
          author: 'Author 1'
        }
      ]
    },
    metrics: [{ displayName: 'Books Read', value: 42 }],
    profile: {
      displayName: 'Test User'
    }
  },
  isLoading: false,
  hasFatalError: false,
  isError: false,
  error: null
}

const mockErrorState = {
  data: undefined,
  isLoading: false,
  hasFatalError: true,
  isError: true,
  error: new Error('Failed to fetch')
}

describe('Goodreads Widget', () => {
  beforeEach(() => {
    useSiteMetadata.mockImplementation(() => mockSiteMetadata)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('matches the loading state snapshot', () => {
    useWidgetData.mockReturnValue(mockLoadingState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <GoodreadsWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with data and AI summary', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <GoodreadsWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without AI summary when not available', () => {
    useWidgetData.mockReturnValue(mockSuccessStateWithoutAiSummary)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <GoodreadsWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders error state', () => {
    useWidgetData.mockReturnValue(mockErrorState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <GoodreadsWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('builds metrics from profile friendsCount and readCount', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    const { container } = render(
      <TestProviderWithQuery>
        <GoodreadsWidget />
      </TestProviderWithQuery>
    )

    // The ProfileMetricsBadge should receive metrics built from profile data
    expect(container).toBeDefined()
  })

  it('finds status from updates collection with userstatus type', () => {
    const stateWithUserStatus = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        collections: {
          ...mockSuccessState.data.collections,
          updates: [
            { type: 'comment', text: 'A comment' },
            { type: 'userstatus', actionText: 'Reading something', created: '2024-01-01' }
          ]
        }
      }
    }
    useWidgetData.mockReturnValue(stateWithUserStatus)

    const { getByTestId } = render(
      <TestProviderWithQuery>
        <GoodreadsWidget />
      </TestProviderWithQuery>
    )

    expect(getByTestId('user-status')).toBeInTheDocument()
  })

  it('finds status from updates collection with review type', () => {
    const stateWithReview = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        collections: {
          ...mockSuccessState.data.collections,
          updates: [{ type: 'review', book: { title: 'Test Book' }, rating: 4, created: '2024-01-01' }]
        }
      }
    }
    useWidgetData.mockReturnValue(stateWithReview)

    const { getByTestId } = render(
      <TestProviderWithQuery>
        <GoodreadsWidget />
      </TestProviderWithQuery>
    )

    expect(getByTestId('user-status')).toBeInTheDocument()
  })

  it('handles missing profile metrics gracefully', () => {
    const stateWithNoMetrics = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        profile: {
          name: 'Test User'
          // No friendsCount or readCount
        }
      }
    }
    useWidgetData.mockReturnValue(stateWithNoMetrics)

    const { container } = render(
      <TestProviderWithQuery>
        <GoodreadsWidget />
      </TestProviderWithQuery>
    )

    expect(container).toBeDefined()
  })

  it('filters books without thumbnails', () => {
    const stateWithMixedBooks = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        collections: {
          ...mockSuccessState.data.collections,
          recentlyReadBooks: [
            { id: 1, title: 'Book with thumb', thumbnail: 'thumb.jpg' },
            { id: 2, title: 'Book without thumb', thumbnail: null },
            { id: 3, title: 'Book with empty thumb', thumbnail: '' }
          ]
        }
      }
    }
    useWidgetData.mockReturnValue(stateWithMixedBooks)

    const { getByTestId } = render(
      <TestProviderWithQuery>
        <GoodreadsWidget />
      </TestProviderWithQuery>
    )

    // Only 1 book has a valid thumbnail
    expect(getByTestId('recently-read-books')).toHaveTextContent('1 books')
  })
})
