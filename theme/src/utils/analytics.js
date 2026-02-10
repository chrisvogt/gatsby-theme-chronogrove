/**
 * Analytics Utilities
 *
 * Provides a unified interface for tracking custom events across different
 * analytics platforms (Google Analytics, GA4, etc.)
 */

/**
 * Track a custom event
 *
 * @param {string} eventName - The name of the event (e.g., 'book_click', 'widget_interaction')
 * @param {Object} eventParams - Additional parameters to send with the event
 * @param {string} eventParams.category - Event category (e.g., 'Widget', 'Navigation')
 * @param {string} eventParams.label - Event label (e.g., 'Goodreads Book', 'GitHub Profile')
 * @param {string|number} eventParams.value - Event value (optional)
 * @param {Object} eventParams.customParams - Any additional custom parameters
 *
 * @example
 * trackEvent('book_click', {
 *   category: 'Goodreads Widget',
 *   label: 'The Great Gatsby',
 *   value: 1,
 *   customParams: {
 *     book_id: '12345',
 *     widget_name: 'goodreads'
 *   }
 * })
 */
export const trackEvent = (eventName, eventParams = {}) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return
  }

  const { category = 'User Interaction', label = '', value, customParams = {} } = eventParams

  try {
    // Google Analytics 4 (gtag.js) - Modern approach
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: category,
        event_label: label,
        value: value,
        ...customParams
      })

      if (process.env.NODE_ENV === 'development') {
        console.log('📊 GA4 Event Tracked:', {
          eventName,
          category,
          label,
          value,
          ...customParams
        })
      }
    }
    // Google Analytics Universal (ga) - Legacy support
    else if (typeof window.ga === 'function') {
      window.ga('send', 'event', {
        eventCategory: category,
        eventAction: eventName,
        eventLabel: label,
        eventValue: value
      })

      if (process.env.NODE_ENV === 'development') {
        console.log('📊 UA Event Tracked:', {
          eventName,
          category,
          label,
          value
        })
      }
    }
    // Development mode - log to console
    else if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event (No tracker found):', {
        eventName,
        category,
        label,
        value,
        ...customParams
      })
    }
  } catch (error) {
    // Silently fail in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Analytics tracking error:', error)
    }
  }
}

/**
 * Track widget interactions
 *
 * @param {string} widgetName - Name of the widget (e.g., 'goodreads', 'github', 'spotify')
 * @param {string} action - The action performed (e.g., 'click', 'view', 'hover')
 * @param {Object} additionalParams - Additional parameters
 */
export const trackWidgetInteraction = (widgetName, action, additionalParams = {}) => {
  trackEvent('widget_interaction', {
    category: 'Widget',
    label: `${widgetName} - ${action}`,
    customParams: {
      widget_name: widgetName,
      action,
      ...additionalParams
    }
  })
}

/**
 * Track external link clicks
 *
 * @param {string} url - The URL being clicked
 * @param {string} label - A descriptive label for the link
 */
export const trackExternalLink = (url, label = '') => {
  trackEvent('external_link_click', {
    category: 'Outbound Link',
    label: label || url,
    customParams: {
      url,
      link_domain: new URL(url).hostname
    }
  })
}

/**
 * Track navigation events
 *
 * @param {string} destination - Where the user is navigating to
 * @param {string} source - Where the navigation originated from
 */
export const trackNavigation = (destination, source = '') => {
  trackEvent('navigation', {
    category: 'Navigation',
    label: destination,
    customParams: {
      destination,
      source
    }
  })
}
