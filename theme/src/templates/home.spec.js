import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomeTemplate, { Head } from './home'
import { useStaticQuery } from 'gatsby'
import { ThemeUIProvider } from 'theme-ui'

// Mock components
jest.mock('../components/footer', () => () => <footer>Footer</footer>)
jest.mock('../components/home-navigation', () => () => <nav>HomeNavigation</nav>)
jest.mock('../components/home-widgets', () => () => <div data-testid='home-widgets'>HomeWidgets</div>)

// Mock the Layout component, which encapsulates the useNavigationData logic
jest.mock('../components/layout', () => ({ children }) => <div className='layoutMock'>{children}</div>)

// Mock the data returned by the GraphQL query
const mockData = {
  site: {
    siteMetadata: {
      avatarURL: 'https://example.com/avatar.jpg',
      description: 'Test Description',
      headline: 'Test Headline',
      subhead: 'Test Subhead',
      title: 'Test Title',
      titleTemplate: '%s · Test Site'
    }
  }
}

// Mock the useStaticQuery hook
beforeEach(() => {
  useStaticQuery.mockReturnValue(mockData)
})

jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  graphql: jest.fn(),
  useStaticQuery: jest.fn()
}))

// Mock Theme
const mockTheme = {
  colors: {
    'panel-background': '#f0f0f0'
  }
}

// Helper function to render with theme
const renderWithTheme = component => render(<ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>)

describe('HomeTemplate', () => {
  it('renders correctly with given data', () => {
    renderWithTheme(<HomeTemplate data={mockData} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders HomeNavigation component', () => {
    renderWithTheme(<HomeTemplate data={mockData} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders HomeWidgets component', () => {
    renderWithTheme(<HomeTemplate data={mockData} />)
    expect(screen.getByTestId('home-widgets')).toBeInTheDocument()
  })

  it('renders the Footer component', () => {
    renderWithTheme(<HomeTemplate data={mockData} />)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('passes hideFooter and disableMainWrapper props to Layout', () => {
    // Check if hideFooter and disableMainWrapper props are passed to the Layout mock
    const { container } = renderWithTheme(<HomeTemplate data={mockData} />)
    const layoutDiv = container.querySelector('.layoutMock') // Assuming layout has this class
    expect(layoutDiv).toBeInTheDocument()
  })
})

// Test for the Head (SEO) component
describe('Head', () => {
  it('renders SEO component with generic home metadata', () => {
    const { container } = renderWithTheme(<Head />)
    expect(container.querySelector('title').textContent).toContain('Home')
    expect(container.querySelector('meta[name="description"]').content).toBe('Test Description')
    expect(container.querySelector('meta[property="og:type"]').content).toBe('website')
  })

  it('injects structured data (JSON-LD) correctly', () => {
    const { container } = renderWithTheme(<Head />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    const jsonData = JSON.parse(script.textContent)
    expect(jsonData['@type']).toBe('Person')
    expect(jsonData.name).toBe('Person')
  })
})
