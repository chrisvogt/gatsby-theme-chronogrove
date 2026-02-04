import { shouldUpdateScroll, onRouteUpdate } from './gatsby-browser'

// Mock document methods
const mockGetElementById = jest.fn()
const mockFocus = jest.fn()

// Mock DOM element
const mockSkipContent = {
  focus: mockFocus
}

// Setup document mock by overriding the getElementById method
beforeEach(() => {
  jest.clearAllMocks()
  // Mock the getElementById method on the existing document
  document.getElementById = mockGetElementById
})

// Restore the original getElementById after tests
afterEach(() => {
  delete document.getElementById
})

describe('gatsby-browser', () => {
  describe('shouldUpdateScroll', () => {
    it('should return [0, 0] when routerProps is undefined', () => {
      const result = shouldUpdateScroll({})
      expect(result).toEqual([0, 0])
    })

    it('should return [0, 0] when routerProps is null', () => {
      const result = shouldUpdateScroll({ routerProps: null })
      expect(result).toEqual([0, 0])
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

    it('should return [0, 0] when pathname changes', () => {
      const routerProps = {
        location: { pathname: '/about', search: '' }
      }
      const prevRouterProps = {
        location: { pathname: '/blog', search: '' }
      }
      const result = shouldUpdateScroll({ routerProps, prevRouterProps })
      expect(result).toEqual([0, 0])
    })

    it('should return [0, 0] when prevRouterProps is null', () => {
      const routerProps = {
        location: { pathname: '/blog', search: '' }
      }
      const result = shouldUpdateScroll({ routerProps, prevRouterProps: null })
      expect(result).toEqual([0, 0])
    })

    it('should return [0, 0] when prevRouterProps is undefined', () => {
      const routerProps = {
        location: { pathname: '/blog', search: '' }
      }
      const result = shouldUpdateScroll({ routerProps, prevRouterProps: undefined })
      expect(result).toEqual([0, 0])
    })
  })

  describe('onRouteUpdate', () => {
    it('should not call focus when prevLocation is null', () => {
      onRouteUpdate({ prevLocation: null })
      expect(mockGetElementById).not.toHaveBeenCalled()
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should call focus with preventScroll when prevLocation is undefined', () => {
      mockGetElementById.mockReturnValue(mockSkipContent)

      onRouteUpdate({ prevLocation: undefined })

      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true })
    })

    it('should call focus with preventScroll when skip content element exists', () => {
      mockGetElementById.mockReturnValue(mockSkipContent)

      onRouteUpdate({ prevLocation: { pathname: '/previous' } })

      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true })
    })

    it('should not call focus when skip content element does not exist', () => {
      mockGetElementById.mockReturnValue(null)

      onRouteUpdate({ prevLocation: { pathname: '/previous' } })

      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should handle when getElementById returns undefined', () => {
      mockGetElementById.mockReturnValue(undefined)

      onRouteUpdate({ prevLocation: { pathname: '/previous' } })

      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).not.toHaveBeenCalled()
    })
  })
})
