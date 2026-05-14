import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import NotFoundPage from './404'
import { ThemeUIProvider } from 'theme-ui'

// Mock Layout component
jest.mock('../components/layout', () => ({ children }) => <div className='layoutMock'>{children}</div>)

// Mock loadable Lottie component
jest.mock('lottie-react-web', () => {
  const React = require('react')
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => (
      <div ref={ref} data-testid='lottie-animation'>
        Lottie Animation
      </div>
    ))
  }
})

// Mock Theme
const mockTheme = {
  colors: {
    'panel-background': '#f0f0f0'
  }
}

// Helper function to render with theme
const renderWithTheme = component => render(<ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>)

describe('404 Page', () => {
  it('renders correctly', async () => {
    await waitFor(() => renderWithTheme(<NotFoundPage />))

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
    expect(screen.getByText(/Lost in space\?/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/')
  })

  it('renders the Lottie animation after hydration', async () => {
    renderWithTheme(<NotFoundPage />)
    expect(await screen.findByTestId('lottie-animation')).toBeInTheDocument()
  })

  it('renders the Layout component', async () => {
    await waitFor(() => renderWithTheme(<NotFoundPage />))

    const layoutDiv = screen.getByText('Lottie Animation').closest('.layoutMock')
    expect(layoutDiv).toBeInTheDocument()
  })
})
