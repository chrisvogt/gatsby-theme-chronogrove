import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AboutPage, { Head } from './about'
import { ThemeUIProvider } from 'theme-ui'

// Mock Layout component
jest.mock('../components/layout', () => ({ children }) => <div data-testid='layout'>{children}</div>)

// Mock SEO component
jest.mock('../components/seo', () => () => <div data-testid='seo' />)

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
    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
  })

  it('displays generic about content', () => {
    renderWithTheme(<AboutPage />)
    expect(screen.getByText(/Welcome to my personal website and digital space/)).toBeInTheDocument()
    expect(screen.getByText(/This site is built with Gatsby and powered by the Chronogrove theme/)).toBeInTheDocument()
  })

  it('includes all content sections', () => {
    renderWithTheme(<AboutPage />)
    expect(screen.getByText(/creative work with the world/)).toBeInTheDocument()
    expect(screen.getByText(/Feel free to explore the different sections/)).toBeInTheDocument()
  })
})

describe('AboutPage Head', () => {
  it('renders the Head component', () => {
    render(<Head />)
    expect(screen.getByTestId('seo')).toBeInTheDocument()
  })
})
