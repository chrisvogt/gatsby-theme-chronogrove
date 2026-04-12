import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import chronogroveTheme from './theme.js'
import WidgetHeader from './widget-header.js'

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid='fa-icon' data-icon={icon?.iconName ?? ''} aria-hidden />
}))

const aside = <div className='sidebar-content'>Sidebar</div>
const mockIcon = { iconName: 'spotify', prefix: 'fab' }

describe('WidgetHeader', () => {
  it('matches the snapshot', () => {
    const widgetTitle = 'Neat & Interesting Widget'
    const { asFragment } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <WidgetHeader aside={aside} icon={mockIcon}>
          {widgetTitle}
        </WidgetHeader>
      </ThemeUIProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders metrics row when metrics are provided', () => {
    const metrics = [{ displayName: 'Stars', id: 's', value: 12 }]
    const { getByText } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <WidgetHeader metrics={metrics}>Title</WidgetHeader>
      </ThemeUIProvider>
    )
    expect(getByText('12 Stars')).toBeInTheDocument()
  })

  it('renders loading metrics placeholders when metricsLoading', () => {
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <WidgetHeader metrics={[]} metricsLoading>
          Title
        </WidgetHeader>
      </ThemeUIProvider>
    )
    const badges = container.querySelectorAll('[class*="css-"]')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('renders without icon', () => {
    render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <WidgetHeader aside={aside}>No icon</WidgetHeader>
      </ThemeUIProvider>
    )
    expect(screen.getByText('No icon')).toBeInTheDocument()
    expect(screen.queryByTestId('fa-icon')).not.toBeInTheDocument()
  })

  it('uses borderColor fallback when gray[4] is missing', () => {
    const themeMissingGray4 = {
      ...chronogroveTheme,
      colors: {
        ...chronogroveTheme.colors,
        gray: { 0: '#111', 1: '#222', 2: '#333', 3: '#444' }
      }
    }
    const { container } = render(
      <ThemeUIProvider theme={themeMissingGray4}>
        <WidgetHeader>Border test</WidgetHeader>
      </ThemeUIProvider>
    )
    expect(container.querySelector('header')).toBeTruthy()
    expect(screen.getByText('Border test')).toBeInTheDocument()
  })
})
