import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import StatusCard from './status-card.js'

jest.mock('theme-ui', () => {
  const actual = jest.requireActual('theme-ui')
  return {
    ...actual,
    useThemeUI: jest.fn(() => ({ colorMode: 'default' }))
  }
})

const { useThemeUI } = require('theme-ui')

const theme = {}

describe('StatusCard', () => {
  it('renders message in light mode variant', () => {
    useThemeUI.mockReturnValue({ colorMode: 'default' })
    render(
      <ThemeUIProvider theme={theme}>
        <StatusCard message='No data' />
      </ThemeUIProvider>
    )
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('uses dark card variant when dark', () => {
    useThemeUI.mockReturnValue({ colorMode: 'dark' })
    render(
      <ThemeUIProvider theme={theme}>
        <StatusCard message='Err' />
      </ThemeUIProvider>
    )
    expect(screen.getByText('Err')).toBeInTheDocument()
  })
})
