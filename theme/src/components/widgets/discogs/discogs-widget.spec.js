import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { TestProviderWithQuery } from '../../../testUtils'
import DiscogsWidget from './discogs-widget'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

jest.mock('../../../hooks/use-site-metadata')
jest.mock('../../../hooks/use-widget-data')

const mockSiteMetadata = {
  widgets: {
    discogs: {
      widgetDataSource: 'https://fake-api.example.com/widgets/discogs'
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
    collections: {
      releases: [
        {
          id: 28461454,
          instanceId: 2045415075,
          basicInformation: {
            id: 28461454,
            title: 'The Rise & Fall Of A Midwest Princess',
            year: 2023,
            artists: [{ name: 'Chappell Roan' }],
            cdnThumbUrl: 'https://example.com/thumb.jpg',
            resourceUrl: 'https://discogs.com/release/123'
          }
        }
      ]
    },
    // Metrics come as an object from the API, not an array
    metrics: {
      'Vinyls Owned': 37
    },
    profile: {
      profileURL: 'https://www.discogs.com/user/chrisvogt/collection'
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

describe('Discogs Widget', () => {
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
        <DiscogsWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the loaded state snapshot', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <DiscogsWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the error state snapshot', () => {
    useWidgetData.mockReturnValue(mockErrorState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <DiscogsWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
