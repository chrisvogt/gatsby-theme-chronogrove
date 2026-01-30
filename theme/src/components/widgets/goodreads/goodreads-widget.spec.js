import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import GoodreadsWidget from './goodreads-widget'
import { TestProviderWithState } from '../../../testUtils'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import { Router, LocationProvider } from '@gatsbyjs/reach-router'

jest.mock('../../../hooks/use-site-metadata')
jest.mock('../../lazy-load', () => ({ children }) => <>{children}</>)

const mockSiteMetadata = {
  widgets: {
    goodreads: {
      username: 'mockusername',
      widgetDataSource: 'https://fake-api.example.com/social/goodreads'
    }
  }
}

describe('Goodreads Widget', () => {
  beforeEach(() => {
    useSiteMetadata.mockImplementation(() => mockSiteMetadata)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderWithRouter = ui => (
    <LocationProvider
      history={{
        location: { pathname: '/' },
        listen: () => () => {},
        navigate: () => {},
        _onTransitionComplete: () => {}
      }}
    >
      <Router>{ui}</Router>
    </LocationProvider>
  )

  it('matches the loading state snapshot', () => {
    const { asFragment } = render(
      <TestProviderWithState>{renderWithRouter(<GoodreadsWidget default />)}</TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with data and AI summary', () => {
    const mockState = {
      widgets: {
        goodreads: {
          state: 'SUCCESS',
          data: {
            aiSummary: 'Test AI summary content',
            collections: {
              recentlyReadBooks: [{ id: 1, title: 'Book 1', thumbnail: 'thumb1.jpg' }]
            },
            profile: { name: 'Test User' }
          }
        }
      }
    }

    const { asFragment } = render(
      <TestProviderWithState initialState={mockState}>
        {renderWithRouter(<GoodreadsWidget default />)}
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without AI summary when not available', () => {
    const mockState = {
      widgets: {
        goodreads: {
          state: 'SUCCESS',
          data: {
            collections: {
              recentlyReadBooks: [{ id: 1, title: 'Book 1', thumbnail: 'thumb1.jpg' }]
            },
            profile: { name: 'Test User' }
          }
        }
      }
    }

    const { asFragment } = render(
      <TestProviderWithState initialState={mockState}>
        {renderWithRouter(<GoodreadsWidget default />)}
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
