import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'
import { TestProvider } from '../../../testUtils'
import AiSummary from './ai-summary'

// Mock parseSafeHtml to return React elements for testing
jest.mock('../../../helpers/safeHtmlParser', () => ({
  parseSafeHtml: html => {
    if (!html) return null

    // Simple HTML to React element conversion for testing
    if (html.includes('<p>')) {
      const content = html.replace(/<\/?p[^>]*>/g, '')
      return content
    }

    return html
  }
}))

// Mock FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid={`icon-${icon.iconName}`}>{icon.iconName}</span>
}))

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
const mockUnobserve = jest.fn()
let observerCallback = null

mockIntersectionObserver.mockImplementation(callback => {
  observerCallback = callback
  return {
    observe: jest.fn(),
    unobserve: mockUnobserve,
    disconnect: jest.fn()
  }
})

window.IntersectionObserver = mockIntersectionObserver

const renderWithTheme = (component, options = {}) => {
  const { theme } = options
  if (theme) {
    return render(<ThemeUIProvider theme={theme}>{component}</ThemeUIProvider>)
  }
  return render(<TestProvider>{component}</TestProvider>)
}

describe('AiSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    observerCallback = null
    mockUnobserve.mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const triggerIntersection = (isIntersecting = true) => {
    if (observerCallback) {
      observerCallback([{ isIntersecting }])
    }
  }

  describe('Component rendering', () => {
    it('renders nothing when aiSummary is null', () => {
      const { container } = renderWithTheme(<AiSummary aiSummary={null} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders nothing when aiSummary is undefined', () => {
      const { container } = renderWithTheme(<AiSummary aiSummary={undefined} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders nothing when aiSummary is empty string', () => {
      const { container } = renderWithTheme(<AiSummary aiSummary={''} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders the component with single paragraph', async () => {
      const aiSummary = '<p>This is a test summary with one paragraph.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.getByText('This is a test summary with one paragraph.')).toBeInTheDocument()
      expect(screen.queryByText(/Generated with Claude Sonnet 4\.6/)).not.toBeInTheDocument()
    })

    it('renders the component with multiple paragraphs', async () => {
      const aiSummary = '<p>First paragraph.</p><p>Second paragraph.</p><p>Third paragraph.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.getByText('First paragraph.')).toBeInTheDocument()
      expect(screen.queryByText(/Generated with Claude Sonnet 4\.6/)).not.toBeInTheDocument()
      expect(screen.getByText('Show More')).toBeInTheDocument()
    })

    it('does not show Read More button when there is only one paragraph', async () => {
      const aiSummary = '<p>Single paragraph only.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.queryByText('Show More')).not.toBeInTheDocument()
      expect(screen.queryByText('Show Less')).not.toBeInTheDocument()
    })

    it('renders summary body with minimal theme', async () => {
      const aiSummary = '<p>Fallback theme test.</p>'
      const minimalTheme = { colors: {} }

      renderWithTheme(<AiSummary aiSummary={aiSummary} />, { theme: minimalTheme })

      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.getByText('Fallback theme test.')).toBeInTheDocument()
      expect(screen.queryByText(/Generated with Claude Sonnet 4\.6/)).not.toBeInTheDocument()
    })
  })

  describe('Expand/Collapse functionality', () => {
    it('expands and shows remaining paragraphs when Read More is clicked', async () => {
      const aiSummary = '<p>First paragraph.</p><p>Second paragraph.</p><p>Third paragraph.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      const showMoreButton = screen.getByText('Show More')
      fireEvent.click(showMoreButton)

      expect(screen.getByText('Show Less')).toBeInTheDocument()
      expect(screen.getByText(/Generated with Claude Sonnet 4\.6 \(AI\)/)).toBeInTheDocument()
    })

    it('appends sync date to attribution when aiSummarySyncedAt is set', async () => {
      const aiSummary = '<p>First paragraph.</p><p>Second paragraph.</p><p>Third paragraph.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} aiSummarySyncedAt='2020-03-20T12:00:00.000Z' />)

      await act(async () => {
        triggerIntersection(true)
      })

      fireEvent.click(screen.getByText('Show More'))

      expect(screen.getByText(/Synced/)).toBeInTheDocument()
      expect(screen.getByText(/2020/)).toBeInTheDocument()
    })

    it('collapses and hides remaining paragraphs when Show Less is clicked', async () => {
      const aiSummary = '<p>First paragraph.</p><p>Second paragraph.</p><p>Third paragraph.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      const showMoreButton = screen.getByText('Show More')
      fireEvent.click(showMoreButton)

      const showLessButton = screen.getByText('Show Less')
      fireEvent.click(showLessButton)

      expect(screen.getByText('Show More')).toBeInTheDocument()
      expect(screen.queryByText(/Generated with Claude Sonnet 4\.6/)).not.toBeInTheDocument()
    })
  })

  describe('IntersectionObserver behavior', () => {
    it('uses IntersectionObserver when available', async () => {
      const aiSummary = '<p>Test content.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      // Verify IntersectionObserver was called
      expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.1,
        rootMargin: '50px'
      })
    })

    it('triggers visibility when intersection observer fires', async () => {
      const aiSummary = '<p>Test content.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      // Simulate intersection
      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.getByText('Test content.')).toBeInTheDocument()
    })

    it('does not trigger visibility when intersection observer fires with false', async () => {
      const aiSummary = '<p>Test content.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      // Simulate no intersection
      await act(async () => {
        triggerIntersection(false)
      })

      expect(screen.queryByText('Test content.')).not.toBeInTheDocument()
    })

    it('unmounts without throwing (effect cleanup runs)', async () => {
      const aiSummary = '<p>Unmount test.</p>'
      const { unmount } = renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      // Trigger intersection to ensure observer is created and ref is observed
      await act(async () => {
        triggerIntersection(true)
      })

      // Unmount triggers cleanup - the cleanup function runs (covers return () => { ... } and unobserve branch when ref is set)
      await expect(
        act(() => {
          unmount()
        })
      ).resolves.not.toThrow()
    })

    it('content becomes visible when in view (no slide-open delay)', async () => {
      const aiSummary = '<p>First paragraph.</p><p>Second paragraph.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.getByText('First paragraph.')).toBeInTheDocument()
      expect(screen.getByText('Show More')).toBeInTheDocument()
    })
  })

  describe('Fallback behavior without IntersectionObserver', () => {
    beforeEach(() => {
      // Remove IntersectionObserver
      delete window.IntersectionObserver
    })

    afterEach(() => {
      // Restore IntersectionObserver
      window.IntersectionObserver = mockIntersectionObserver
    })

    it('falls back to immediate visibility when IntersectionObserver is not available', async () => {
      const aiSummary = '<p>Test content.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {})

      expect(screen.getByText('Test content.')).toBeInTheDocument()
    })
  })

  describe('Icon and styling', () => {
    it('does not use a robot icon in the attribution line', async () => {
      const aiSummary = '<p>First.</p><p>Second.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      fireEvent.click(screen.getByText('Show More'))

      expect(screen.getByText(/Generated with Claude Sonnet 4\.6 \(AI\)/)).toBeInTheDocument()
      expect(screen.queryByTestId('icon-robot')).not.toBeInTheDocument()
    })

    it('renders chevron icons in Read More button', async () => {
      const aiSummary = '<p>First paragraph.</p><p>Second paragraph.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument()

      // Click to expand
      fireEvent.click(screen.getByText('Show More'))
      expect(screen.getByTestId('icon-chevron-up')).toBeInTheDocument()
    })
  })

  describe('Content parsing', () => {
    it('handles content with mixed paragraph tags', async () => {
      const aiSummary = '<p>First paragraph.</p><p>Second paragraph.</p><p>Third paragraph.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.getByText('First paragraph.')).toBeInTheDocument()
      expect(screen.getByText('Show More')).toBeInTheDocument()

      // Expand to see remaining content
      fireEvent.click(screen.getByText('Show More'))
      expect(screen.getByText('Show Less')).toBeInTheDocument()
    })

    it('handles content with no paragraph tags', async () => {
      const aiSummary = 'Plain text without paragraph tags'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.getByText('Plain text without paragraph tags')).toBeInTheDocument()
    })
  })

  describe('Visibility when in view', () => {
    it('shows content when in view (no delay)', async () => {
      const aiSummary = '<p>Test content.</p>'

      renderWithTheme(<AiSummary aiSummary={aiSummary} />)

      expect(screen.queryByText('Test content.')).not.toBeInTheDocument()

      await act(async () => {
        triggerIntersection(true)
      })

      expect(screen.getByText('Test content.')).toBeInTheDocument()
    })
  })
})
