# Discogs Widget

A widget that displays a Discogs vinyl collection as circular records with hover effects.

## Features

- Displays vinyl records as circular, rotating elements that look like actual vinyl records
- Shows album artwork in the center of each vinyl record
- Hover effects reveal album title, artist, and year
- Rotation animation on hover for a realistic vinyl effect
- Clicking opens the Discogs release page in a new tab
- Uses CDN-optimized images for fast loading
- **Pagination**: Shows 2 rows per page (items per page = columns × 2, e.g. 10 records at the widest breakpoint using 5 columns) for better performance
- **Swipe/Drag Support**: Mobile users can swipe left/right, desktop users can drag with mouse
- **Theme-Consistent Controls**: Pagination buttons match your site's design system
- **Sort**: Visitors can switch among **order added to collection** (default, newest first when `dateAdded` is present), **alphabetical by album title**, and **release year** (`basicInformation.year`, **newest year first**; missing years sort after dated items).
- **Layout**: Visitors can switch between **grid** (default) and **list**. List mode is a **flat register / panel**: one tight outer border, hairline dividers between rows, no elevated cards; miniature vinyl artwork and **click / Enter** still open the details **modal** like the grid.
- **List pagination**: **`items per page = columns × 2`** (aligned with **grid** density, e.g. **10** per slide from 1024px–1279px at **5 columns**).
- Responsive grid/list layout across screen sizes

## Configuration

Add this to the theme options in your `gatsby-config.js`:

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-chronogrove',
      options: {
        widgets: {
          discogs: {
            widgetDataSource: 'https://metrics.chrisvogt.me/api/widgets/discogs'
          }
        }
      }
    }
  ]
}
```

## API Data Structure

The widget expects data from a Discogs widget endpoint with this structure:

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
        },
        "dateAdded": "2025-01-01T12:00:00.000Z"
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
- `vinyl-collection.js` - Renders the vinyl records in grid or bordered list “register” layouts, swipe carousel, pagination, sort, and view controls.
- `sort-discogs-releases.js` - Client-side sort by collection date (`dateAdded` and aliases), **`basicInformation.year`** (release year), or album title.
- `vinyl-pagination.js` - Pagination component with swipe/drag support and theme-consistent controls
- `index.js` - Export file for the widget

## Styling

The vinyl records use CSS transformations and pseudo-elements to create:

- Circular vinyl record appearance with grooves
- Center label effect
- Hover animations (scaling, lifting, rotation)
- Responsive grid that shows different numbers of records per row based on screen size
