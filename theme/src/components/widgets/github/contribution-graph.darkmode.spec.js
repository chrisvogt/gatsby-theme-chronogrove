import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TestProviderWithState } from '../../../testUtils'

// Mock dark mode before importing the component
jest.mock('../../../helpers/isDarkMode', () => jest.fn(() => true))

// Import after mock so the component sees dark mode active
const ContributionGraph = require('./contribution-graph').default

describe('ContributionGraph Component (dark mode)', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    const mockInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn()
    }
    global.IntersectionObserver = jest.fn(() => mockInstance)
  })

  afterEach(() => {
    delete global.IntersectionObserver
  })

  it('uses dark background color for zero-contribution days', () => {
    const calendar = {
      totalContributions: 1,
      weeks: [
        {
          contributionDays: [
            { date: '2024-10-06', contributionCount: 0, color: '#0e4429' }, // Sunday
            { date: '2024-10-07', contributionCount: 1, color: '#9be9a8' } // Monday
          ]
        }
      ]
    }

    const { container } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={calendar} />
      </TestProviderWithState>
    )

    // Find grid cells by title; target zero-contribution cell(s)
    const zeroCells = container.querySelectorAll('[title^="0 contributions"]')
    expect(zeroCells.length).toBeGreaterThan(0)
  })
})
