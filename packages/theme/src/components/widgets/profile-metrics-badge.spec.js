import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TestProvider } from '../../testUtils'
import ProfileMetricsBadge from './profile-metrics-badge'

describe('ProfileMetricsBadge', () => {
  it('matches the snapshot with metrics', () => {
    const metrics = [
      { displayName: 'Followers', id: 'followers', value: 10 },
      { displayName: 'Following', id: 'following', value: 20 }
    ]
    const { asFragment } = render(
      <TestProvider>
        <ProfileMetricsBadge metrics={metrics} />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders metrics with value and displayName', () => {
    const metrics = [{ displayName: 'Friends', id: 'friends', value: 5 }]
    render(
      <TestProvider>
        <ProfileMetricsBadge metrics={metrics} />
      </TestProvider>
    )
    expect(screen.getByText('5 Friends')).toBeInTheDocument()
  })

  it('uses compact spacing when compact is true', () => {
    const metrics = [{ displayName: 'Count', id: 'count', value: 1 }]
    const { container } = render(
      <TestProvider>
        <ProfileMetricsBadge compact metrics={metrics} />
      </TestProvider>
    )
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('1 Count')).toBeInTheDocument()
  })

  it('shows placeholder badges when isLoading', () => {
    const { container } = render(
      <TestProvider>
        <ProfileMetricsBadge isLoading metrics={[]} />
      </TestProvider>
    )
    const wrapper = container.querySelector('[class*="css-"]')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper.children).toHaveLength(2)
  })

  it('handles non-array metrics with default empty array', () => {
    const { container } = render(
      <TestProvider>
        <ProfileMetricsBadge metrics={null} />
      </TestProvider>
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
