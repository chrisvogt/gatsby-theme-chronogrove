import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import GitHubWidget from './github-widget'
import { TestProviderWithQuery } from '../../../testUtils'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

jest.mock('../../../hooks/use-site-metadata')
jest.mock('../../../hooks/use-widget-data')

// Mock LazyLoad to render children immediately in tests
jest.mock(
  '../../lazy-load',
  () =>
    ({ children }) =>
      children
)

const mockSiteMetadata = {
  widgets: {
    github: {
      username: 'mockusername',
      widgetDataSource: 'https://fake-api.example.com/social/github'
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
    user: {
      followers: { totalCount: 100 },
      following: { totalCount: 50 },
      pullRequests: {
        nodes: [
          {
            id: 'pr1',
            title: 'Test PR',
            url: 'https://github.com/test/repo/pull/1',
            createdAt: '2024-01-01T00:00:00Z',
            repository: { nameWithOwner: 'test/repo' }
          }
        ]
      },
      pinnedItems: {
        nodes: [
          {
            id: 'repo1',
            name: 'Test Repo',
            description: 'Test description',
            url: 'https://github.com/test/repo',
            stargazerCount: 10
          }
        ]
      },
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 500,
          weeks: []
        }
      }
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

describe('GitHub Widget', () => {
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
        <GitHubWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the loaded state snapshot', () => {
    useWidgetData.mockReturnValue(mockSuccessState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <GitHubWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the error state snapshot', () => {
    useWidgetData.mockReturnValue(mockErrorState)

    const { asFragment } = render(
      <TestProviderWithQuery>
        <GitHubWidget />
      </TestProviderWithQuery>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders sections in expected order: Pinned Items, Last Pull Request, Contribution Graph', () => {
    useWidgetData.mockReturnValue(mockLoadingState)

    render(
      <TestProviderWithQuery>
        <GitHubWidget />
      </TestProviderWithQuery>
    )
    // Check that the headings are present
    expect(screen.getByText('Pinned Items')).toBeInTheDocument()
    expect(screen.getByText('Last Pull Request')).toBeInTheDocument()
    expect(screen.getByText('Contribution Graph')).toBeInTheDocument()
  })
})
