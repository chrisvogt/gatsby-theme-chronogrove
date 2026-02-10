import { trackEvent, trackWidgetInteraction, trackExternalLink, trackNavigation } from './analytics'

describe('Analytics Utils', () => {
  let gtagMock
  let gaMock
  let consoleLogSpy

  beforeEach(() => {
    // Reset window.gtag and window.ga
    gtagMock = jest.fn()
    gaMock = jest.fn()
    window.gtag = gtagMock
    window.ga = gaMock

    // Spy on console.log for development mode
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    delete window.gtag
    delete window.ga
    consoleLogSpy.mockRestore()
  })

  describe('trackEvent', () => {
    it('should call gtag when available (GA4)', () => {
      trackEvent('test_event', {
        category: 'Test Category',
        label: 'Test Label',
        value: 42
      })

      expect(gtagMock).toHaveBeenCalledWith('event', 'test_event', {
        event_category: 'Test Category',
        event_label: 'Test Label',
        value: 42
      })
    })

    it('should call ga when gtag is not available (Universal Analytics)', () => {
      delete window.gtag

      trackEvent('test_event', {
        category: 'Test Category',
        label: 'Test Label',
        value: 42
      })

      expect(gaMock).toHaveBeenCalledWith('send', 'event', {
        eventCategory: 'Test Category',
        eventAction: 'test_event',
        eventLabel: 'Test Label',
        eventValue: 42
      })
    })

    it('should use default category when not provided', () => {
      trackEvent('test_event')

      expect(gtagMock).toHaveBeenCalledWith('event', 'test_event', {
        event_category: 'User Interaction',
        event_label: '',
        value: undefined
      })
    })

    it('should include custom parameters', () => {
      trackEvent('test_event', {
        category: 'Test',
        customParams: {
          custom_field: 'custom_value',
          another_field: 123
        }
      })

      expect(gtagMock).toHaveBeenCalledWith('event', 'test_event', {
        event_category: 'Test',
        event_label: '',
        value: undefined,
        custom_field: 'custom_value',
        another_field: 123
      })
    })

    it('should not throw when analytics is not available', () => {
      delete window.gtag
      delete window.ga

      expect(() => {
        trackEvent('test_event')
      }).not.toThrow()
    })

    it('should not throw in SSR environment', () => {
      // In real SSR, window would be undefined, but Jest provides window by default
      // This test ensures the function doesn't crash - actual SSR testing would
      // require a Node environment without jsdom
      expect(() => {
        trackEvent('test_event')
      }).not.toThrow()
    })
  })

  describe('trackWidgetInteraction', () => {
    it('should track widget interactions with correct format', () => {
      trackWidgetInteraction('goodreads', 'click', {
        book_id: '123',
        book_title: 'Test Book'
      })

      expect(gtagMock).toHaveBeenCalledWith('event', 'widget_interaction', {
        event_category: 'Widget',
        event_label: 'goodreads - click',
        value: undefined,
        widget_name: 'goodreads',
        action: 'click',
        book_id: '123',
        book_title: 'Test Book'
      })
    })
  })

  describe('trackExternalLink', () => {
    it('should track external link clicks with URL', () => {
      trackExternalLink('https://example.com/page', 'Example Link')

      expect(gtagMock).toHaveBeenCalledWith('event', 'external_link_click', {
        event_category: 'Outbound Link',
        event_label: 'Example Link',
        value: undefined,
        url: 'https://example.com/page',
        link_domain: 'example.com'
      })
    })

    it('should use URL as label if label is not provided', () => {
      trackExternalLink('https://example.com/page')

      expect(gtagMock).toHaveBeenCalledWith('event', 'external_link_click', {
        event_category: 'Outbound Link',
        event_label: 'https://example.com/page',
        value: undefined,
        url: 'https://example.com/page',
        link_domain: 'example.com'
      })
    })
  })

  describe('trackNavigation', () => {
    it('should track navigation events', () => {
      trackNavigation('/about', 'header_menu')

      expect(gtagMock).toHaveBeenCalledWith('event', 'navigation', {
        event_category: 'Navigation',
        event_label: '/about',
        value: undefined,
        destination: '/about',
        source: 'header_menu'
      })
    })

    it('should work without source parameter', () => {
      trackNavigation('/blog')

      expect(gtagMock).toHaveBeenCalledWith('event', 'navigation', {
        event_category: 'Navigation',
        event_label: '/blog',
        value: undefined,
        destination: '/blog',
        source: ''
      })
    })
  })
})
