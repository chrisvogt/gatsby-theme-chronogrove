# Steam Widget

The Steam widget displays information about a user's Steam profile, including recently played games and owned games.

## Features

### My Games Section

- Displays a table of all owned games
- Shows game icons, names, and play time statistics
- Links to Steam store pages for each game
- Uses Theme UI table styles for consistent styling

### Recently-Played Games Section

- Shows games played in the last two weeks
- Displays game cards with headers and play time
- Grid layout for responsive design

## Components

### SteamWidget

Main widget component that orchestrates the display of Steam data.

**Props:** None (uses Redux store for data)

**Features:**

- Fetches Steam data from configured data source
- Displays profile metrics
- Shows both owned games table and recently played games
- Handles loading states

### OwnedGamesTable

Table component for displaying owned games.

**Props:**

- `games` (Array): Array of game objects from Steam API

**Features:**

- Responsive table layout
- Game icons and names with links
- Total and recent play time display
- Empty state handling

## Data Structure

The widget expects Steam API data in the following format:

```javascript
{
  metrics: [...],
  profile: {
    displayName: string,
    profileURL: string
  },
  collections: {
    recentlyPlayedGames: [
      {
        id: number,
        displayName: string,
        playTime2Weeks: number,
        images: {
          header: string
        }
      }
    ],
    ownedGames: [
      {
        id: number,
        displayName: string,
        playTimeForever: number,
        playTime2Weeks: number | null,
        images: {
          icon: string
        }
      }
    ]
  }
}
```

## Usage

The Steam widget is automatically included in the home page when a Steam data source is configured in the site metadata.

To configure the Steam widget, add the following to your `gatsby-config.js`:

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-chronogrove',
      options: {
        widgets: {
          steam: {
            widgetDataSource: 'https://your-steam-api-endpoint.com'
          }
        }
      }
    }
  ]
}
```

## Styling

The widget uses Theme UI for styling and includes:

- Responsive grid layouts
- Consistent table styling
- Hover effects on interactive elements
- Dark/light mode support
