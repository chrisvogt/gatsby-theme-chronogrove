import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import MetricCard from './metric-card.js'

jest.mock('theme-ui', () => {
  const actual = jest.requireActual('theme-ui')
  return {
    ...actual,
    useThemeUI: jest.fn(() => ({ colorMode: 'default' }))
  }
})

const { useThemeUI } = require('theme-ui')

const theme = { colors: { modes: { dark: {} } } }

describe('MetricCard', () => {
  beforeEach(() => {
    useThemeUI.mockReturnValue({ colorMode: 'default' })
  })

  it('renders value and title when not loading', () => {
    render(
      <ThemeUIProvider theme={theme}>
        <MetricCard title='Followers' value='12' />
      </ThemeUIProvider>
    )
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Followers')).toBeInTheDocument()
  })

  it('shows default loading placeholder when loading', () => {
    render(
      <ThemeUIProvider theme={theme}>
        <MetricCard title='F' value='1' loading />
      </ThemeUIProvider>
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('treats showPlaceholder as loading', () => {
    render(
      <ThemeUIProvider theme={theme}>
        <MetricCard title='F' value='1' showPlaceholder />
      </ThemeUIProvider>
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('uses metricCardDark when dark', () => {
    useThemeUI.mockReturnValue({ colorMode: 'dark' })
    render(
      <ThemeUIProvider theme={theme}>
        <MetricCard title='T' value='v' loading={false} />
      </ThemeUIProvider>
    )
    expect(screen.getByText('v')).toBeInTheDocument()
  })

  it('uses custom loadingSlot', () => {
    render(
      <ThemeUIProvider theme={theme}>
        <MetricCard title='t' value='v' loading loadingSlot={<span data-testid='slot'>wait</span>} />
      </ThemeUIProvider>
    )
    expect(screen.getByTestId('slot')).toBeInTheDocument()
  })
})
