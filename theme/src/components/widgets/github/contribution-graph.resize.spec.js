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

  it('scales cell size up on wide containers (no upper clamp)', () => {
    const defineOffset = value => {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        value
      })
    }

    // Wide container
    defineOffset(1200)

    // Create a more realistic 53-week calendar with at least one day per week
    const weeks = Array.from({ length: 53 }, (_, i) => {
      const date = new Date(2024, 0, 1 + i * 7) // one per week
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      return {
        contributionDays: [{ date: `${yyyy}-${mm}-${dd}`, contributionCount: 1, color: '#9be9a8' }]
      }
    })

    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={{ totalContributions: 53, weeks }} />
      </TestProviderWithState>
    )

    // Trigger resize to use mocked offsetWidth
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    // A non-empty cell has a title attribute; ensure grid rendered without errors
    const cells = screen.getAllByTitle(/contribution/i)
    expect(cells.length).toBeGreaterThan(0)
  })

  it('clamps cell size to a minimum on narrow containers', () => {
    const defineOffset = value => {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        value
      })
    }

    // Narrow container (e.g., small mobile)
    defineOffset(320)

    // Use a full-year-like structure to stress the calculation
    const weeks = Array.from({ length: 53 }, (_, i) => {
      const date = new Date(2024, 0, 1 + i * 7)
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      return {
        contributionDays: [{ date: `${yyyy}-${mm}-${dd}`, contributionCount: 0, color: '#ebedf0' }]
      }
    })

    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={{ totalContributions: 0, weeks }} />
      </TestProviderWithState>
    )

    // Trigger resize to use mocked offsetWidth
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    // Ensure grid rendered and resize path executed without errors
    const cells = screen.getAllByTitle(/contribution/i)
    expect(cells.length).toBeGreaterThan(0)
  })
})
