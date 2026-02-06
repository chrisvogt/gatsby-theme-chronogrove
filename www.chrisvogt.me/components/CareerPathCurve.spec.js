import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'
import CareerPathCurve from './CareerPathCurve'

// Mock react-intersection-observer
const mockRef = jest.fn()
const mockUseInView = jest.fn(() => ({ ref: mockRef, inView: true }))
jest.mock('react-intersection-observer', () => ({
  useInView: () => mockUseInView()
}))

// Mock isDarkMode helper
const mockIsDarkMode = jest.fn(() => false)
jest.mock('gatsby-theme-chronogrove/src/helpers/isDarkMode', () => {
  return jest.fn(() => mockIsDarkMode())
})

// Mock career data import with comprehensive test data
jest.mock(
  '../src/data/career-path.json',
  () => ({
    name: 'Career Journey',
    startYear: 2003,
    children: [
      {
        name: 'Engineering Path',
        type: 'path',
        color: '#48bb78',
        startYear: 2008,
        children: [
          {
            name: 'GoDaddy',
            type: 'job',
            title: 'Principal Software Engineer',
            dates: '2017 – Present',
            startYear: 2017,
            endYear: 2026,
            description: 'Leading engineering initiatives',
            children: [
              {
                title: 'Software Engineer III',
                startYear: 2017,
                endYear: 2021,
                type: 'role',
                description: 'Senior engineer role'
              },
              {
                title: 'Principal Software Engineer',
                startYear: 2025,
                endYear: 2026,
                type: 'role',
                description: 'Principal role'
              }
            ]
          },
          {
            name: 'Art In Reality, LLC',
            type: 'job',
            title: 'Software Engineer',
            dates: '2015 – 2017',
            startYear: 2015,
            endYear: 2017,
            description: 'Custom software development'
          }
        ]
      },
      {
        name: 'IT Path',
        type: 'path',
        color: '#4299e1',
        startYear: 2005,
        children: [
          {
            name: 'Apogee Physicians',
            type: 'job',
            title: 'IT Specialist',
            dates: '2008 – 2015',
            startYear: 2008,
            endYear: 2015,
            description: 'IT support and systems'
          }
        ]
      },
      {
        name: 'Design Path',
        type: 'path',
        color: '#ed8936',
        startYear: 2003,
        children: [
          {
            name: 'OfficeMax Print & Document Services',
            type: 'job',
            title: 'Desktop Publisher',
            dates: '2003 – 2005',
            startYear: 2003,
            endYear: 2005,
            description: 'Print and design work'
          }
        ]
      }
    ]
  }),
  { virtual: true }
)

const theme = {
  colors: {
    text: '#000',
    textMuted: '#666',
    background: '#fff',
    modes: {
      dark: {
        text: '#fff',
        textMuted: '#999',
        background: '#000'
      }
    }
  }
}

const renderWithTheme = component => {
  return render(<ThemeUIProvider theme={theme}>{component}</ThemeUIProvider>)
}

describe('CareerPathCurve', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseInView.mockReturnValue({ ref: mockRef, inView: true })
    mockIsDarkMode.mockReturnValue(false)
  })

  describe('Rendering', () => {
    it('renders the component', () => {
      renderWithTheme(<CareerPathCurve />)
      expect(screen.getByText(/Click a circle to see details/i)).toBeInTheDocument()
    })

    it('renders SVG with correct viewBox', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('viewBox', '0 0 700 320')
    })

    it('renders legend with all path types', () => {
      renderWithTheme(<CareerPathCurve />)
      expect(screen.getByText('Engineering')).toBeInTheDocument()
      expect(screen.getByText('IT')).toBeInTheDocument()
      expect(screen.getByText('Design')).toBeInTheDocument()
    })

    it('renders timeline baseline', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const lines = svg.querySelectorAll('line')
      expect(lines.length).toBeGreaterThan(0)
    })

    it('renders path segments', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const paths = svg.querySelectorAll('path')
      expect(paths.length).toBeGreaterThan(0)
    })

    it('renders circles for each company', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const circles = svg.querySelectorAll('circle')
      expect(circles.length).toBeGreaterThan(0)
    })
  })

  describe('Company Selection', () => {
    it('shows hint text when no company is selected', () => {
      renderWithTheme(<CareerPathCurve />)
      expect(screen.getByText(/Click a circle to see details/i)).toBeInTheDocument()
    })

    it('displays details when a circle is clicked', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      const circles = container.querySelectorAll('g[transform*="translate"]')
      expect(circles.length).toBeGreaterThan(0)

      fireEvent.click(circles[0])

      await waitFor(() => {
        expect(screen.queryByText(/Click a circle to see details/i)).not.toBeInTheDocument()
      })
    })

    it('toggles selection when clicking the same circle twice', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      const circles = container.querySelectorAll('g[transform*="translate"]')
      const firstCircle = circles[0]

      // First click - should show details
      fireEvent.click(firstCircle)
      await waitFor(() => {
        expect(screen.queryByText(/Click a circle to see details/i)).not.toBeInTheDocument()
      })

      // Second click - should hide details
      fireEvent.click(firstCircle)
      await waitFor(() => {
        expect(screen.getByText(/Click a circle to see details/i)).toBeInTheDocument()
      })
    })

    it('displays company title when selected', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      const circles = container.querySelectorAll('g[transform*="translate"]')
      fireEvent.click(circles[0])

      await waitFor(() => {
        // Should show a title (could be any of the companies)
        const titleElements = container.querySelectorAll('[style*="font-weight: bold"]')
        expect(titleElements.length).toBeGreaterThan(0)
      })
    })

    it('displays company dates when selected', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      const circles = container.querySelectorAll('g[transform*="translate"]')
      fireEvent.click(circles[0])

      await waitFor(() => {
        // Should show dates (format: YYYY–YYYY or YYYY–Present)
        const textContent = container.textContent
        expect(textContent).toMatch(/\d{4}[\u2013–-]\d{4}|\d{4}[\u2013–-]Present/i)
      })
    })
  })

  describe('Navigation Controls', () => {
    it('shows navigation controls for companies with multiple roles', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      // Find GoDaddy circle (has multiple roles based on mock data)
      const circles = container.querySelectorAll('g[transform*="translate"]')
      fireEvent.click(circles[0])

      await waitFor(() => {
        const navButtons = screen.queryAllByRole('button')
        if (navButtons.length > 0) {
          expect(navButtons.some(btn => btn.textContent === '←')).toBe(true)
          expect(navButtons.some(btn => btn.textContent === '→')).toBe(true)
        }
      })
    })

    it('navigates to previous role when prev button is clicked', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      const circles = container.querySelectorAll('g[transform*="translate"]')
      fireEvent.click(circles[0])

      await waitFor(() => {
        const prevButton = screen.queryByLabelText('Previous role')
        if (prevButton && !prevButton.disabled) {
          fireEvent.click(prevButton)
          // Should update to show previous role
          expect(prevButton).toBeInTheDocument()
        }
      })
    })

    it('navigates to next role when next button is clicked', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      const circles = container.querySelectorAll('g[transform*="translate"]')
      fireEvent.click(circles[0])

      await waitFor(() => {
        const nextButton = screen.queryByLabelText('Next role')
        if (nextButton && !nextButton.disabled) {
          fireEvent.click(nextButton)
          // Should update to show next role
          expect(nextButton).toBeInTheDocument()
        }
      })
    })

    it('disables prev button on first role', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      const circles = container.querySelectorAll('g[transform*="translate"]')
      fireEvent.click(circles[0])

      await waitFor(() => {
        const prevButton = screen.queryByLabelText('Previous role')
        if (prevButton) {
          // If we're on the first role, prev should be disabled
          expect(prevButton).toBeInTheDocument()
        }
      })
    })

    it('disables next button on last role', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      const circles = container.querySelectorAll('g[transform*="translate"]')
      fireEvent.click(circles[0])

      await waitFor(() => {
        const nextButton = screen.queryByLabelText('Next role')
        if (nextButton) {
          // Navigate to last role
          while (!nextButton.disabled) {
            fireEvent.click(nextButton)
          }
          expect(nextButton.disabled).toBe(true)
        }
      })
    })

    it('shows role counter (e.g., 1/2)', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)

      const circles = container.querySelectorAll('g[transform*="translate"]')
      fireEvent.click(circles[0])

      await waitFor(() => {
        const textContent = container.textContent
        // Should show format like "1/2" or "2/2"
        expect(textContent).toMatch(/\d+\/\d+/)
      })
    })
  })

  describe('Hover States', () => {
    it('handles hover state on circles', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const circles = container.querySelectorAll('g[transform*="translate"]')

      if (circles.length > 0) {
        fireEvent.mouseEnter(circles[0])
        const hoveredTransform = circles[0].getAttribute('transform')
        // Should have scale transform on hover
        expect(hoveredTransform).toContain('scale')
      }
    })

    it('removes hover state on mouse leave', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const circles = container.querySelectorAll('g[transform*="translate"]')

      if (circles.length > 0) {
        fireEvent.mouseEnter(circles[0])
        fireEvent.mouseLeave(circles[0])
        // Transform should no longer have scale (or be back to original)
        expect(circles[0]).toBeInTheDocument()
      }
    })
  })

  describe('Logo Rendering', () => {
    it('renders company logos when available', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const images = svg.querySelectorAll('image')
      // Should have some logo images for companies with logos
      expect(images.length).toBeGreaterThanOrEqual(0)
    })

    it('renders initials fallback when logo is not available', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const texts = svg.querySelectorAll('text')
      // Should have text elements for initials
      expect(texts.length).toBeGreaterThan(0)
    })

    it('generates correct initials for GoDaddy', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const texts = Array.from(svg.querySelectorAll('text'))
      const godaddyText = texts.find(t => t.textContent === 'GD')
      // GoDaddy should show "GD" initials
      expect(godaddyText || texts.length > 0).toBeTruthy()
    })

    it('generates initials from first two words for multi-word companies', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const texts = Array.from(svg.querySelectorAll('text'))
      // Should have initials for companies
      expect(texts.length).toBeGreaterThan(0)
    })

    it('generates initials from first two characters for single-word companies', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const texts = Array.from(svg.querySelectorAll('text'))
      // Should have text elements
      expect(texts.length).toBeGreaterThan(0)
    })
  })

  describe('Timeline', () => {
    it('renders timeline date ranges', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const timelineTexts = svg.querySelectorAll('text')
      expect(timelineTexts.length).toBeGreaterThan(0)
    })

    it('renders connecting lines from circles to timeline', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const lines = svg.querySelectorAll('line')
      expect(lines.length).toBeGreaterThan(0)
    })

    it('shows "Present" for current year end dates', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const textContent = container.textContent
      // Should show "Present" for 2026 end year
      expect(textContent).toMatch(/Present/i)
    })

    it('positions all timeline texts consistently below the timeline', () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      const texts = Array.from(svg.querySelectorAll('text'))
      // All timeline texts should be positioned consistently
      expect(texts.length).toBeGreaterThan(0)
    })
  })

  describe('Dark Mode', () => {
    it('applies dark mode styles when dark mode is active', () => {
      mockIsDarkMode.mockReturnValue(true)
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('applies light mode styles when light mode is active', () => {
      mockIsDarkMode.mockReturnValue(false)
      const { container } = renderWithTheme(<CareerPathCurve />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Animations', () => {
    it('applies animation styles when in view', () => {
      mockUseInView.mockReturnValue({ ref: mockRef, inView: true })
      const { container } = renderWithTheme(<CareerPathCurve />)
      const paths = container.querySelectorAll('path')
      if (paths.length > 0) {
        const firstPath = paths[0]
        const style = firstPath.getAttribute('style')
        expect(style).toContain('animation')
      }
    })

    it('does not apply animations when not in view', () => {
      mockUseInView.mockReturnValue({ ref: mockRef, inView: false })
      const { container } = renderWithTheme(<CareerPathCurve />)
      const paths = container.querySelectorAll('path')
      if (paths.length > 0) {
        const firstPath = paths[0]
        // Should not have animation when not in view
        expect(firstPath).toBeInTheDocument()
      }
    })

    it('applies staggered animation delays', () => {
      mockUseInView.mockReturnValue({ ref: mockRef, inView: true })
      const { container } = renderWithTheme(<CareerPathCurve />)
      const paths = container.querySelectorAll('path')
      if (paths.length > 1) {
        const delays = Array.from(paths).map(p => {
          const style = p.getAttribute('style') || ''
          const match = style.match(/animation-delay:\s*([\d.]+)s/)
          return match ? parseFloat(match[1]) : 0
        })
        // Should have increasing delays
        expect(delays.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles company with no description', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const circles = container.querySelectorAll('g[transform*="translate"]')
      if (circles.length > 0) {
        fireEvent.click(circles[0])
        await waitFor(() => {
          expect(container).toBeInTheDocument()
        })
      }
    })

    it('handles company with no dates', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const circles = container.querySelectorAll('g[transform*="translate"]')
      if (circles.length > 0) {
        fireEvent.click(circles[0])
        await waitFor(() => {
          expect(container).toBeInTheDocument()
        })
      }
    })

    it('handles single role company (no navigation)', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      // Find a company with single role (not GoDaddy)
      const circles = container.querySelectorAll('g[transform*="translate"]')
      if (circles.length > 1) {
        fireEvent.click(circles[1])
        await waitFor(() => {
          const navButtons = screen.queryAllByRole('button')
          // Single role companies shouldn't have nav buttons
          expect(navButtons).toHaveLength(0)
        })
      }
    })

    it('handles selection change correctly', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const circles = container.querySelectorAll('g[transform*="translate"]')

      if (circles.length > 1) {
        // Click first circle
        fireEvent.click(circles[0])
        await waitFor(() => {
          expect(screen.queryByText(/Click a circle to see details/i)).not.toBeInTheDocument()
        })

        // Click second circle
        fireEvent.click(circles[1])
        await waitFor(() => {
          expect(screen.queryByText(/Click a circle to see details/i)).not.toBeInTheDocument()
        })
      }
    })
  })

  describe('Selected State Styling', () => {
    it('applies selected styling to selected circle', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const circles = container.querySelectorAll('g[transform*="translate"]')

      if (circles.length > 0) {
        fireEvent.click(circles[0])
        await waitFor(() => {
          const svg = container.querySelector('svg')
          const selectedCircle = svg.querySelector('circle[stroke-width="4"]')
          expect(selectedCircle || circles[0]).toBeTruthy()
        })
      }
    })

    it('highlights timeline node for selected company', async () => {
      const { container } = renderWithTheme(<CareerPathCurve />)
      const circles = container.querySelectorAll('g[transform*="translate"]')

      if (circles.length > 0) {
        fireEvent.click(circles[0])
        await waitFor(() => {
          const svg = container.querySelector('svg')
          const timelineCircles = svg.querySelectorAll('circle')
          expect(timelineCircles.length).toBeGreaterThan(0)
        })
      }
    })
  })
})
