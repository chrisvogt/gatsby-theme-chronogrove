import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import chronogroveTheme from './theme.js'
import ProfileMetricsBadge from './profile-metrics-badge.js'

describe('ProfileMetricsBadge', () => {
  it('uses default props when none are passed', () => {
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ProfileMetricsBadge />
      </ThemeUIProvider>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('matches the snapshot with metrics', () => {
    const metrics = [
      { displayName: 'Followers', id: 'followers', value: 10 },
      { displayName: 'Following', id: 'following', value: 20 }
    ]
    const { asFragment } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ProfileMetricsBadge metrics={metrics} />
      </ThemeUIProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders metrics with value and displayName', () => {
    const metrics = [{ displayName: 'Friends', id: 'friends', value: 5 }]
    render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ProfileMetricsBadge metrics={metrics} />
      </ThemeUIProvider>
    )
    expect(screen.getByText('5 Friends')).toBeInTheDocument()
  })

  it('uses compact spacing when compact is true', () => {
    const metrics = [{ displayName: 'Count', id: 'count', value: 1 }]
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ProfileMetricsBadge compact metrics={metrics} />
      </ThemeUIProvider>
    )
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('1 Count')).toBeInTheDocument()
  })

  it('shows placeholder badges when isLoading', () => {
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ProfileMetricsBadge isLoading metrics={[]} />
      </ThemeUIProvider>
    )
    const wrapper = container.querySelector('[class*="css-"]')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.children).toHaveLength(2)
  })

  it('handles non-array metrics with default empty array', () => {
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ProfileMetricsBadge metrics={null} />
      </ThemeUIProvider>
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('treats non-array metrics as empty when not loading', () => {
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ProfileMetricsBadge metrics='nope' />
      </ThemeUIProvider>
    )
    expect(container.firstChild).toBeInTheDocument()
    expect(container.textContent).toBe('')
  })

  it('renders nothing when metrics is an empty array', () => {
    const { container } = render(
      <ThemeUIProvider theme={chronogroveTheme}>
        <ProfileMetricsBadge metrics={[]} />
      </ThemeUIProvider>
    )
    expect(container.textContent).toBe('')
  })
})
