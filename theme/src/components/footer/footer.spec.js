import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from './footer'
import { ThemeUIProvider } from 'theme-ui'
import useSiteMetadata from '../../hooks/use-site-metadata'
import useNavigationData from '../../hooks/use-navigation-data'
import { getFooterText } from '../../selectors/metadata'

jest.mock('gatsby', () => ({
  Link: ({ to, children, title, ...rest }) => (
    <a data-gatsby-link href={to} title={title} {...rest}>
      {children}
    </a>
  )
}))

jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  Link: ({ href, children, title, ...rest }) => (
    <a href={href} title={title} {...rest}>
      {children}
    </a>
  )
}))

jest.mock('../../hooks/use-site-metadata')
jest.mock('../../hooks/use-navigation-data')
jest.mock('../../selectors/metadata')
jest.mock('./profiles', () => () => <div data-testid='profiles'>Profiles</div>)

const mockTheme = {
  colors: {
    'panel-background': '#f0f0f0'
  }
}

const renderWithTheme = component => render(<ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>)

const defaultNavigation = {
  header: { left: [], home: [] },
  footer: [
    {
      path: '/rss.xml',
      slug: 'rss',
      text: 'Subscribe via RSS',
      title: 'RSS feed'
    },
    {
      path: '/privacy',
      slug: 'privacy',
      text: 'Privacy Policy',
      title: 'Privacy Policy'
    },
    {
      path: 'https://github.com/chrisvogt/gatsby-theme-chronogrove',
      slug: 'source',
      text: 'View Source',
      title: 'View source'
    },
    {
      path: 'https://api.chrisvogt.me',
      slug: 'status',
      text: 'Status',
      title: 'Status'
    }
  ]
}

describe('Footer', () => {
  beforeEach(() => {
    useSiteMetadata.mockReturnValue({
      title: 'Test Site'
    })
    useNavigationData.mockImplementation(() => defaultNavigation)
    getFooterText.mockReturnValue('Test Footer Text')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders footer text when available', () => {
    renderWithTheme(<Footer />)
    expect(screen.getByText('Test Footer Text')).toBeInTheDocument()
  })

  it('renders the Profiles component', () => {
    renderWithTheme(<Footer />)
    expect(screen.getByTestId('profiles')).toBeInTheDocument()
  })

  it('renders footer links from navigation config', () => {
    renderWithTheme(<Footer />)
    const rssLink = screen.getByText('Subscribe via RSS')
    expect(rssLink).toBeInTheDocument()
    expect(rssLink).toHaveAttribute('href', '/rss.xml')
    expect(rssLink).not.toHaveAttribute('data-gatsby-link')

    const privacyLink = screen.getByText('Privacy Policy')
    expect(privacyLink).toHaveAttribute('href', '/privacy')
    expect(privacyLink).toHaveAttribute('data-gatsby-link')

    const sourceLink = screen.getByText('View Source')
    expect(sourceLink).toHaveAttribute('href', 'https://github.com/chrisvogt/gatsby-theme-chronogrove')
    expect(sourceLink).not.toHaveAttribute('data-gatsby-link')

    const statusLink = screen.getByText('Status')
    expect(statusLink).toHaveAttribute('href', 'https://api.chrisvogt.me')
    expect(statusLink).not.toHaveAttribute('data-gatsby-link')
  })

  it('uses a plain anchor when nativeAnchor is set for a non-extension path', () => {
    useNavigationData.mockImplementation(() => ({
      header: { left: [], home: [] },
      footer: [
        {
          path: '/sitemap-index',
          slug: 'sitemap',
          text: 'Sitemap',
          title: 'Sitemap',
          nativeAnchor: true
        }
      ]
    }))
    renderWithTheme(<Footer />)
    const link = screen.getByText('Sitemap')
    expect(link).toHaveAttribute('href', '/sitemap-index')
    expect(link).not.toHaveAttribute('data-gatsby-link')
  })

  it('does not render footer text if none is available', () => {
    getFooterText.mockReturnValue(null)
    renderWithTheme(<Footer />)
    expect(screen.queryByText('Test Footer Text')).toBeNull()
  })

  it('renders nothing below Profiles when there is no footer text and no footer links', () => {
    getFooterText.mockReturnValue(null)
    useNavigationData.mockImplementation(() => ({ header: { left: [], home: [] }, footer: [] }))
    const { container } = renderWithTheme(<Footer />)
    expect(container.querySelector('#footer [href]')).toBeNull()
  })
})
