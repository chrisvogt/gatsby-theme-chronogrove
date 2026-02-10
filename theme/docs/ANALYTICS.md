# Custom Analytics Implementation Guide

## Overview

This guide explains how custom event tracking is implemented in the Gatsby Theme Chronogrove and how to add custom events to any component.

## What's Currently Set Up

### 1. Google Analytics Plugin

In `www.chrisvogt.me/gatsby-config.js`, you have:

```javascript
{
  resolve: 'gatsby-plugin-google-analytics',
  options: {
    trackingId: process.env.GA_PROPERTY_ID,
    head: false,
    respectDNT: true
  }
}
```

This plugin automatically tracks:

- `page_view` - When users visit pages
- `session_start` - When a new session begins
- `first_visit` - When a user visits for the first time

### 2. Custom Event Tracking Utility

Located at `theme/src/utils/analytics.js`, this utility provides:

- **`trackEvent()`** - Generic event tracking
- **`trackWidgetInteraction()`** - Widget-specific interactions
- **`trackExternalLink()`** - Outbound link clicks
- **`trackNavigation()`** - Internal navigation events

### 3. Example Implementation

The **Goodreads BookLink** component (`theme/src/components/widgets/goodreads/book-link.js`) demonstrates custom event tracking when users click on books.

## How to Test in Development

### 1. Enable Development Console Logging

The analytics utility logs events to the console when `NODE_ENV === 'development'`:

```bash
cd www.chrisvogt.me
yarn develop:https
```

### 2. Open Developer Tools

1. Open your browser's developer console (F12 or Cmd+Option+I)
2. Navigate to https://www.dev-chrisvogt.me (or your local dev URL)
3. Click on a book in the Goodreads widget
4. You should see:
   ```
   📊 GA4 Event Tracked: {
     eventName: 'widget_interaction',
     category: 'Widget',
     label: 'goodreads - book_click',
     widget_name: 'goodreads',
     action: 'book_click',
     book_id: '123',
     book_title: 'The Great Gatsby'
   }
   ```

### 3. Verify in Google Analytics

1. Go to Google Analytics
2. Navigate to **Reports** → **Realtime** → **Events**
3. Perform an action on your site
4. You should see the custom event appear within seconds

Alternatively, use the **DebugView** in GA4:

1. Install the Google Analytics Debugger Chrome extension
2. Enable it for your development site
3. Go to Google Analytics → **Admin** → **DebugView**
4. Perform actions and see events in real-time with full details

## Adding Custom Events to Other Components

### Example 1: Track Button Clicks

```javascript
/** @jsx jsx */
import { jsx } from 'theme-ui'
import { trackEvent } from '../utils/analytics'

const Button = ({ variant = 'primary', onClick, children, ...props }) => {
  const handleClick = e => {
    // Track the button click
    trackEvent('button_click', {
      category: 'User Interaction',
      label: children?.toString() || 'Button',
      customParams: {
        button_variant: variant
      }
    })

    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      sx={{
        appearance: 'none',
        // ... rest of styles
        variant: `buttons.${variant}`
      }}
    >
      {children}
    </button>
  )
}

export default Button
```

### Example 2: Track Widget Loads

```javascript
import { useEffect } from 'react'
import { trackWidgetInteraction } from '../../../utils/analytics'

const SpotifyWidget = () => {
  useEffect(() => {
    // Track when widget successfully loads
    trackWidgetInteraction('spotify', 'load', {
      timestamp: Date.now()
    })
  }, [])

  return (
    // ... widget JSX
  )
}
```

### Example 3: Track External Links

```javascript
import { trackExternalLink } from '../../utils/analytics'

const ExternalLink = ({ href, children, ...props }) => {
  const handleClick = () => {
    trackExternalLink(href, children?.toString() || href)
  }

  return (
    <a href={href} onClick={handleClick} target='_blank' rel='noopener noreferrer' {...props}>
      {children}
    </a>
  )
}
```

### Example 4: Track Form Submissions

```javascript
import { trackEvent } from '../../utils/analytics'

const ContactForm = () => {
  const handleSubmit = e => {
    e.preventDefault()

    trackEvent('form_submission', {
      category: 'Engagement',
      label: 'Contact Form',
      customParams: {
        form_name: 'contact'
      }
    })

    // ... handle form submission
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>
}
```

## Common Event Patterns

### Widget Interactions

```javascript
trackWidgetInteraction('widget_name', 'action', {
  // Additional context
  item_id: '123',
  item_name: 'Example Item'
})
```

**Common actions:**

- `load` - Widget loaded successfully
- `click` - User clicked an item
- `expand` - User expanded content
- `collapse` - User collapsed content
- `filter` - User applied a filter
- `sort` - User changed sorting

### User Engagement

```javascript
trackEvent('event_name', {
  category: 'Engagement',
  label: 'Descriptive Label',
  value: 1, // Optional numeric value
  customParams: {
    // Additional context
  }
})
```

**Common events:**

- `scroll_depth` - User scrolled to certain point
- `time_on_page` - User spent X seconds on page
- `video_play` - User played a video
- `download` - User downloaded a file
- `share` - User shared content

## Testing Custom Events

### Unit Tests

Always add tests for your analytics tracking:

```javascript
import { trackWidgetInteraction } from '../../../utils/analytics'

jest.mock('../../../utils/analytics', () => ({
  trackWidgetInteraction: jest.fn()
}))

it('tracks analytics event on interaction', () => {
  render(<YourComponent />)
  const element = screen.getByTestId('interactive-element')

  fireEvent.click(element)

  expect(trackWidgetInteraction).toHaveBeenCalledWith('widget_name', 'action', {
    // Expected parameters
  })
})
```

### Integration Tests

For end-to-end testing with actual Google Analytics:

1. Use a test GA property (separate from production)
2. Set `GATSBY_GA_PROPERTY_ID` to your test property ID
3. Build and test in a staging environment
4. Verify events in GA4 Realtime reports

## Best Practices

### 1. Event Naming

- Use **snake_case** for event names: `button_click`, `widget_interaction`
- Be consistent across your application
- Use descriptive names that indicate the action

### 2. Categories

Common categories to use:

- `Widget` - Widget interactions
- `Navigation` - Internal navigation
- `Outbound Link` - External links
- `User Interaction` - Buttons, forms, etc.
- `Engagement` - Content engagement (scroll, time, video play)

### 3. Labels

- Make labels descriptive and human-readable
- Include context: `goodreads - book_click` instead of just `click`
- Use labels to filter and segment in GA4

### 4. Custom Parameters

- Add context that helps you understand user behavior
- Keep parameter names consistent
- Don't send PII (personally identifiable information)

### 5. Performance

- The analytics utility is lightweight and won't impact performance
- Events are tracked asynchronously
- Failed tracking won't break your app (graceful degradation)

## Debugging

### Events Not Appearing in GA4?

1. **Check the tracking ID:**

   ```bash
   echo $GA_PROPERTY_ID
   ```

2. **Check browser console:**
   - Open DevTools → Console
   - Look for `📊 GA4 Event Tracked:` messages
   - If you see them, tracking is working locally

3. **Check network tab:**
   - Open DevTools → Network tab
   - Filter by `collect` or `google-analytics`
   - You should see requests to `www.google-analytics.com/collect`

4. **Verify GA4 is installed:**

   ```javascript
   // In browser console
   console.log(typeof window.gtag)
   // Should output: "function"
   ```

5. **Check for ad blockers:**
   - Disable ad blockers/privacy extensions
   - They often block Google Analytics

### Events Working Locally but Not in Production?

1. Verify environment variable is set in production
2. Check if `gatsby-plugin-google-analytics` is in production config
3. Verify the domain is not filtered in GA4 settings

## Next Steps

Now that you have custom event tracking set up:

1. **Identify key interactions** to track across your site
2. **Add tracking** to those components using the patterns above
3. **Test locally** using the browser console
4. **Verify in GA4** using Realtime or DebugView
5. **Create dashboards** in GA4 to monitor your custom events
6. **Iterate** based on what you learn from the data

## Additional Resources

- [Google Analytics 4 Events Documentation](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Gatsby Plugin Google Analytics](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-analytics/)
- [Theme Analytics Utility Source Code](../src/utils/analytics.js)
- [Example: BookLink Component](../src/components/widgets/goodreads/book-link.js)
