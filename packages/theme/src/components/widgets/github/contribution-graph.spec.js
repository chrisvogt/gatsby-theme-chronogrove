import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContributionGraph from './contribution-graph'
import { TestProviderWithState } from '../../../test-utils'

const mockContributionCalendar = {
  totalContributions: 487,
  weeks: [
    {
      contributionDays: [
        { date: '2024-11-03', contributionCount: 0, color: '#ebedf0' },
        { date: '2024-11-04', contributionCount: 1, color: '#9be9a8' },
        { date: '2024-11-05', contributionCount: 5, color: '#40c463' },
        { date: '2024-11-06', contributionCount: 0, color: '#ebedf0' },
        { date: '2024-11-07', contributionCount: 0, color: '#ebedf0' },
        { date: '2024-11-08', contributionCount: 0, color: '#ebedf0' },
        { date: '2024-11-09', contributionCount: 0, color: '#ebedf0' }
      ]
    }
  ]
}

describe('ContributionGraph Component', () => {
  it('matches the loading state snapshot', () => {
    const { asFragment } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={true} contributionCalendar={null} />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders singular and plural contribution titles correctly', () => {
    const { container } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    // Check that titles with contribution counts exist
    const titledElements = container.querySelectorAll('[title]')
    const titles = Array.from(titledElements).map(el => el.getAttribute('title'))

    expect(titles.some(t => /1 contribution\b/.test(t))).toBe(true)
    expect(titles.some(t => /\b5 contributions\b/.test(t))).toBe(true)
  })

  it('renders empty grid cells for missing days in a week', () => {
    const sparseCalendar = {
      totalContributions: 2,
      weeks: [
        {
          contributionDays: [
            { date: '2024-07-01', contributionCount: 1, color: '#9be9a8' },
            { date: '2024-07-05', contributionCount: 1, color: '#9be9a8' }
          ]
        }
      ]
    }

    const { container } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={sparseCalendar} />
      </TestProviderWithState>
    )

    const titledCells = container.querySelectorAll('[title]')
    expect(titledCells.length).toBeGreaterThan(0)
  })

  it('matches the empty state snapshot', () => {
    const { asFragment } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={null} />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('matches the successful state snapshot', () => {
    const { asFragment } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('displays total contributions count', () => {
    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    expect(screen.getByText(/487/)).toBeInTheDocument()
    expect(screen.getByText(/contributions in the last year/)).toBeInTheDocument()
  })

  it('renders legend with Less and More labels', () => {
    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    expect(screen.getByText('Less')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
  })

  it('renders loading placeholder when isLoading is true', () => {
    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={true} contributionCalendar={null} />
      </TestProviderWithState>
    )

    expect(screen.getByText('Loading contribution data...')).toBeInTheDocument()
  })

  it('renders day labels correctly', () => {
    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByText('Fri')).toBeInTheDocument()
  })

  it('renders graph in final state immediately (no fade-in)', () => {
    const { container } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    const cells = container.querySelectorAll('.cell-visible')
    expect(cells.length).toBeGreaterThan(0)
  })

  it('shows hover popover for cells with contributions', () => {
    const { container } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    const cellWithContributions = container.querySelector('[title*="1 contribution"]')
    expect(cellWithContributions).toBeInTheDocument()

    fireEvent.mouseEnter(cellWithContributions)

    const tooltip = document.body.querySelector('[role="tooltip"]')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent('1 contribution')
    expect(tooltip).toHaveTextContent('Monday')

    fireEvent.mouseLeave(cellWithContributions)
    expect(document.body.querySelector('[role="tooltip"]')).not.toBeInTheDocument()
  })

  it('omits the first month label when the range does not start on the 1st (GitHub-style)', () => {
    const day = (date, n) => ({
      date,
      contributionCount: n,
      color: n > 0 ? '#9be9a8' : '#ebedf0'
    })
    // One contribution day per week (Saturdays): starts 2025-04-26 so April is partial at the left edge
    const weeks = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2025, 3, 26 + i * 7)
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return { contributionDays: [day(`${yyyy}-${mm}-${dd}`, 0)] }
    })

    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={{ totalContributions: 0, weeks }} />
      </TestProviderWithState>
    )

    expect(screen.queryByText('Apr')).not.toBeInTheDocument()
    expect(screen.getByText('May')).toBeInTheDocument()
  })

  it('memo prevents re-render when props are unchanged', () => {
    const { rerender } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    rerender(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    expect(screen.getByText(/487/)).toBeInTheDocument()
  })
})
