# Local widget API (static JSON fallback)

**Placeholder until backend recovery**: The metrics API at metrics.chrisvogt.me was shut down by Firebase (flagged as phishing; appeal submitted). Until the backend is recovered, widget data is loaded from this folder — static JSON backups served from the site root instead of the live API.

## Quick setup

Copy your backup JSON files here with these exact names:

| Widget    | Filename         |
| --------- | ---------------- |
| Discogs   | `discogs.json`   |
| Flickr    | `flickr.json`    |
| GitHub    | `github.json`    |
| Goodreads | `goodreads.json` |
| Spotify   | `spotify.json`   |
| Steam     | `steam.json`     |

## Response shape

The theme accepts either:

- **Wrapped** (like the old API): `{ "payload": { ... your data ... } }`
- **Raw**: The widget payload object directly (e.g. `{ "collections": { ... } }` or whatever shape the widget expects)

Use the same shape as your backups; the hook uses `data.payload ?? data`.

## How it works

Files in `static/` are served at the site root. So `static/api/steam.json` is available at `/api/steam.json`. The Gatsby config points each widget’s `widgetDataSource` at these URLs so the app fetches from the same origin (no external API needed).
