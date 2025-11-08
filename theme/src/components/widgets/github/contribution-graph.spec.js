import React from 'react'
import renderer from 'react-test-renderer'
import ContributionGraph from './contribution-graph'
import { TestProviderWithState } from '../../../testUtils'

const mockContributionCalendar = {
  totalContributions: 487,
  weeks: [
    {
      contributionDays: [
        {
          date: '2024-11-03',
          contributionCount: 0,
          color: '#ebedf0'
        },
        {
          date: '2024-11-04',
          contributionCount: 1,
          color: '#9be9a8'
        },
        {
          date: '2024-11-05',
          contributionCount: 5,
          color: '#40c463'
        },
        {
          date: '2024-11-06',
          contributionCount: 0,
          color: '#ebedf0'
        },
        {
          date: '2024-11-07',
          contributionCount: 0,
          color: '#ebedf0'
        },
        {
          date: '2024-11-08',
          contributionCount: 0,
          color: '#ebedf0'
        },
        {
          date: '2024-11-09',
          contributionCount: 0,
          color: '#ebedf0'
        }
      ]
    }
  ]
}

describe('ContributionGraph Component', () => {
  it('matches the loading state snapshot', () => {
    const tree = renderer
      .create(
        <TestProviderWithState>
          <ContributionGraph isLoading={true} contributionCalendar={null} />
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches the empty state snapshot', () => {
    const tree = renderer
      .create(
        <TestProviderWithState>
          <ContributionGraph isLoading={false} contributionCalendar={null} />
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches the successful state snapshot', () => {
    const tree = renderer
      .create(
        <TestProviderWithState>
          <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
        </TestProviderWithState>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('omits the last month label (matches GitHub behavior)', () => {
    const multiMonthCalendar = {
      totalContributions: 3,
      weeks: [
        {
          contributionDays: [{ date: '2024-01-01', contributionCount: 1, color: '#9be9a8' }]
        },
        {
          contributionDays: [{ date: '2024-02-01', contributionCount: 1, color: '#40c463' }]
        },
        {
          contributionDays: [{ date: '2024-03-01', contributionCount: 1, color: '#30a14e' }]
        }
      ]
    }

    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={multiMonthCalendar} />
      </TestProviderWithState>
    )

    const root = testRenderer.root

    const monthTexts = ['Jan', 'Feb', 'Mar']
    const renderedMonthLabelNodes = root.findAll(
      node =>
        Array.isArray(node.children) &&
        node.children.some(child => typeof child === 'string' && monthTexts.includes(child))
    )

    // Collect all month strings from matched nodes
    const labels = renderedMonthLabelNodes.flatMap(n =>
      n.children.filter(child => typeof child === 'string' && monthTexts.includes(child))
    )

    // Expect the last month to be omitted; at least the first should render
    expect(labels).toContain('Jan')
    expect(labels).not.toContain('Mar')
  })
})
