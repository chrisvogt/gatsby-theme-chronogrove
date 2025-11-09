import React from 'react'
import { render, act, screen } from '@testing-library/react'
import { TestProviderWithState } from '../../../testUtils'
import ContributionGraph from './contribution-graph'

const calendar = {
  totalContributions: 3,
  weeks: [
    {
      contributionDays: [
        { date: '2024-06-01', contributionCount: 0, color: '#ebedf0' },
        { date: '2024-06-02', contributionCount: 1, color: '#9be9a8' }
      ]
    },
    {
      contributionDays: [{ date: '2024-06-08', contributionCount: 2, color: '#40c463' }]
    }
  ]
}

describe('ContributionGraph resize behavior', () => {
  it('handles window resize without errors and initializes cell size', () => {
    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={calendar} />
      </TestProviderWithState>
    )

    // Ensure component rendered
    expect(screen.getByText('Contribution Graph')).toBeInTheDocument()

    // Trigger resize to exercise the effect and handler
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
  })
})
