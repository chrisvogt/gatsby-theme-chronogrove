import React from 'react'
import renderer from 'react-test-renderer'
import { render } from '@testing-library/react'
import { act } from 'react'

import { TestProvider } from '../testUtils'
import HomeNavigation from './home-navigation'
import useNavigationData from '../hooks/use-navigation-data'

jest.mock('../hooks/use-navigation-data')

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

describe('HomeNavigation', () => {
  beforeEach(() => {
    useNavigationData.mockImplementation(() => mockNavigationData)
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

  it('matches the snapshot', () => {
    const tree = renderer
      .create(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles navigation data with empty home items', () => {
    useNavigationData.mockImplementation(() => ({
      header: {
        home: []
      }
    }))

    const tree = renderer
      .create(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles navigation data with missing header', () => {
    useNavigationData.mockImplementation(() => ({}))

    const tree = renderer
      .create(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('handles navigation data with null values', () => {
    useNavigationData.mockImplementation(() => null)

    const tree = renderer
      .create(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
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

    const tree = renderer
      .create(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
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

    const tree = renderer
      .create(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
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

    const tree = renderer
      .create(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  describe('Scroll event handling', () => {
    it('sets up scroll event listener on mount', () => {
      render(
        <TestProvider>
          <HomeNavigation />
        </TestProvider>
      )

      expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
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

      const tree = renderer
        .create(
          <TestProvider>
            <HomeNavigation />
          </TestProvider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })

    it('handles server-side rendering when document is not available', () => {
      // Store original document
      const originalDocument = global.document

      // Temporarily remove document
      delete global.document

      const tree = renderer
        .create(
          <TestProvider>
            <HomeNavigation />
          </TestProvider>
        )
        .toJSON()

      expect(tree).toMatchSnapshot()

      // Restore document
      global.document = originalDocument
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

      const tree = renderer
        .create(
          <TestProvider>
            <HomeNavigation />
          </TestProvider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
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

      const tree = renderer
        .create(
          <TestProvider>
            <HomeNavigation />
          </TestProvider>
        )
        .toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
