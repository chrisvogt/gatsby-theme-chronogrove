import React from 'react'
import renderer from 'react-test-renderer'
import { TestProviderWithState } from '../../../testUtils'

// Mock dark mode before importing the component
jest.mock('../../../helpers/isDarkMode', () => jest.fn(() => true))

// Import after mock so the component sees dark mode active
const ContributionGraph = require('./contribution-graph').default

describe('ContributionGraph Component (dark mode)', () => {
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

    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={calendar} />
      </TestProviderWithState>
    )
    const root = testRenderer.root

    // Find grid cells by title; target zero-contribution cell(s)
    const zeroCells = root.findAll(
      node => typeof node.props?.title === 'string' && node.props.title.startsWith('0 contributions')
    )
    expect(zeroCells.length).toBeGreaterThan(0)

    // Ensure zero-contribution cells are rendered under dark mode without error
    expect(zeroCells.length).toBeGreaterThan(0)
  })
})
