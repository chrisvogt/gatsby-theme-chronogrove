import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import WidgetSection from './widget-section.js'

jest.mock('theme-ui', () => {
  const actual = jest.requireActual('theme-ui')
  return {
    ...actual,
    useThemeUI: jest.fn(() => ({ colorMode: 'default' }))
  }
})

const { useThemeUI } = require('theme-ui')

describe('WidgetSection', () => {
  it('renders children', () => {
    useThemeUI.mockReturnValue({ colorMode: 'default' })
    render(
      <ThemeUIProvider theme={{}}>
        <WidgetSection>
          <span>content</span>
        </WidgetSection>
      </ThemeUIProvider>
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('sets id when provided', () => {
    useThemeUI.mockReturnValue({ colorMode: 'default' })
    render(
      <ThemeUIProvider theme={{}}>
        <WidgetSection id='w1'>x</WidgetSection>
      </ThemeUIProvider>
    )
    expect(document.getElementById('w1')).toBeTruthy()
  })

  it('shows fatal error overlay', () => {
    useThemeUI.mockReturnValue({ colorMode: 'dark' })
    render(
      <ThemeUIProvider theme={{}}>
        <WidgetSection hasFatalError>inside</WidgetSection>
      </ThemeUIProvider>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('inside')).toBeInTheDocument()
  })

  it('uses light overlay colors in light mode', () => {
    useThemeUI.mockReturnValue({ colorMode: 'default' })
    render(
      <ThemeUIProvider theme={{}}>
        <WidgetSection hasFatalError />
      </ThemeUIProvider>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
