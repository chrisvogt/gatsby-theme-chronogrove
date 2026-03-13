import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { shouldUpdateScroll, onRouteUpdate, wrapRootElement } from './gatsby-browser'

jest.mock('@gatsbyjs/reach-router', () => ({
  ...jest.requireActual('@gatsbyjs/reach-router'),
  useLocation: jest.fn(() => ({ pathname: '/' }))
}))

// Mock document and window methods
const mockGetElementById = jest.fn()
const mockFocus = jest.fn()
const mockScrollTo = jest.fn()
const mockMatchMedia = jest.fn()

// Mock DOM element
const mockSkipContent = {
  focus: mockFocus
}

// Run requestAnimationFrame callbacks immediately so deferred scroll runs in tests
const originalRequestAnimationFrame = window.requestAnimationFrame
beforeEach(() => {
  jest.clearAllMocks()
  document.getElementById = mockGetElementById
  window.scrollTo = mockScrollTo
  window.requestAnimationFrame = cb => {
    cb()
    return 0
  }
  window.matchMedia = mockMatchMedia.mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  })
  window.localStorage.removeItem('theme-ui-color-mode')
  document.documentElement.className = ''
  document.documentElement.removeAttribute('data-theme-ui-color-mode')
})

// Restore originals after tests
afterEach(() => {
  delete document.getElementById
  delete window.scrollTo
  window.requestAnimationFrame = originalRequestAnimationFrame
})

describe('gatsby-browser', () => {
  describe('wrapRootElement', () => {
    it('wraps the root element with Emotion cache provider without crashing', () => {
      const wrapped = wrapRootElement({ element: <div>Root content</div> })
      const { getByText } = render(wrapped)

      expect(getByText('Root content')).toBeInTheDocument()
    })

    it('reuses existing Emotion cache across wrapper calls', () => {
      const firstWrapped = wrapRootElement({ element: <div>First Root</div> })
      const secondWrapped = wrapRootElement({ element: <div>Second Root</div> })

      const { getByText: getByTextFirst } = render(firstWrapped)
      const { getByText: getByTextSecond } = render(secondWrapped)

      expect(getByTextFirst('First Root')).toBeInTheDocument()
      expect(getByTextSecond('Second Root')).toBeInTheDocument()
    })
  })

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
    it('prefers localStorage over DOM so route transitions do not perpetuate wrong paint', () => {
      document.documentElement.setAttribute('data-theme-ui-color-mode', 'dark')
      document.documentElement.classList.add('theme-ui-dark')
      window.localStorage.setItem('theme-ui-color-mode', 'default')

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: null
      })

      expect(document.documentElement.classList.contains('theme-ui-default')).toBe(true)
      expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(false)
      expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('default')
    })

    it('falls back to DOM when localStorage is empty', () => {
      window.localStorage.removeItem('theme-ui-color-mode')
      document.documentElement.setAttribute('data-theme-ui-color-mode', 'dark')
      document.documentElement.classList.add('theme-ui-dark')

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: null
      })

      expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(true)
      expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('dark')
    })

    it('falls back to theme-ui-* class when localStorage and data attribute are empty', () => {
      window.localStorage.removeItem('theme-ui-color-mode')
      document.documentElement.removeAttribute('data-theme-ui-color-mode')
      document.documentElement.classList.add('theme-ui-dark')

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: null
      })

      expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(true)
      expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('dark')
    })

    it('syncs Theme UI mode class and data attribute from localStorage', () => {
      window.localStorage.setItem('theme-ui-color-mode', 'dark')

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: null
      })

      expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(true)
      expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('dark')
    })

    it('normalizes light mode to default when syncing Theme UI mode', () => {
      window.localStorage.setItem('theme-ui-color-mode', 'light')

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: null
      })

      expect(document.documentElement.classList.contains('theme-ui-default')).toBe(true)
      expect(document.documentElement.classList.contains('theme-ui-light')).toBe(false)
      expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('default')
    })

    it('falls back to system preference when localStorage is unavailable', () => {
      const getItemSpy = jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockImplementation(() => {
        throw new Error('blocked')
      })
      window.matchMedia = mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      })

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: null
      })

      expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(true)
      expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('dark')

      getItemSpy.mockRestore()
    })

    it('does not dispatch reconcile event when CustomEvent is not available', () => {
      window.localStorage.setItem('theme-ui-color-mode', 'dark')
      const originalCustomEvent = window.CustomEvent
      window.CustomEvent = undefined

      expect(() => {
        onRouteUpdate({
          location: { pathname: '/current', hash: '' },
          prevLocation: null
        })
      }).not.toThrow()
      expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('dark')

      window.CustomEvent = originalCustomEvent
    })

    it('removes stale theme-ui classes before applying the resolved mode', () => {
      window.localStorage.setItem('theme-ui-color-mode', 'default')
      document.documentElement.className = 'theme-ui-dark theme-ui-default app-shell'
      document.documentElement.setAttribute('data-theme-ui-color-mode', 'dark')

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: null
      })

      const htmlClasses = Array.from(document.documentElement.classList)
      expect(htmlClasses).toEqual(expect.arrayContaining(['theme-ui-default', 'app-shell']))
      expect(htmlClasses).not.toContain('theme-ui-dark')
    })

    it('uses timeout fallback when requestAnimationFrame is unavailable', () => {
      const originalRaf = window.requestAnimationFrame
      jest.useFakeTimers()
      const timeoutSpy = jest.spyOn(global, 'setTimeout')
      try {
        window.requestAnimationFrame = undefined
        window.localStorage.setItem('theme-ui-color-mode', 'dark')

        onRouteUpdate({
          location: { pathname: '/current', hash: '' },
          prevLocation: null
        })

        expect(timeoutSpy).toHaveBeenCalled()
        jest.runOnlyPendingTimers()
        expect(document.documentElement.classList.contains('theme-ui-dark')).toBe(true)
      } finally {
        timeoutSpy.mockRestore()
        window.requestAnimationFrame = originalRaf
        jest.useRealTimers()
      }
    })

    it('returns safely when documentElement is unavailable', () => {
      const originalDocumentElement = document.documentElement
      try {
        Object.defineProperty(document, 'documentElement', {
          configurable: true,
          value: null
        })

        expect(() =>
          onRouteUpdate({
            location: { pathname: '/current', hash: '' },
            prevLocation: null
          })
        ).not.toThrow()
      } finally {
        Object.defineProperty(document, 'documentElement', {
          configurable: true,
          value: originalDocumentElement
        })
      }
    })

    it('should not call scrollTo or focus when prevLocation is null', () => {
      onRouteUpdate({ prevLocation: null })
      expect(mockScrollTo).not.toHaveBeenCalled()
      expect(mockGetElementById).not.toHaveBeenCalled()
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should scroll to top and call focus with preventScroll when prevLocation is undefined', () => {
      mockGetElementById.mockReturnValue(mockSkipContent)

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: undefined
      })

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true })
    })

    it('should scroll to top and call focus with preventScroll when skip content element exists', () => {
      mockGetElementById.mockReturnValue(mockSkipContent)

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: { pathname: '/previous' }
      })

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true })
    })

    it('should scroll to top but not call focus when skip content element does not exist', () => {
      mockGetElementById.mockReturnValue(null)

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: { pathname: '/previous' }
      })

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should scroll to top but not call focus when getElementById returns undefined', () => {
      mockGetElementById.mockReturnValue(undefined)

      onRouteUpdate({
        location: { pathname: '/current', hash: '' },
        prevLocation: { pathname: '/previous' }
      })

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should not scroll to top when pathname is unchanged (same page)', () => {
      onRouteUpdate({
        location: { pathname: '/', hash: '' },
        prevLocation: { pathname: '/', hash: '#section' }
      })

      expect(mockScrollTo).not.toHaveBeenCalled()
      expect(mockGetElementById).not.toHaveBeenCalled()
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should not scroll to top when navigating to a hash on the same page', () => {
      onRouteUpdate({
        location: { pathname: '/', hash: '#posts' },
        prevLocation: { pathname: '/' }
      })

      expect(mockScrollTo).not.toHaveBeenCalled()
      expect(mockGetElementById).not.toHaveBeenCalled()
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should not scroll to top when changing hash on the same page', () => {
      onRouteUpdate({
        location: { pathname: '/', hash: '#github' },
        prevLocation: { pathname: '/', hash: '#posts' }
      })

      expect(mockScrollTo).not.toHaveBeenCalled()
      expect(mockGetElementById).not.toHaveBeenCalled()
      expect(mockFocus).not.toHaveBeenCalled()
    })

    it('should scroll to top when changing pathname even with a hash', () => {
      mockGetElementById.mockReturnValue(mockSkipContent)

      onRouteUpdate({
        location: { pathname: '/about', hash: '#section' },
        prevLocation: { pathname: '/' }
      })

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
      expect(mockGetElementById).toHaveBeenCalledWith('skip-nav-content')
      expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true })
    })
  })
})
