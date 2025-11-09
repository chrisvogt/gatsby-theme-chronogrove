import React from 'react'
import GitHubWidget from './github-widget'
import renderer from 'react-test-renderer'
import { TestProviderWithState } from '../../../testUtils'
import useSiteMetadata from '../../../hooks/use-site-metadata'

jest.mock('../../../hooks/use-site-metadata')

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
    const tree = renderer
      .create(
        <TestProviderWithState>
          <GitHubWidget />
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders sections in expected order: Pinned Items, Last Pull Request, Contribution Graph', () => {
    const testRenderer = renderer.create(
      <TestProviderWithState>
        <GitHubWidget />
      </TestProviderWithState>
    )
    const root = testRenderer.root
    // Collect all h3 headings in the widget
    const headings = root.findAll(node => node.type === 'h3')
    const texts = headings.map(h => (Array.isArray(h.children) ? h.children.join('') : ''))
    // Filter to the three widget subsection headings
    const filtered = texts.filter(t => ['Pinned Items', 'Last Pull Request', 'Contribution Graph'].includes(t))
    expect(filtered).toEqual(['Pinned Items', 'Last Pull Request', 'Contribution Graph'])
  })
})
