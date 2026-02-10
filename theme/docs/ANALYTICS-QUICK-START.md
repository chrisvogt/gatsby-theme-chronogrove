# Analytics Quick Start Guide

## What Was Set Up

I've implemented a complete custom event tracking system for your Gatsby site. Here's what's new:

### 1. Analytics Utility (`theme/src/utils/analytics.js`)

A reusable utility with four main functions:

- `trackEvent()` - Track any custom event
- `trackWidgetInteraction()` - Track widget interactions
- `trackExternalLink()` - Track outbound links
- `trackNavigation()` - Track navigation events

### 2. Example Implementation (`book-link.js`)

The Goodreads BookLink component now tracks when users click on books:

```javascript
trackWidgetInteraction('goodreads', 'book_click', {
  book_id: id,
  book_title: title
})
```

### 3. Complete Test Coverage

- `analytics.spec.js` - 11 tests covering all utility functions
- `book-link.spec.js` - Updated with analytics tracking test
- All tests passing ✅

## Quick Test

### 1. Start the dev server:

```bash
cd www.chrisvogt.me
yarn develop:https
```

### 2. Open browser DevTools (F12) and go to the Console tab

### 3. Visit your home page and click on a book in the Goodreads widget

### 4. You should see in the console:

```
📊 GA4 Event Tracked: {
  eventName: 'widget_interaction',
  category: 'Widget',
  label: 'goodreads - book_click',
  widget_name: 'goodreads',
  action: 'book_click',
  book_id: '...',
  book_title: '...'
}
```

## Add Tracking to Any Component

### Simple pattern:

```javascript
import { trackEvent } from '../utils/analytics'

const handleClick = () => {
  trackEvent('event_name', {
    category: 'Category',
    label: 'Descriptive label',
    customParams: {
      any_custom_data: 'value'
    }
  })
}
```

## View Events in Google Analytics

1. Go to your Google Analytics dashboard
2. Navigate to **Reports** → **Realtime** → **Events**
3. Perform actions on your site
4. See events appear in real-time!

For more details, see [ANALYTICS.md](./ANALYTICS.md)

## What Events Are Being Tracked?

### Automatic (from gatsby-plugin-google-analytics):

- ✅ `page_view` - Page visits
- ✅ `session_start` - New sessions
- ✅ `first_visit` - First-time visitors

### Custom (new):

- ✅ `widget_interaction` - When users interact with widgets
  - Currently: Goodreads book clicks
  - Ready to add: All other widget interactions

### Ready to implement:

- `external_link_click` - Outbound links
- `navigation` - Internal navigation
- `button_click` - Button interactions
- `form_submission` - Form submissions
- Any custom events you need!

## Next Steps

1. **Test it locally** - Click some books and watch the console
2. **Verify in GA4** - Check if events appear in Google Analytics
3. **Pick another component** - Add tracking to buttons, links, or other widgets
4. **Monitor and iterate** - Create GA4 dashboards to visualize your data

## Files Added/Modified

### New Files:

- ✅ `theme/src/utils/analytics.js` - Analytics utility
- ✅ `theme/src/utils/analytics.spec.js` - Unit tests
- ✅ `theme/docs/ANALYTICS.md` - Comprehensive guide
- ✅ `theme/docs/ANALYTICS-QUICK-START.md` - This file

### Modified Files:

- ✅ `theme/src/components/widgets/goodreads/book-link.js` - Added tracking
- ✅ `theme/src/components/widgets/goodreads/book-link.spec.js` - Updated tests

## Questions?

Check the full documentation in [ANALYTICS.md](./ANALYTICS.md) for:

- Detailed implementation examples
- Testing strategies
- Best practices
- Debugging tips
- Common patterns
