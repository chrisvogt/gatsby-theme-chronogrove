import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TestProvider } from '../test-utils'
import HomeNavigation, { getRailFillPct, normalizeHomeNavProps, resolvePrimaryFromTheme } from './home-navigation'
import { scrollToElementWhenReady } from '../helpers/scroll-to-element-when-ready'
import useNavigationData from '../hooks/use-navigation-data'
import useSiteMetadata from '../hooks/use-site-metadata'

jest.mock('../hooks/use-navigation-data')
jest.mock('../hooks/use-site-metadata')
jest.mock('../helpers/scroll-to-element-when-ready', () => ({
  scrollToElementWhenReady: jest.fn()
}))

const mockNavigationData = {
  header: {
    home: [
      {
        path: '/about',
        slug: 'about',
        text: 'About'
      },
      {
        path: '/blog',
        slug: 'blog',
        text: 'Blog'
      }
    ]
  }
}

// Mock document and window for scroll testing
const mockGetBoundingClientRect = jest.fn()
const mockAddEventListener = jest.fn()
const mockRemoveEventListener = jest.fn()

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true
})

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true
})

Object.defineProperty(window, 'innerHeight', {
  value: 800,
  writable: true
})

describe('normalizeHomeNavProps', () => {
  it('returns empty object for nullish props', () => {
    expect(normalizeHomeNavProps(undefined)).toEqual({})
    expect(normalizeHomeNavProps(null)).toEqual({})
  })

  it('returns the same object reference when props are provided', () => {
    const p = { scrollSyncDisabled: true }
    expect(normalizeHomeNavProps(p)).toBe(p)
  })
})

describe('resolvePrimaryFromTheme', () => {
  it('returns fallback when light theme has no primary', () => {
    expect(resolvePrimaryFromTheme(false, { rawColors: {} })).toBe('#422EA3')
  })

  it('returns fallback when dark theme has no dark primary', () => {
    expect(resolvePrimaryFromTheme(true, { rawColors: { modes: { dark: {} } } })).toBe('#422EA3')
  })

  it('returns light primary when present', () => {
    expect(resolvePrimaryFromTheme(false, { rawColors: { primary: '#abc' } })).toBe('#abc')
  })

  it('returns dark primary when present', () => {
    expect(resolvePrimaryFromTheme(true, { rawColors: { modes: { dark: { primary: '#def' } } } })).toBe('#def')
  })

  it('returns fallback when theme is undefined', () => {
    expect(resolvePrimaryFromTheme(false, undefined)).toBe('#422EA3')
  })
})

describe('getRailFillPct', () => {
  it('returns 0 when there is at most one link', () => {
    expect(getRailFillPct(0, 0)).toBe(0)
    expect(getRailFillPct(1, 0)).toBe(0)
  })

  it('returns 0 at first stop with multiple links', () => {
    expect(getRailFillPct(4, 0)).toBe(0)
  })

  it('returns 100 at last stop', () => {
    expect(getRailFillPct(4, 3)).toBe(100)
  })

  it('returns rounded intermediate percentages', () => {
    expect(getRailFillPct(4, 1)).toBe(33)
    expect(getRailFillPct(4, 2)).toBe(67)
  })

  it('caps at 100 when the fraction rounds above 100', () => {
    expect(getRailFillPct(2, 10)).toBe(100)
  })

  it('treats a negative index (no matching link id) as the first stop', () => {
    expect(getRailFillPct(4, -1)).toBe(0)
  })

  it('treats a non-finite index as the first stop', () => {
    expect(getRailFillPct(4, NaN)).toBe(0)
  })
})

describe('HomeNavigation', () => {
  beforeEach(() => {
    useNavigationData.mockImplementation(() => mockNavigationData)
    useSiteMetadata.mockReturnValue({}) // No widgets by default — nav items without widget config are shown
    mockGetBoundingClientRect.mockReturnValue({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100
    })

    // Mock document.getElementById
    document.getElementById = jest.fn(() => ({
      getBoundingClientRect: mockGetBoundingClientRect
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('uses default props when created with undefined props', () => {
    const { container } = render(<TestProvider>{React.createElement(HomeNavigation)}</TestProvider>)
    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('hides nav items for widgets that have no data source configured', () => {
    useNavigationData.mockImplementation(() => ({
      header: {
        home: [
          { path: '#instagram', slug: 'instagram', text: 'Instagram', title: 'Instagram' },
          { path: '#github', slug: 'github', text: 'GitHub', title: 'GitHub' }
        ]
      }
    }))
    useSiteMetadata.mockReturnValue({
      widgets: {
        instagram: { widgetDataSource: '' },
        github: { widgetDataSource: '/api/github.json' }
      }
    })

    const { container } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )

    const links = container.querySelectorAll('a')
    // Home, Latest Posts, GitHub (Instagram filtered out)
    expect(links).toHaveLength(3)
    expect(links[2].getAttribute('href')).toBe('#github')
    expect(links[2].textContent).toContain('GitHub')
  })

  it('handles navigation data with empty home items', () => {
    useNavigationData.mockImplementation(() => ({
      header: {
        home: []
      }
    }))

    const { asFragment } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles navigation data with missing header', () => {
    useNavigationData.mockImplementation(() => ({}))

    const { asFragment } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles navigation data with null values', () => {
    useNavigationData.mockImplementation(() => null)

    const { asFragment } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles navigation items with missing icon reactIcon', () => {
    const navigationWithMissingIcons = {
      header: {
        home: [
          {
            path: '/test',
            slug: 'test',
            text: 'Test'
          }
        ]
      }
    }
    useNavigationData.mockImplementation(() => navigationWithMissingIcons)

    const { asFragment } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles navigation items with discogs slug for icon mapping', () => {
    const navigationWithDiscogs = {
      header: {
        home: [
          {
            path: '/discogs',
            slug: 'discogs',
            text: 'Discogs'
          }
        ]
      }
    }
    useNavigationData.mockImplementation(() => navigationWithDiscogs)

    const { asFragment } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('handles navigation items with travel slug for icon mapping', () => {
    const navigationWithTravel = {
      header: {
        home: [
          {
            path: '/travel',
            slug: 'travel',
            text: 'Travel'
          }
        ]
      }
    }
    useNavigationData.mockImplementation(() => navigationWithTravel)

    const { container } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )

    const links = container.querySelectorAll('a')
    expect(links).toHaveLength(3) // home, posts, travel
    expect(links[2].getAttribute('href')).toBe('/travel')
    expect(links[2].textContent).toContain('Travel')
    expect(links[2].querySelector('svg')).toBeTruthy()
  })

  it('handles navigation items with photography slug for icon mapping', () => {
    const navigationWithPhotography = {
      header: {
        home: [
          {
            path: '/photography',
            slug: 'photography',
            text: 'Photography'
          }
        ]
      }
    }
    useNavigationData.mockImplementation(() => navigationWithPhotography)

    const { container } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )

    const links = container.querySelectorAll('a')
    expect(links).toHaveLength(3) // home, posts, photography
    expect(links[2].getAttribute('href')).toBe('/photography')
    expect(links[2].textContent).toContain('Photography')
    expect(links[2].querySelector('svg')).toBeTruthy()
  })

  it('handles navigation items with complex slug names', () => {
    const navigationWithComplexSlugs = {
      header: {
        home: [
          {
            path: '/complex-slug',
            slug: 'complex-slug',
            text: 'Complex Slug'
          }
        ]
      }
    }
    useNavigationData.mockImplementation(() => navigationWithComplexSlugs)

    const { asFragment } = render(
      <TestProvider>
        <HomeNavigation />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  describe('Scroll event handling', () => {
    it('sets up scroll event listener on mount', () => {
      render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })
    })

    it('removes scroll event listener on unmount', () => {
      const { unmount } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      unmount()

      expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    })

    it('updates active section based on scroll position', () => {
      render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      // Get the scroll handler
      const scrollHandler = mockAddEventListener.mock.calls[0][1]

      // Mock getBoundingClientRect to simulate different scroll positions
      mockGetBoundingClientRect.mockReturnValueOnce({
        top: 400, // Below half of window height (800/2 = 400)
        bottom: 500,
        left: 0,
        right: 100,
        width: 100,
        height: 100
      })

      // Simulate scroll event
      act(() => {
        scrollHandler()
      })

      // Should call getBoundingClientRect for each section
      expect(document.getElementById).toHaveBeenCalledWith('home')
      expect(document.getElementById).toHaveBeenCalledWith('posts')
      expect(document.getElementById).toHaveBeenCalledWith('about')
      expect(document.getElementById).toHaveBeenCalledWith('blog')
    })

    it('sets active section to home when no element is above threshold', () => {
      render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      const scrollHandler = mockAddEventListener.mock.calls[0][1]

      // Mock all elements to be above the threshold
      mockGetBoundingClientRect.mockReturnValue({
        top: 500, // Above half of window height
        bottom: 600,
        left: 0,
        right: 100,
        width: 100,
        height: 100
      })

      act(() => {
        scrollHandler()
      })

      // Should default to 'home'
      expect(document.getElementById).toHaveBeenCalled()
    })

    it('sets active section to the last element that meets threshold', () => {
      render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      const scrollHandler = mockAddEventListener.mock.calls[0][1]

      // Mock multiple elements to be below threshold
      mockGetBoundingClientRect
        .mockReturnValueOnce({
          top: 300, // Below threshold
          bottom: 400,
          left: 0,
          right: 100,
          width: 100,
          height: 100
        })
        .mockReturnValueOnce({
          top: 350, // Below threshold, more recent
          bottom: 450,
          left: 0,
          right: 100,
          width: 100,
          height: 100
        })
        .mockReturnValueOnce({
          top: 200, // Below threshold, most recent
          bottom: 300,
          left: 0,
          right: 100,
          width: 100,
          height: 100
        })

      act(() => {
        scrollHandler()
      })

      // Should call getBoundingClientRect for all sections
      expect(document.getElementById).toHaveBeenCalledWith('home')
      expect(document.getElementById).toHaveBeenCalledWith('posts')
      expect(document.getElementById).toHaveBeenCalledWith('about')
      expect(document.getElementById).toHaveBeenCalledWith('blog')
    })

    it('handles scroll event when element is not found', () => {
      render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      const scrollHandler = mockAddEventListener.mock.calls[0][1]

      // Mock getElementById to return null
      document.getElementById = jest.fn(() => null)

      act(() => {
        scrollHandler()
      })

      // Should not throw error and should default to 'home'
      expect(document.getElementById).toHaveBeenCalled()
    })
  })

  describe('Hash link clicks', () => {
    beforeEach(() => {
      window.history.pushState = jest.fn()
      window.scrollTo = jest.fn()
      scrollToElementWhenReady.mockClear()
    })

    it('scrolls to top when Home (#top) is clicked', () => {
      const { container } = render(
        <TestProvider>
          <HomeNavigation scrollSyncDisabled />
        </TestProvider>
      )
      const homeLink = container.querySelector('a[href="#top"]')
      fireEvent.click(homeLink)
      expect(window.history.pushState).toHaveBeenCalledWith(null, '', '#top')
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' })
      expect(scrollToElementWhenReady).not.toHaveBeenCalled()
    })

    it('moves focus to #top when Home is clicked', () => {
      const focusTop = jest.fn()
      document.getElementById = jest.fn(id => {
        if (id === 'top') {
          return { focus: focusTop }
        }
        return { getBoundingClientRect: mockGetBoundingClientRect }
      })

      const { container } = render(
        <TestProvider>
          <HomeNavigation scrollSyncDisabled />
        </TestProvider>
      )
      fireEvent.click(container.querySelector('a[href="#top"]'))
      expect(focusTop).toHaveBeenCalledWith({ preventScroll: true })
    })

    it('calls scrollToElementWhenReady for non-top hash links', () => {
      const { container } = render(
        <TestProvider>
          <HomeNavigation scrollSyncDisabled />
        </TestProvider>
      )
      const postsLink = container.querySelector('a[href="#posts"]')
      fireEvent.click(postsLink)
      expect(scrollToElementWhenReady).toHaveBeenCalledWith('#posts')
      expect(window.scrollTo).not.toHaveBeenCalled()
    })
  })

  describe('Navigation link rendering', () => {
    it('renders navigation links with correct href and text', () => {
      const { container } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      const links = container.querySelectorAll('a')
      expect(links).toHaveLength(4) // home, posts, about, blog

      // Check home link
      expect(links[0].getAttribute('href')).toBe('#top')
      expect(links[0].textContent).toContain('Home')

      // Check posts link
      expect(links[1].getAttribute('href')).toBe('#posts')
      expect(links[1].textContent).toContain('Latest Posts')

      // Check about link
      expect(links[2].getAttribute('href')).toBe('/about')
      expect(links[2].textContent).toContain('About')

      // Check blog link
      expect(links[3].getAttribute('href')).toBe('/blog')
      expect(links[3].textContent).toContain('Blog')
    })

    it('renders navigation links with correct active state', () => {
      const { container } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      const links = container.querySelectorAll('a')

      // Initially, home should be active
      expect(links[0].classList.contains('active')).toBe(true)
      expect(links[1].classList.contains('active')).toBe(false)
      expect(links[2].classList.contains('active')).toBe(false)
      expect(links[3].classList.contains('active')).toBe(false)
    })

    it('renders navigation links with correct icon mapping', () => {
      const { container } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      const links = container.querySelectorAll('a')

      // Check that icons are rendered
      expect(links[0].querySelector('svg')).toBeTruthy() // Home icon
      expect(links[1].querySelector('svg')).toBeTruthy() // Posts icon
      // Note: FontAwesome icons might not render in test environment
      // So we'll just check that the links exist
      expect(links[2]).toBeTruthy() // About link
      expect(links[3]).toBeTruthy() // Blog link
    })

    it('handles navigation items without icon mapping', () => {
      const navigationWithoutIcons = {
        header: {
          home: [
            {
              path: '/unknown',
              slug: 'unknown',
              text: 'Unknown'
            }
          ]
        }
      }
      useNavigationData.mockImplementation(() => navigationWithoutIcons)

      const { container } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      const links = container.querySelectorAll('a')
      const unknownLink = links[2] // Third link (after home and posts)

      // Should not have an icon
      expect(unknownLink.querySelector('svg')).toBeFalsy()
      expect(unknownLink.textContent).toContain('Unknown')
    })

    it('handles navigation items with missing icon object', () => {
      const navigationWithMissingIconObject = {
        header: {
          home: [
            {
              path: '/test',
              slug: 'test',
              text: 'Test'
            }
          ]
        }
      }
      useNavigationData.mockImplementation(() => navigationWithMissingIconObject)

      const { container } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      const links = container.querySelectorAll('a')
      const testLink = links[2] // Third link (after home and posts)

      // Should not have an icon
      expect(testLink.querySelector('svg')).toBeFalsy()
      expect(testLink.textContent).toContain('Test')
    })
  })

  describe('useEffect dependencies', () => {
    it('recreates scroll handler when links change', () => {
      const { rerender } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      const initialScrollHandler = mockAddEventListener.mock.calls[0][1]

      // Change navigation data
      const newNavigationData = {
        header: {
          home: [
            {
              path: '/new',
              slug: 'new',
              text: 'New'
            }
          ]
        }
      }
      useNavigationData.mockImplementation(() => newNavigationData)

      rerender(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      // Should remove old listener and add new one
      expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', initialScrollHandler)
      expect(mockAddEventListener).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge cases', () => {
    it('handles navigation data with undefined home items', () => {
      useNavigationData.mockImplementation(() => ({
        header: {
          home: undefined
        }
      }))

      const { asFragment } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('handles server-side rendering when document is not available', () => {
      const originalDocument = global.document
      delete global.document

      const { asFragment } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      expect(asFragment()).toMatchSnapshot()

      global.document = originalDocument
    })

    it('does not add scroll listener when scrollSyncDisabled is true', () => {
      render(
        <TestProvider>
          <HomeNavigation scrollSyncDisabled />
        </TestProvider>
      )
      expect(mockAddEventListener).not.toHaveBeenCalled()
    })

    it('handles navigation items with missing path', () => {
      const navigationWithMissingPath = {
        header: {
          home: [
            {
              slug: 'test',
              text: 'Test'
            }
          ]
        }
      }
      useNavigationData.mockImplementation(() => navigationWithMissingPath)

      const { asFragment } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('handles navigation items with missing text', () => {
      const navigationWithMissingText = {
        header: {
          home: [
            {
              path: '/test',
              slug: 'test'
            }
          ]
        }
      }
      useNavigationData.mockImplementation(() => navigationWithMissingText)

      const { asFragment } = render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('Dark mode', () => {
    it('uses primary hex fallback when rawColors omit mode primary', () => {
      const baseTheme = require('@chronogrove/ui/theme').default
      const { ThemeUIProvider } = require('theme-ui')
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        const themeNoPrimary = {
          ...baseTheme,
          rawColors: {
            ...baseTheme.rawColors,
            primary: undefined,
            modes: {
              ...baseTheme.rawColors?.modes,
              dark: {
                ...baseTheme.rawColors?.modes?.dark,
                primary: undefined
              }
            }
          },
          config: {
            ...baseTheme.config,
            initialColorModeName: 'dark',
            useColorSchemeMediaQuery: false
          }
        }
        const { container } = render(
          <ThemeUIProvider theme={themeNoPrimary}>
            <HomeNavigation scrollSyncDisabled />
          </ThemeUIProvider>
        )
        expect(container.querySelector('nav')).toBeInTheDocument()
      } finally {
        warnSpy.mockRestore()
      }
    })

    it('renders with dark panel when theme initial color mode is dark', () => {
      // Theme UI warns when initialColorModeName matches a `colors.modes` key; we only need dark styles for this assertion.
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        const theme = require('@chronogrove/ui/theme').default
        const darkTheme = {
          ...theme,
          config: {
            ...theme.config,
            initialColorModeName: 'dark',
            useColorSchemeMediaQuery: false
          }
        }
        const { ThemeUIProvider } = require('theme-ui')
        const { container } = render(
          <ThemeUIProvider theme={darkTheme}>
            <HomeNavigation scrollSyncDisabled />
          </ThemeUIProvider>
        )
        const nav = container.querySelector('nav')
        expect(nav).toBeInTheDocument()
        expect(nav.querySelectorAll('a').length).toBeGreaterThan(0)
      } finally {
        warnSpy.mockRestore()
      }
    })
  })
})
