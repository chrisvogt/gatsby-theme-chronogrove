/** How the Discogs vinyl collection is ordered client-side before pagination. */

export const DISCOGS_SORT_ADDED = 'added-to-collection'
export const DISCOGS_SORT_ALPHABETICAL = 'alphabetical'
export const DISCOGS_SORT_RELEASE_YEAR = 'release-year'

export const DEFAULT_DISCOGS_SORT_MODE = DISCOGS_SORT_ADDED

/**
 * Parses a collection “date added” from common API shapes (metrics / Discogs-style).
 *
 * Accepts camelCase / snake_case, ISO-like strings or epoch-ish numbers (seconds or ms).
 *
 * @param {unknown} release
 * @returns {number} UTC ms, or NaN if unknown
 */
export function getDiscogsCollectionAddedMs(release) {
  if (!release || typeof release !== 'object') return NaN
  const bi = release.basicInformation
  const candidates = [
    release.dateAdded,
    release.date_added,
    release.addedToCollection,
    release.added_to_collection,
    release.addedDate,
    release.added_at,
    bi?.dateAdded,
    bi?.date_added,
    bi?.addedToCollection,
    bi?.added_to_collection
  ].filter(v => v != null && v !== '')

  for (const raw of candidates) {
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      const asMs = raw < 2e11 ? raw * 1000 : raw
      return asMs
    }
    const t = Date.parse(String(raw))
    if (Number.isFinite(t)) return t
  }
  return NaN
}

function hasValidAddedMs(ms) {
  return Number.isFinite(ms) && ms > 0
}

function hasValidYear(y) {
  return Number.isFinite(y)
}

/**
 * Release year from `basicInformation.year` (Discogs often sends a number or numeric string).
 *
 * @param {unknown} release
 * @returns {number} four-digit year, or NaN
 */
export function getDiscogsReleaseYear(release) {
  if (!release || typeof release !== 'object') return NaN
  const raw = release.basicInformation?.year
  if (raw == null || raw === '') return NaN
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const y = Math.trunc(raw)
    return y >= 1000 && y <= 9999 ? y : NaN
  }
  const n = parseInt(String(raw).trim(), 10)
  return Number.isFinite(n) && n >= 1000 && n <= 9999 ? n : NaN
}

/**
 * Returns a shallow-sorted copy of `releases`.
 *
 * - **added-to-collection**: newest added first where timestamps exist; items without timestamps
 *   stay in stable catalog order alongside other undated items.
 * - **alphabetical**: sorts by album title (`basicInformation.title`) case-insensitively,
 *   ties by original position.
 * - **release-year**: newest release year first; items without a parseable year follow, in catalog order among themselves.
 *
 * @param {object[]} releases
 * @param {typeof DISCOGS_SORT_ADDED | typeof DISCOGS_SORT_ALPHABETICAL | typeof DISCOGS_SORT_RELEASE_YEAR | string} sortMode
 * @returns {object[]}
 */
export function sortDiscogsReleases(releases, sortMode) {
  if (!Array.isArray(releases) || releases.length === 0) return []

  const tagged = releases.map((r, index) => ({ r, index }))

  if (sortMode === DISCOGS_SORT_ALPHABETICAL) {
    tagged.sort((a, b) => {
      const tA = (a.r.basicInformation?.title ?? '').trim().toLocaleLowerCase()
      const tB = (b.r.basicInformation?.title ?? '').trim().toLocaleLowerCase()
      const cmp = tA.localeCompare(tB, undefined, { sensitivity: 'base', numeric: true })
      return cmp !== 0 ? cmp : a.index - b.index
    })
    return tagged.map(({ r }) => r)
  }

  if (sortMode === DISCOGS_SORT_RELEASE_YEAR) {
    tagged.sort((a, b) => {
      const yA = getDiscogsReleaseYear(a.r)
      const yB = getDiscogsReleaseYear(b.r)
      const hasA = hasValidYear(yA)
      const hasB = hasValidYear(yB)
      if (hasA && hasB && yA !== yB) return yB - yA
      if (hasA && !hasB) return -1
      if (!hasA && hasB) return 1
      return a.index - b.index
    })
    return tagged.map(({ r }) => r)
  }

  tagged.sort((a, b) => {
    const tsA = getDiscogsCollectionAddedMs(a.r)
    const tsB = getDiscogsCollectionAddedMs(b.r)
    const hasA = hasValidAddedMs(tsA)
    const hasB = hasValidAddedMs(tsB)
    if (hasA && hasB && tsA !== tsB) return tsB - tsA
    if (hasA && !hasB) return -1
    if (!hasA && hasB) return 1
    return a.index - b.index
  })
  return tagged.map(({ r }) => r)
}
