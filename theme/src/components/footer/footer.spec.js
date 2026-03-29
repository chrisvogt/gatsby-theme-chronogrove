import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from './footer'
import { ThemeUIProvider } from 'theme-ui'
import useSiteMetadata from '../../hooks/use-site-metadata' // Ensure correct import
import { getFooterText } from '../../selectors/metadata'

// Mock dependencies
jest.mock('gatsby', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a> // Mock Gatsby's Link component
}))

jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  Link: ({ href, children }) => <a href={href}>{children}</a> // Mock Theme UI's Link component
}))

jest.mock('../../hooks/use-site-metadata') // Correct mock for useSiteMetadata
jest.mock('../../selectors/metadata')
jest.mock('./profiles', () => () => <div data-testid='profiles'>Profiles</div>)

// Mock Theme
const mockTheme = {
  colors: {
    'panel-background': '#f0f0f0'
  }
}

// Helper function to render with theme
const renderWithTheme = component => render(<ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>)

describe('Footer', () => {
  beforeEach(() => {
    // Ensure the mock implementation of useSiteMetadata is correct
    useSiteMetadata.mockReturnValue({
      title: 'Test Site'
    })

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

  it('renders the Subscribe via RSS link', () => {
    renderWithTheme(<Footer />)
    const rssLink = screen.getByText('Subscribe via RSS')
    expect(rssLink).toBeInTheDocument()
    expect(rssLink).toHaveAttribute('href', '/rss.xml')
  })

  it('renders the Privacy Policy link', () => {
    renderWithTheme(<Footer />)
    const privacyLink = screen.getByText('Privacy Policy')
    expect(privacyLink).toBeInTheDocument()
    expect(privacyLink).toHaveAttribute('href', '/privacy')
  })

  it('renders the View Source link', () => {
    renderWithTheme(<Footer />)
    const sourceLink = screen.getByText('View Source')
    expect(sourceLink).toBeInTheDocument()
    expect(sourceLink).toHaveAttribute('href', 'https://github.com/chrisvogt/gatsby-theme-chronogrove')
  })

  it('renders the Status link', () => {
    renderWithTheme(<Footer />)
    const statusLink = screen.getByText('Status')
    expect(statusLink).toBeInTheDocument()
    expect(statusLink).toHaveAttribute('href', 'https://metrics.chrisvogt.me/status/')
  })

  it('does not render footer text if none is available', () => {
    getFooterText.mockReturnValue(null)
    renderWithTheme(<Footer />)
    expect(screen.queryByText('Test Footer Text')).toBeNull()
  })
})
