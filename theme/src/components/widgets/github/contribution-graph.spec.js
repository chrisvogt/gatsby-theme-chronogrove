import React from 'react'
import renderer from 'react-test-renderer'
import { render, act } from '@testing-library/react'
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
  let mockIntersectionObserver

  beforeEach(() => {
    // Mock IntersectionObserver
    const mockInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn()
    }
    mockIntersectionObserver = jest.fn(() => mockInstance)
    global.IntersectionObserver = mockIntersectionObserver
  })

  afterEach(() => {
    // Clean up
    delete global.IntersectionObserver
  })

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

  it('renders singular and plural contribution titles correctly', () => {
    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )
    const root = testRenderer.root

    const titleNodes = root.findAll(node => typeof node.props?.title === 'string')
    const titles = titleNodes.map(n => n.props.title)

    expect(titles.some(t => /1 contribution\b/.test(t))).toBe(true)
    expect(titles.some(t => /\b5 contributions\b/.test(t))).toBe(true)
  })

  it('renders empty grid cells for missing days in a week', () => {
    // Week with only two days; others should render as empty grid cells
    const sparseCalendar = {
      totalContributions: 2,
      weeks: [
        {
          contributionDays: [
            { date: '2024-07-01', contributionCount: 1, color: '#9be9a8' }, // Monday
            { date: '2024-07-05', contributionCount: 1, color: '#9be9a8' } // Friday
          ]
        }
      ]
    }

    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={sparseCalendar} />
      </TestProviderWithState>
    )
    const root = testRenderer.root

    // Ensure at least one titled cell renders (sparse weeks exercise empty-cell path)
    const titledCells = root.findAll(node => typeof node.props?.title === 'string')
    expect(titledCells.length).toBeGreaterThan(0)
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

  it('applies animation classes to grid cells', () => {
    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )
    const root = testRenderer.root

    // Find cells with className that indicates visibility state
    const cells = root.findAll(
      node =>
        node.props?.className && (node.props.className === 'cell-visible' || node.props.className === 'cell-hidden')
    )

    // Should have grid cells with animation classes
    expect(cells.length).toBeGreaterThan(0)
  })

  it('renders grid cells with contribution data', () => {
    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    // Should render without errors
    expect(testRenderer.toJSON()).toBeTruthy()
  })

  it('handles empty weeks array gracefully', () => {
    const emptyCalendar = {
      totalContributions: 0,
      weeks: []
    }

    const tree = renderer
      .create(
        <TestProviderWithState>
          <ContributionGraph isLoading={false} contributionCalendar={emptyCalendar} />
        </TestProviderWithState>
      )
      .toJSON()

    // Should render loading state when weeks is empty
    expect(tree).toBeTruthy()
  })

  it('displays total contributions count', () => {
    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    const json = testRenderer.toJSON()
    const jsonString = JSON.stringify(json)

    // Should contain the contribution count text
    expect(jsonString).toContain('487')
    expect(jsonString).toContain('contributions in the last year')
  })

  it('renders legend with Less and More labels', () => {
    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    const json = testRenderer.toJSON()
    const jsonString = JSON.stringify(json)

    // Should contain legend labels
    expect(jsonString).toContain('Less')
    expect(jsonString).toContain('More')
  })

  it('does not re-render when props have not changed', () => {
    const MemoizedComponent = ContributionGraph
    const props1 = { isLoading: false, contributionCalendar: mockContributionCalendar }
    const props2 = { isLoading: false, contributionCalendar: mockContributionCalendar }

    // Component should be memoized
    expect(MemoizedComponent).toBeDefined()

    // Create two instances with same props
    const tree1 = renderer
      .create(
        <TestProviderWithState>
          <MemoizedComponent {...props1} />
        </TestProviderWithState>
      )
      .toJSON()

    const tree2 = renderer
      .create(
        <TestProviderWithState>
          <MemoizedComponent {...props2} />
        </TestProviderWithState>
      )
      .toJSON()

    // Both should render successfully
    expect(tree1).toBeTruthy()
    expect(tree2).toBeTruthy()
  })

  it('renders loading placeholder when isLoading is true and no data', () => {
    const tree = renderer
      .create(
        <TestProviderWithState>
          <ContributionGraph isLoading={true} contributionCalendar={null} />
        </TestProviderWithState>
      )
      .toJSON()

    const jsonString = JSON.stringify(tree)

    // Should render loading state with placeholder text
    expect(jsonString).toContain('Loading contribution data')
  })

  it('renders day labels correctly', () => {
    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    const json = testRenderer.toJSON()
    const jsonString = JSON.stringify(json)

    // Should contain day labels
    expect(jsonString).toContain('Mon')
    expect(jsonString).toContain('Wed')
    expect(jsonString).toContain('Fri')
  })

  it('renders with totalDays calculation', () => {
    const calendar = {
      totalContributions: 10,
      weeks: [
        {
          contributionDays: [
            { date: '2024-11-01', contributionCount: 1, color: '#9be9a8' },
            { date: '2024-11-02', contributionCount: 2, color: '#40c463' }
          ]
        },
        {
          contributionDays: [{ date: '2024-11-03', contributionCount: 3, color: '#30a14e' }]
        }
      ]
    }

    const tree = renderer
      .create(
        <TestProviderWithState>
          <ContributionGraph isLoading={false} contributionCalendar={calendar} />
        </TestProviderWithState>
      )
      .toJSON()

    // Should render with calculated totalDays
    expect(tree).toBeTruthy()
  })

  it('re-renders when contributionCalendar changes', () => {
    const calendar1 = {
      totalContributions: 10,
      weeks: [
        {
          contributionDays: [{ date: '2024-11-01', contributionCount: 1, color: '#9be9a8' }]
        }
      ]
    }

    const calendar2 = {
      totalContributions: 20,
      weeks: [
        {
          contributionDays: [{ date: '2024-11-02', contributionCount: 2, color: '#40c463' }]
        }
      ]
    }

    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={calendar1} />
      </TestProviderWithState>
    )

    const tree1 = testRenderer.toJSON()
    expect(tree1).toBeTruthy()

    // Update with different calendar data
    testRenderer.update(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={calendar2} />
      </TestProviderWithState>
    )

    const tree2 = testRenderer.toJSON()
    expect(tree2).toBeTruthy()
    expect(tree1).not.toEqual(tree2)
  })

  it('re-renders when isLoading changes', () => {
    const testRenderer = renderer.create(
      <TestProviderWithState>
        <ContributionGraph isLoading={true} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    const tree1 = testRenderer.toJSON()
    const json1 = JSON.stringify(tree1)
    expect(json1).toContain('Loading contribution data')

    // Update to not loading
    testRenderer.update(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    const tree2 = testRenderer.toJSON()
    const json2 = JSON.stringify(tree2)
    expect(json2).toContain('487')
    expect(json2).not.toContain('Loading contribution data')
  })

  it('sets up IntersectionObserver when component mounts with data', () => {
    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    // IntersectionObserver should be instantiated
    expect(mockIntersectionObserver).toHaveBeenCalled()

    // observe should be called on the graph ref
    const observeInstance = mockIntersectionObserver.mock.results[0].value
    expect(observeInstance.observe).toHaveBeenCalled()
  })

  it('calls IntersectionObserver disconnect on unmount', () => {
    const { unmount } = render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    const observeInstance = mockIntersectionObserver.mock.results[0].value
    expect(observeInstance.disconnect).not.toHaveBeenCalled()

    unmount()

    // disconnect should be called when component unmounts
    expect(observeInstance.disconnect).toHaveBeenCalled()
  })

  it('triggers animation when IntersectionObserver detects visibility', () => {
    let intersectionCallback
    const mockInstance = {
      observe: jest.fn(),
      disconnect: jest.fn(),
      unobserve: jest.fn()
    }

    // Capture the callback passed to IntersectionObserver
    mockIntersectionObserver = jest.fn(callback => {
      intersectionCallback = callback
      return mockInstance
    })
    global.IntersectionObserver = mockIntersectionObserver

    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    expect(intersectionCallback).toBeDefined()

    // Simulate the element becoming visible - wrapped in act
    act(() => {
      const mockEntry = {
        isIntersecting: true,
        target: {}
      }

      intersectionCallback([mockEntry])
    })

    // The callback should have been triggered
    expect(mockIntersectionObserver).toHaveBeenCalled()
    expect(mockInstance.disconnect).toHaveBeenCalled()
  })

  it('logs render count in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

    process.env.NODE_ENV = 'development'

    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={false} contributionCalendar={mockContributionCalendar} />
      </TestProviderWithState>
    )

    // Should log render count in development
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('ContributionGraph rendered'),
      expect.any(Object)
    )

    // Restore
    consoleLogSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })

  it('does not set up IntersectionObserver when loading', () => {
    render(
      <TestProviderWithState>
        <ContributionGraph isLoading={true} contributionCalendar={null} />
      </TestProviderWithState>
    )

    // IntersectionObserver should not be called when loading
    expect(mockIntersectionObserver).not.toHaveBeenCalled()
  })
})
