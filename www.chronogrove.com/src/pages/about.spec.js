import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AboutPage, { Head } from './about'
import { ThemeUIProvider } from 'theme-ui'

// Mock Layout component
jest.mock('gatsby-theme-chronogrove/src/components/layout', () => ({ children }) => (
  <div data-testid='layout'>{children}</div>
))

// Mock SEO component
jest.mock('gatsby-theme-chronogrove/src/components/seo', () => () => <div data-testid='seo' />)

// Mock Theme
const mockTheme = {
  colors: {
    'panel-background': '#f0f0f0'
  }
}

// Helper function to render with theme
const renderWithTheme = component => render(<ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>)

describe('AboutPage', () => {
  it('renders without crashing', () => {
    renderWithTheme(<AboutPage />)
    expect(screen.getByTestId('layout')).toBeInTheDocument()
  })

  it('displays the about heading', () => {
    renderWithTheme(<AboutPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'About Chronogrove' })).toBeInTheDocument()
  })

  it('displays theme description content', () => {
    renderWithTheme(<AboutPage />)
    expect(screen.getByText(/Chronogrove is a modern Gatsby theme/)).toBeInTheDocument()
    expect(screen.getByText(/Dashboard Homepage/)).toBeInTheDocument()
    expect(screen.getByText(/Technical Excellence/)).toBeInTheDocument()
  })

  it('includes GitHub repository link', () => {
    renderWithTheme(<AboutPage />)
    const link = screen.getByRole('link', { name: /GitHub repository/i })
    expect(link).toHaveAttribute('href', 'https://github.com/themeuser/gatsby-theme-chronogrove')
  })

  it('includes all key feature sections', () => {
    renderWithTheme(<AboutPage />)
    expect(screen.getByText(/Key Features/)).toBeInTheDocument()
    expect(screen.getByText(/Content Management/)).toBeInTheDocument()
    expect(screen.getByText(/Design System/)).toBeInTheDocument()
    expect(screen.getByText(/Getting Started/)).toBeInTheDocument()
  })
})

describe('AboutPage Head', () => {
  it('renders the Head component', () => {
    render(<Head />)
    expect(screen.getByTestId('seo')).toBeInTheDocument()
  })
})
