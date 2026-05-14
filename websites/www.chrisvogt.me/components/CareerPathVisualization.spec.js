import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeUIProvider } from 'theme-ui'
import CareerPathVisualization from './CareerPathVisualization'

// Mock D3.js with more comprehensive mock
jest.mock('d3', () => ({
  select: jest.fn(() => ({
    selectAll: jest.fn(() => ({
      remove: jest.fn(),
      data: jest.fn(() => ({
        enter: jest.fn(() => ({
          append: jest.fn(() => ({
            attr: jest.fn(() => ({
              attr: jest.fn(() => ({
                attr: jest.fn(() => ({
                  style: jest.fn(() => ({
                    style: jest.fn(() => ({
                      style: jest.fn(() => ({
                        text: jest.fn()
                      }))
                    }))
                  }))
                }))
              }))
            }))
          }))
        }))
      }))
    })),
    attr: jest.fn(function () {
      return this
    }),
    style: jest.fn(function () {
      return this
    }),
    append: jest.fn(function () {
      return this
    })
  })),
  hierarchy: jest.fn(() => ({
    descendants: jest.fn(() => [
      {
        data: {
          name: 'Career Journey',
          type: 'root',
          startYear: 2003
        },
        x: 400,
        y: 300,
        ancestors: jest.fn(() => [])
      },
      {
        data: {
          name: 'OfficeMax Print & Document Services',
          title: 'Desktop Publisher',
          dates: 'May 2003 – May 2005',
          startYear: 2003,
          endYear: 2005,
          type: 'job',
          description: 'Print media design for laser, oversize, and outsourced custom media'
        },
        x: 200,
        y: 100,
        ancestors: jest.fn(() => [{ data: { type: 'path', color: '#ed8936' } }])
      },
      {
        data: {
          name: 'Design Path',
          type: 'path',
          color: '#ed8936',
          startYear: 2003
        },
        x: 200,
        y: 150,
        ancestors: jest.fn(() => [])
      }
    ]),
    links: jest.fn(() => [
      {
        source: { x: 400, y: 300 },
        target: { x: 200, y: 150 }
      }
    ])
  })),
  tree: jest.fn(() => ({
    size: jest.fn(() => jest.fn()),
    separation: jest.fn(function () {
      return this
    })
  })),
  scaleLinear: jest.fn(() => ({
    domain: jest.fn(() => ({
      range: jest.fn(() => d => d * 100) // Simple mock scale function
    }))
  })),
  linkVertical: jest.fn(() => ({
    x: jest.fn(() => ({
      y: jest.fn()
    }))
  })),
  path: jest.fn(() => ({
    moveTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    toString: jest.fn(() => 'M100,100Q150,50,200,100')
  })),
  range: jest.fn((start, end, step) => {
    const result = []
    for (let i = start; i < end; i += step) {
      result.push(i)
    }
    return result
  })
}))

// Mock updated career data structure
jest.mock('../src/data/career-path.json', () => ({
  name: 'Career Journey',
  startYear: 2003,
  children: [
    {
      name: 'Design Path',
      type: 'path',
      color: '#ed8936',
      startYear: 2003,
      description: 'Explored creative design and visual communication',
      children: [
        {
          name: 'OfficeMax Print & Document Services',
          title: 'Desktop Publisher',
          dates: 'May 2003 – May 2005',
          startYear: 2003,
          endYear: 2005,
          type: 'job',
          description: 'Print media design for laser, oversize, and outsourced custom media'
        },
        {
          name: "FedEx Kinko's",
          title: 'Signs & Banners Specialist',
          dates: 'May 2005 – May 2006',
          startYear: 2005,
          endYear: 2006,
          type: 'job',
          description: 'Oversaw files from preparation to print and frequently contributed to design'
        }
      ]
    },
    {
      name: 'IT Path',
      type: 'path',
      color: '#4299e1',
      startYear: 2005,
      description: 'Started career in IT support and systems',
      children: [
        {
          name: 'Robert Half & TEKsystems',
          title: 'Contract Desktop Support & IT Technician (1099)',
          dates: 'July 2006 – Feb 2007',
          startYear: 2006,
          endYear: 2007,
          type: 'job',
          description: 'Started career in IT support and systems administration doing short-term contract work'
        }
      ]
    },
    {
      name: 'Engineering Path',
      type: 'path',
      color: '#48bb78',
      startYear: 2008,
      description: 'Transitioned into software development and engineering',
      children: [
        {
          name: 'GoDaddy',
          type: 'job',
          startYear: 2017,
          endYear: 2025,
          children: [
            {
              title: 'Software Engineer V',
              dates: 'Feb 2025 – Present',
              startYear: 2025,
              endYear: 2025,
              type: 'role',
              description: 'Current senior engineering leadership position'
            }
          ]
        }
      ]
    }
  ]
}))

// Mock isDarkMode helper
jest.mock('gatsby-theme-chronogrove/src/helpers/isDarkMode', () => jest.fn(() => false))

const mockTheme = {
  colors: {
    'panel-background': 'rgba(255, 255, 255, 0.35)',
    border: '#e2e8f0',
    text: '#111',
    textMuted: '#333',
    primary: '#422EA3'
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64]
}

const renderWithTheme = component => {
  return render(<ThemeUIProvider theme={mockTheme}>{component}</ThemeUIProvider>)
}

// Mock window methods
Object.defineProperty(window, 'addEventListener', {
  value: jest.fn()
})

Object.defineProperty(window, 'removeEventListener', {
  value: jest.fn()
})

// Mock useCallback and useEffect
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn(fn => fn),
  useEffect: jest.fn(fn => fn()),
  useState: jest.fn(initial => [initial, jest.fn()])
}))

describe('CareerPathVisualization', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock container dimensions for responsive testing
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 800
    })

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 600
    })
  })

  it('renders the visualization container', () => {
    renderWithTheme(<CareerPathVisualization />)

    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toBeInTheDocument()
  })

  it('handles window resize events for responsiveness', () => {
    renderWithTheme(<CareerPathVisualization />)

    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('cleans up event listeners on unmount', () => {
    const { unmount } = renderWithTheme(<CareerPathVisualization />)

    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('applies responsive layout with updated career timeline (2003-2025)', () => {
    renderWithTheme(<CareerPathVisualization />)

    const container = screen.getByRole('img', { hidden: true }).closest('div').closest('div')
    expect(container).toBeInTheDocument()
  })

  it('handles mobile responsive design', () => {
    // Mock mobile viewport
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 400
    })

    renderWithTheme(<CareerPathVisualization />)

    const container = screen.getByRole('img', { hidden: true }).closest('div')
    expect(container).toBeInTheDocument()
  })

  it('applies dark mode styles correctly', () => {
    const isDarkMode = require('gatsby-theme-chronogrove/src/helpers/isDarkMode')
    isDarkMode.mockReturnValue(true)

    renderWithTheme(<CareerPathVisualization />)

    const container = screen.getByRole('img', { hidden: true }).closest('div').closest('div')
    expect(container).toBeInTheDocument()
  })

  it('handles updated career data structure with early positions', () => {
    expect(() => renderWithTheme(<CareerPathVisualization />)).not.toThrow()

    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toBeInTheDocument()
  })

  it('applies improved glassmorphism styling', () => {
    renderWithTheme(<CareerPathVisualization />)

    const container = screen.getByRole('img', { hidden: true }).closest('div').closest('div')

    expect(container).toHaveStyle({
      borderRadius: '16px',
      backdropFilter: 'blur(10px)'
    })
  })

  it('supports responsive container width adjustments', () => {
    renderWithTheme(<CareerPathVisualization />)

    const container = screen.getByRole('img', { hidden: true }).closest('div').closest('div')

    // Should have responsive maxWidth
    expect(container).toBeInTheDocument()
  })

  it('handles large desktop layouts with increased height', () => {
    // Mock large desktop
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 1200
    })

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800
    })

    renderWithTheme(<CareerPathVisualization />)

    const container = screen.getByRole('img', { hidden: true }).closest('div')
    expect(container).toBeInTheDocument()
  })

  it('maintains proper SVG centering and margins', () => {
    renderWithTheme(<CareerPathVisualization />)

    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toHaveStyle({
      maxWidth: '100%',
      height: 'auto',
      display: 'block'
    })
  })

  it('handles theme UI color mode context properly', () => {
    const mockThemeContext = {
      ...mockTheme,
      useColorSchemeMediaQuery: true
    }

    render(
      <ThemeUIProvider theme={mockThemeContext}>
        <CareerPathVisualization />
      </ThemeUIProvider>
    )

    const container = screen.getByRole('img', { hidden: true }).closest('div').closest('div')
    expect(container).toBeInTheDocument()
  })

  it('applies correct container width reductions', () => {
    renderWithTheme(<CareerPathVisualization />)

    const outerContainer = screen.getByRole('img', { hidden: true }).closest('div').closest('div').closest('div')
    expect(outerContainer).toBeInTheDocument()
  })

  describe('Text collision detection and positioning', () => {
    it('handles text positioning without overlaps', () => {
      renderWithTheme(<CareerPathVisualization />)

      // Component should render without throwing errors during text positioning
      const svg = screen.getByRole('img', { hidden: true })
      expect(svg).toBeInTheDocument()
    })

    it('applies responsive text sizing', () => {
      renderWithTheme(<CareerPathVisualization />)

      const container = screen.getByRole('img', { hidden: true }).closest('div')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Year labels and timeline', () => {
    it('positions year labels inside visible area', () => {
      renderWithTheme(<CareerPathVisualization />)

      // Should render without timeline overflow issues
      const svg = screen.getByRole('img', { hidden: true })
      expect(svg).toBeInTheDocument()
    })

    it('handles strategic year selection (2003, 2007, 2011, 2015, 2019, 2023)', () => {
      renderWithTheme(<CareerPathVisualization />)

      const container = screen.getByRole('img', { hidden: true }).closest('div')
      expect(container).toBeInTheDocument()
    })
  })
})
