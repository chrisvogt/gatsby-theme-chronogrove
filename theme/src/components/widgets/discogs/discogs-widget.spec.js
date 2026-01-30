import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { TestProviderWithState } from '../../../testUtils'
import DiscogsWidget from './discogs-widget'
import useSiteMetadata from '../../../hooks/use-site-metadata'

jest.mock('../../../hooks/use-site-metadata')

const mockSiteMetadata = {
  widgets: {
    discogs: {
      widgetDataSource: 'https://fake-api.example.com/widgets/discogs'
    }
  }
}

describe('Discogs Widget', () => {
  beforeEach(() => {
    useSiteMetadata.mockImplementation(() => mockSiteMetadata)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('matches the loading state snapshot', () => {
    const { asFragment } = render(
      <TestProviderWithState>
        <DiscogsWidget />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the loaded state snapshot', () => {
    const initialState = {
      widgets: {
        discogs: {
          state: 'SUCCESS',
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
            metrics: {
              'Vinyls Owned': 37
            },
            profile: {
              profileURL: 'https://www.discogs.com/user/chrisvogt/collection'
            }
          }
        }
      }
    }

    const { asFragment } = render(
      <TestProviderWithState initialState={initialState}>
        <DiscogsWidget />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the error state snapshot', () => {
    const initialState = {
      widgets: {
        discogs: {
          state: 'FAILURE',
          data: null
        }
      }
    }

    const { asFragment } = render(
      <TestProviderWithState initialState={initialState}>
        <DiscogsWidget />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
