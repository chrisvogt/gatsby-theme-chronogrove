import { shouldUpdateScroll, onRouteUpdate } from './gatsby-browser'

// Mock document and window methods
const mockGetElementById = jest.fn()
const mockFocus = jest.fn()
const mockScrollTo = jest.fn()

// Mock DOM element
const mockSkipContent = {
  focus: mockFocus
}

// Setup document and window mocks
beforeEach(() => {
  jest.clearAllMocks()
  document.getElementById = mockGetElementById
  window.scrollTo = mockScrollTo
})

// Restore originals after tests
afterEach(() => {
  delete document.getElementById
  delete window.scrollTo
})

describe('gatsby-browser', () => {
  describe('shouldUpdateScroll', () => {
    it('should return false when routerProps is undefined', () => {
      const result = shouldUpdateScroll({})
      expect(result).toBe(false)
    })

    it('should return false when routerProps is null', () => {
      const result = shouldUpdateScroll({ routerProps: null })
      expect(result).toBe(false)
    })

    it('should return false when only query parameters change', () => {
      const routerProps = {
        location: { pathname: '/blog', search: '?page=2' }
      }
      const prevRouterProps = {
        location: { pathname: '/blog', search: '?page=1' }
      }
      const result = shouldUpdateScroll({ routerProps, prevRouterProps })
      expect(result).toBe(false)
    })

    it('should return false when pathname changes (scroll to top handled in onRouteUpdate)', () => {
      const routerProps = {
        location: { pathname: '/about', search: '' }
      }
      const prevRouterProps = {
        location: { pathname: '/blog', search: '' }
      }
      const result = shouldUpdateScroll({ routerProps, prevRouterProps })
      expect(result).toBe(false)
    })

    it('should return false when prevRouterProps is null', () => {
      const routerProps = {
        location: { pathname: '/blog', search: '' }
      }
      const result = shouldUpdateScroll({ routerProps, prevRouterProps: null })
      expect(result).toBe(false)
    })

    it('should return false when prevRouterProps is undefined', () => {
      const routerProps = {
        location: { pathname: '/blog', search: '' }
      }
      const result = shouldUpdateScroll({ routerProps, prevRouterProps: undefined })
      expect(result).toBe(false)
    })
  })

  describe('onRouteUpdate', () => {
    it('should not call scrollTo or focus when prevLocation is null', () => {
      onRouteUpdate({ prevLocation: null })
      expect(mockScrollTo).not.toHaveBeenCalled()
      expect(mockGetElementById).not.toHaveBeenCalled()
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should scroll to top and call focus with preventScroll when prevLocation is undefined', () => {
      mockGetElementById.mockReturnValue(mockSkipContent)

      onRouteUpdate({ prevLocation: undefined })

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true })
    })

    it('should scroll to top and call focus with preventScroll when skip content element exists', () => {
      mockGetElementById.mockReturnValue(mockSkipContent)

      onRouteUpdate({ prevLocation: { pathname: '/previous' } })

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true })
    })

    it('should scroll to top but not call focus when skip content element does not exist', () => {
      mockGetElementById.mockReturnValue(null)

      onRouteUpdate({ prevLocation: { pathname: '/previous' } })

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should scroll to top but not call focus when getElementById returns undefined', () => {
      mockGetElementById.mockReturnValue(undefined)

      onRouteUpdate({ prevLocation: { pathname: '/previous' } })

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).not.toHaveBeenCalled()
    })
  })
})
