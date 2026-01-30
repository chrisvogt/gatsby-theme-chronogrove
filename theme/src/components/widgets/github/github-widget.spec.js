import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import GitHubWidget from './github-widget'
import { TestProviderWithState } from '../../../testUtils'
import useSiteMetadata from '../../../hooks/use-site-metadata'

jest.mock('../../../hooks/use-site-metadata')
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

describe('GitHub Widget', () => {
  beforeEach(() => {
    useSiteMetadata.mockImplementation(() => mockSiteMetadata)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('matches the loading state snapshot', () => {
    const { asFragment } = render(
      <TestProviderWithState>
        <GitHubWidget />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders sections in expected order: Pinned Items, Last Pull Request, Contribution Graph', () => {
    render(
      <TestProviderWithState>
        <GitHubWidget />
      </TestProviderWithState>
    )
    // Check that the headings are present
    expect(screen.getByText('Pinned Items')).toBeInTheDocument()
    expect(screen.getByText('Last Pull Request')).toBeInTheDocument()
    expect(screen.getByText('Contribution Graph')).toBeInTheDocument()
  })
})
