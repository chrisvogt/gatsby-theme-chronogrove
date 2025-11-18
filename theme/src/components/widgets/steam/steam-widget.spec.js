import React from 'react'
import renderer, { act } from 'react-test-renderer'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { configureStore as configureRealStore } from '@reduxjs/toolkit'
// import SteamWidget from './steam-widget' // REMOVE THIS LINE

// Mock child components to isolate the test
jest.mock('../call-to-action', () => props => <div data-testid='CallToAction'>{props.title}</div>)
jest.mock('../recent-posts/post-card', () => props => <div data-testid='PostCard'>{props.title}</div>)
jest.mock('../profile-metrics-badge', () => props => (
  <div data-testid='ProfileMetricsBadge'>{JSON.stringify(props.metrics)}</div>
))
jest.mock('../widget', () => props => <div data-testid='Widget'>{props.children}</div>)
jest.mock('../widget-header', () => props => <div data-testid='WidgetHeader'>{props.children}</div>)
jest.mock('../../lazy-load', () => ({ children }) => <>{children}</>)

// Mock hooks and selectors
jest.mock('../../../hooks/use-site-metadata', () => () => ({
  widgets: { steam: { url: 'https://example.com/steam-feed' } }
}))
jest.mock('../../../selectors/metadata', () => ({
  getSteamWidgetDataSource: () => 'https://example.com/steam-feed'
}))

// Move fetchDataSource mock before importing the component
let mockFetchDataSource
jest.mock('../../../actions/fetchDataSource', () => {
  mockFetchDataSource = jest.fn(() => ({ type: 'MOCK_ACTION' }))
  return mockFetchDataSource
})

const mockStore = configureMockStore([]) // no middleware

// Re-import after mocks
const SteamWidget = require('./steam-widget').default

describe('SteamWidget', () => {
  it('renders correctly with sample data', () => {
    const store = mockStore({
      widgets: {
        steam: {
          state: 'SUCCESS',
          data: {
            metrics: [{ label: 'Games Played', value: 5 }],
            profile: {
              displayName: 'Chris',
              profileURL: 'https://steamcommunity.com/id/themeuser'
            },
            collections: {
              recentlyPlayedGames: [
                {
                  id: '123',
                  displayName: 'Half-Life',
                  playTime2Weeks: 120,
                  images: { header: 'https://example.com/halflife.jpg' }
                },
                {
                  id: '456',
                  displayName: 'Portal',
                  playTime2Weeks: 45,
                  images: { header: 'https://example.com/portal.jpg' }
                }
              ],
              ownedGames: [
                {
                  id: '255710',
                  displayName: 'Cities: Skylines',
                  playTimeForever: 45441,
                  playTime2Weeks: 120,
                  images: { icon: 'https://example.com/cities-icon.jpg' }
                },
                {
                  id: '346110',
                  displayName: 'ARK: Survival Evolved',
                  playTimeForever: 16670,
                  playTime2Weeks: null,
                  images: { icon: 'https://example.com/ark-icon.jpg' }
                }
              ]
            }
          }
        }
      }
    })

    const tree = renderer
      .create(
        <Provider store={store}>
          <SteamWidget />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders loading state', () => {
    const store = mockStore({
      widgets: {
        steam: {
          state: 'LOADING'
        }
      }
    })

    const tree = renderer
      .create(
        <Provider store={store}>
          <SteamWidget />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders error state (hasFatalError)', () => {
    const store = mockStore({
      widgets: {
        steam: {
          state: 'SUCCESS',
          data: {
            metrics: [{ label: 'Games Played', value: 5 }],
            profile: {
              displayName: 'Chris',
              profileURL: 'https://steamcommunity.com/id/themeuser'
            },
            collections: {
              recentlyPlayedGames: [],
              ownedGames: []
            }
          },
          hasFatalError: true
        }
      }
    })
    const tree = renderer
      .create(
        <Provider store={store}>
          <SteamWidget />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders AI summary if present', () => {
    const store = mockStore({
      widgets: {
        steam: {
          state: 'SUCCESS',
          data: {
            aiSummary: 'This is an AI summary',
            metrics: [{ label: 'Games Played', value: 5 }],
            profile: {
              displayName: 'Chris',
              profileURL: 'https://steamcommunity.com/id/themeuser'
            },
            collections: {
              recentlyPlayedGames: [],
              ownedGames: []
            }
          }
        }
      }
    })
    const tree = renderer
      .create(
        <Provider store={store}>
          <SteamWidget />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with empty metrics', () => {
    const store = mockStore({
      widgets: {
        steam: {
          state: 'SUCCESS',
          data: {
            metrics: [],
            profile: {
              displayName: 'Chris',
              profileURL: 'https://steamcommunity.com/id/themeuser'
            },
            collections: {
              recentlyPlayedGames: [],
              ownedGames: []
            }
          }
        }
      }
    })
    const tree = renderer
      .create(
        <Provider store={store}>
          <SteamWidget />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders with empty recentlyPlayedGames and ownedGames', () => {
    const store = mockStore({
      widgets: {
        steam: {
          state: 'SUCCESS',
          data: {
            metrics: [{ label: 'Games Played', value: 5 }],
            profile: {
              displayName: 'Chris',
              profileURL: 'https://steamcommunity.com/id/themeuser'
            },
            collections: {
              recentlyPlayedGames: [],
              ownedGames: []
            }
          }
        }
      }
    })
    const tree = renderer
      .create(
        <Provider store={store}>
          <SteamWidget />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls fetchDataSource when isLoading is true', async () => {
    mockFetchDataSource.mockClear()
    // Use a real Redux store for this test
    const initialState = {
      widgets: {
        steam: {
          state: 'INIT',
          data: {
            metrics: [],
            profile: {},
            collections: { recentlyPlayedGames: [], ownedGames: [] }
          }
        }
      }
    }
    // Minimal reducer to support the selectors
    function widgets(state = initialState.widgets) {
      return state
    }
    const store = configureRealStore({ reducer: { widgets } })
    await act(async () => {
      renderer.create(
        <Provider store={store}>
          <SteamWidget />
        </Provider>
      )
    })
    expect(mockFetchDataSource).toHaveBeenCalled()
  })
})
