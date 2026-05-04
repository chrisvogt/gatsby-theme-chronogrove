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
        <WidgetHeader icon={mockIcon} metrics={metrics}>
          Title
        </WidgetHeader>
      </ThemeUIProvider>
    )
    expect(getByText('12')).toBeInTheDocument()
    expect(getByText('Stars')).toBeInTheDocument()
  })

  it('renders loading metrics placeholders when metricsLoading', () => {
    render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <WidgetHeader icon={mockIcon} metrics={[]} metricsLoading>
          Title
        </WidgetHeader>
      </ThemeUIProvider>
    )
    const placeholders = screen.getAllByText('—')
    expect(placeholders).toHaveLength(2)
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

  it('renders metric chips when theme omits gray scale entries', () => {
    const themeMissingGray = {
      ...chronogroveTheme,
      colors: {
        ...chronogroveTheme.colors,
        gray: undefined
      }
    }
    render(
      <ThemeUIProvider theme={themeMissingGray}>
        <WidgetHeader icon={mockIcon} metrics={[{ displayName: 'X', id: 'x', value: 1 }]}>
          Border test
        </WidgetHeader>
      </ThemeUIProvider>
    )
    expect(screen.getByText('Border test')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('X')).toBeInTheDocument()
  })
})
