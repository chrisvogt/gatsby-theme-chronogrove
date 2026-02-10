# Discogs Widget

A widget that displays a user's vinyl record collection from Discogs as circular vinyl records with hover effects.

## Features

- Displays vinyl records as circular, rotating elements that look like actual vinyl records
- Shows album artwork in the center of each vinyl record
- Hover effects reveal album title, artist, and year
- Rotation animation on hover for a realistic vinyl effect
- Clicking opens the Discogs release page in a new tab
- Uses CDN-optimized images for fast loading
- **Pagination**: Shows 3 rows (18 records) per page for better performance
- **Swipe/Drag Support**: Mobile users can swipe left/right, desktop users can drag with mouse
- **Theme-Consistent Controls**: Pagination buttons match your site's design system
- Responsive grid layout that adapts to different screen sizes

## Configuration

Add to your site metadata in `gatsby-config.js`:

```javascript
module.exports = {
  siteMetadata: {
    widgets: {
      discogs: {
        widgetDataSource: 'https://metrics.chrisvogt.me/api/widgets/discogs'
      }
    }
  }
}
```

## API Data Structure

The widget expects data from the `/api/widgets/discogs` endpoint with this structure:

```javascript
{
  "collections": {
    "releases": [
      {
        "id": 28461454,
        "basicInformation": {
          "id": 28461454,
          "title": "Album Title",
          "year": 2023,
          "artists": [{"name": "Artist Name"}],
          "cdnThumbUrl": "https://cdn.example.com/thumb.jpg",
          "resourceUrl": "https://discogs.com/release/123"
        }
      }
    ]
  },
  "metrics": {
    "Vinyls Owned": 37
  },
  "profile": {
    "profileURL": "https://www.discogs.com/user/username/collection"
  }
}
```

## Components

- `discogs-widget.js` - Main widget component with data fetching and layout
- `vinyl-collection.js` - Renders the vinyl records in a grid with visual effects and pagination
- `vinyl-pagination.js` - Pagination component with swipe/drag support and theme-consistent controls
- `index.js` - Export file for the widget

## Styling

The vinyl records use CSS transformations and pseudo-elements to create:

- Circular vinyl record appearance with grooves
- Center label effect
- Hover animations (scaling, lifting, rotation)
- Responsive grid that shows different numbers of records per row based on screen size
