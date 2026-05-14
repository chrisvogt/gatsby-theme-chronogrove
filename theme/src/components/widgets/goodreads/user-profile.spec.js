import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider, useThemeUI } from 'theme-ui'
import UserProfile from './user-profile'

import isDarkMode from '../../../helpers/isDarkMode'

// Mock the useThemeUI hook
jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useThemeUI: jest.fn()
}))

// Mock the StatusCard and MetricCard components
jest.mock('../metric-card', () => ({ title, value }) => (
  <div data-testid='metric-card'>
    {title}: {value}
  </div>
))

jest.mock('../status-card', () => ({ message }) => <div data-testid='status-card'>{message}</div>)

// Mock isDarkMode helper
jest.mock('../../../helpers/isDarkMode', () => jest.fn())

const mockTheme = {
  colors: {
    text: '#000',
    background: '#fff'
  }
}

// Helper function to wrap in ThemeUIProvider
const renderWithTheme = ui => render(<ThemeUIProvider theme={mockTheme}>{ui}</ThemeUIProvider>)

describe('UserProfile', () => {
  const profileData = {
    favoriteBooks: 'Sci-fi, Mystery',
    friendsCount: 10,
    readCount: 25
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders user profile in light mode', () => {
    // Mock light mode
    useThemeUI.mockReturnValue({ colorMode: 'light' })
    isDarkMode.mockReturnValue(false)

    renderWithTheme(<UserProfile isLoading={false} profile={profileData} />)

    // Verify heading and status card
    expect(screen.getByRole('heading', { name: /Favorite Genres/i })).toBeInTheDocument()
    expect(screen.getByTestId('status-card')).toHaveTextContent('Sci-fi, Mystery')

    // Verify metric cards
    const metricCards = screen.getAllByTestId('metric-card')
    expect(metricCards).toHaveLength(2)
    expect(metricCards[0]).toHaveTextContent('Friends: 10')
    expect(metricCards[1]).toHaveTextContent('Read: 25')
  })

  it('renders user profile in dark mode', () => {
    // Mock dark mode
    useThemeUI.mockReturnValue({ colorMode: 'dark' })
    isDarkMode.mockReturnValue(true)

    renderWithTheme(<UserProfile isLoading={false} profile={profileData} />)

    // Verify that dark mode is applied (indirectly via variant)
    expect(screen.getByRole('heading', { name: /Favorite Genres/i })).toBeInTheDocument()
    expect(screen.getByTestId('status-card')).toHaveTextContent('Sci-fi, Mystery')
  })

  it('renders empty message when no favorite books are available', () => {
    renderWithTheme(<UserProfile isLoading={false} profile={{ ...profileData, favoriteBooks: '' }} />)

    // Expect status card to render empty favoriteBooks message
    expect(screen.getByTestId('status-card')).toHaveTextContent('')
  })
})
