import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import SteamWidget from './steam-widget'
import { TestProviderWithQuery } from '../../../testUtils'

// Mock child components to isolate the test
jest.mock('../call-to-action', () => props => <div data-testid='CallToAction'>{props.title}</div>)
jest.mock('../recent-posts/post-card', () => props => <div data-testid='PostCard'>{props.title}</div>)
jest.mock('../profile-metrics-badge', () => props => (
  <div data-testid='ProfileMetricsBadge'>{JSON.stringify(props.metrics)}</div>
))
jest.mock('../widget', () => props => <div data-testid='Widget'>{props.children}</div>)
jest.mock('../widget-header', () => props => <div data-testid='WidgetHeader'>{props.children}</div>)
jest.mock('../../lazy-load', () => ({ children }) => <>{children}</>)

// Mock hooks
jest.mock('../../../hooks/use-site-metadata', () => () => ({
  widgets: { steam: { widgetDataSource: 'https://example.com/steam-feed' } }
}))

// Mock useWidgetData hook
jest.mock('../../../hooks/use-widget-data')
import useWidgetData from '../../../hooks/use-widget-data'

const mockLoadingState = {
  data: undefined,
  isLoading: true,
  hasFatalError: false,
  isError: false,
  error: null
}

const mockSuccessState = {
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

describe('SteamWidget', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with sample data', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <SteamWidget />
      </TestProviderWithQuery>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders loading state', () => {
    useWidgetData.mockReturnValue(mockLoadingState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <SteamWidget />
      </TestProviderWithQuery>
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders error state (hasFatalError)', () => {
    useWidgetData.mockReturnValue(mockErrorState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <SteamWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders AI summary if present', () => {
    const stateWithAiSummary = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        aiSummary: 'This is an AI summary'
      }
    }
    useWidgetData.mockReturnValue(stateWithAiSummary)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <SteamWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with empty metrics', () => {
    const stateWithEmptyMetrics = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        metrics: []
      }
    }
    useWidgetData.mockReturnValue(stateWithEmptyMetrics)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <SteamWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with empty recentlyPlayedGames and ownedGames', () => {
    const stateWithEmptyGames = {
      ...mockSuccessState,
      data: {
        ...mockSuccessState.data,
        collections: {
          recentlyPlayedGames: [],
          ownedGames: []
        }
      }
    }
    useWidgetData.mockReturnValue(stateWithEmptyGames)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <SteamWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
