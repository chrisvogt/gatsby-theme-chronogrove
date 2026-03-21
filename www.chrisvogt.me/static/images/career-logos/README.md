# Career curve logos

Drop company logo images here to show them in the career-path curve avatars on the About page.

- **Location:** Files in this folder are served at `/images/career-logos/` (for example, `godaddy.png` becomes `/images/career-logos/godaddy.png`).
- **Wiring:** In `components/CareerPathCurve.js`, add an entry to the `CAREER_LOGOS` object that maps the **exact** company name to the image path, for example `'GoDaddy': '/images/career-logos/godaddy.png'`.
- **Company name keys** (from `career-path.json`):
  `GoDaddy`, `OfficeMax Print & Document Services`, `FedEx Kinko's`, `Robert Half & TEKsystems`, `Apogee Physicians`, `Encore Discovery Solutions`, `Pan Am Education`, `Salucro Healthcare Solutions`, `Art In Reality, LLC`
- **Formats:** PNG, SVG, or WebP all work well. Keep files small, such as `64x64` or `128x128`, for fast loading.
