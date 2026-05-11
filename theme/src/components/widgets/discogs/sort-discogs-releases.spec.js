import {
  DEFAULT_DISCOGS_SORT_MODE,
  DISCOGS_SORT_ADDED,
  DISCOGS_SORT_ALPHABETICAL,
  DISCOGS_SORT_ALPHABETICAL_ARTIST,
  DISCOGS_SORT_RELEASE_YEAR,
  getDiscogsCollectionAddedMs,
  getDiscogsReleaseYear,
  sortDiscogsReleases
} from './sort-discogs-releases'

const rel = (id, title, dateAdded = undefined) => ({
  id,
  dateAdded,
  basicInformation: { id, title, year: 2024, artists: [{ name: 'Artist' }] }
})

describe('sortDiscogsReleases', () => {
  it('returns an empty array for empty input', () => {
    expect(sortDiscogsReleases([], DISCOGS_SORT_ADDED)).toEqual([])
  })

  describe('DEFAULT_DISCOGS_SORT_MODE', () => {
    it('is added-to-collection', () => {
      expect(DEFAULT_DISCOGS_SORT_MODE).toBe(DISCOGS_SORT_ADDED)
    })
  })

  describe('getDiscogsCollectionAddedMs', () => {
    it('reads ISO-like strings', () => {
      const ms = Date.parse('2025-06-01T12:00:00.000Z')
      expect(getDiscogsCollectionAddedMs(rel(1, 'A', '2025-06-01T12:00:00.000Z'))).toBe(ms)
    })

    it('reads unix seconds vs ms', () => {
      expect(getDiscogsCollectionAddedMs(rel(1, 'A', 1_700_000_000))).toBe(1_700_000_000_000)
      expect(getDiscogsCollectionAddedMs(rel(1, 'A', 1_700_000_000_000))).toBe(1_700_000_000_000)
    })

    it('reads snake_case on release', () => {
      expect(
        getDiscogsCollectionAddedMs({
          id: 1,
          date_added: '2024-01-02',
          basicInformation: { title: 'T' }
        })
      ).toBe(Date.parse('2024-01-02'))
    })

    it('returns NaN when missing', () => {
      expect(getDiscogsCollectionAddedMs(rel(1, 'A'))).toBeNaN()
    })

    it('returns NaN for nullish or non-object releases', () => {
      expect(getDiscogsCollectionAddedMs(null)).toBeNaN()
      expect(getDiscogsCollectionAddedMs(undefined)).toBeNaN()
      expect(getDiscogsCollectionAddedMs('broken')).toBeNaN()
    })

    it('reads basicInformation camelCase aliases', () => {
      expect(
        getDiscogsCollectionAddedMs({
          id: 1,
          basicInformation: {
            title: 'T',
            added_to_collection: '2026-07-08T09:10:11.000Z'
          }
        })
      ).toBe(Date.parse('2026-07-08T09:10:11.000Z'))
    })

    it('advances candidates when earlier values are invalid strings', () => {
      expect(
        getDiscogsCollectionAddedMs({
          id: 1,
          dateAdded: 'not-a-real-date-string',
          date_added: '2019-12-31',
          basicInformation: { title: 'T' }
        })
      ).toBe(Date.parse('2019-12-31'))
    })

    it('prefers milliseconds when numeric value is huge', () => {
      expect(getDiscogsCollectionAddedMs(rel(1, 'Big', 2e12))).toBe(2e12)
    })
  })

  describe('getDiscogsReleaseYear', () => {
    it('reads integer year', () => {
      expect(getDiscogsReleaseYear(rel(1, 'A'))).toBe(2024)
    })

    it('reads year string', () => {
      expect(
        getDiscogsReleaseYear({
          id: 1,
          basicInformation: { title: 'T', year: '1999', artists: [] }
        })
      ).toBe(1999)
    })

    it('returns NaN when missing or invalid', () => {
      expect(getDiscogsReleaseYear({ id: 1, basicInformation: { title: 'T' } })).toBeNaN()
      expect(getDiscogsReleaseYear({ id: 1, basicInformation: { title: 'T', year: 12, artists: [] } })).toBeNaN()
      expect(getDiscogsReleaseYear({ id: 1, basicInformation: { title: 'T', year: 0, artists: [] } })).toBeNaN()
      expect(getDiscogsReleaseYear({ id: 1, basicInformation: { title: 'T', year: '0', artists: [] } })).toBeNaN()
    })

    it('returns NaN when release argument is unusable', () => {
      expect(getDiscogsReleaseYear(null)).toBeNaN()
      expect(getDiscogsReleaseYear(undefined)).toBeNaN()
      expect(getDiscogsReleaseYear(42)).toBeNaN()
    })
  })

  describe('DISCOGS_SORT_ALPHABETICAL', () => {
    it('orders by trimmed title ignoring case', () => {
      const out = sortDiscogsReleases([rel(1, 'Zen'), rel(2, 'alpha'), rel(3, 'Beta')], DISCOGS_SORT_ALPHABETICAL)
      expect(out.map(r => r.basicInformation.title)).toEqual(['alpha', 'Beta', 'Zen'])
    })

    it('is stable on equal titles', () => {
      const a = rel(1, 'Same')
      const b = rel(2, 'Same')
      const out = sortDiscogsReleases([b, a], DISCOGS_SORT_ALPHABETICAL)
      expect(out.map(r => r.id)).toEqual([2, 1])
    })
  })

  describe('DISCOGS_SORT_ALPHABETICAL_ARTIST', () => {
    const relArtist = (id, title, artistName) => ({
      id,
      basicInformation: { id, title, artists: [{ name: artistName }] }
    })

    it('orders by artist name ignoring case', () => {
      const out = sortDiscogsReleases(
        [relArtist(1, 'Album', 'Zen'), relArtist(2, 'Album', 'alpha'), relArtist(3, 'Album', 'Beta')],
        DISCOGS_SORT_ALPHABETICAL_ARTIST
      )
      expect(out.map(r => r.id)).toEqual([2, 3, 1])
    })

    it('is stable among equal artists', () => {
      const a = relArtist(1, 'A', 'Same')
      const b = relArtist(2, 'B', 'Same')
      const out = sortDiscogsReleases([b, a], DISCOGS_SORT_ALPHABETICAL_ARTIST)
      expect(out.map(r => r.id)).toEqual([2, 1])
    })

    it('ignores leading "The " when filing by artist', () => {
      const beatles = relArtist(1, 'A', 'The Beatles')
      const abba = relArtist(2, 'B', 'ABBA')
      const out = sortDiscogsReleases([beatles, abba], DISCOGS_SORT_ALPHABETICAL_ARTIST)
      expect(out.map(r => r.id)).toEqual([abba.id, beatles.id])
    })

    it('sorts multiple artists using join order like the UI line', () => {
      const single = relArtist(1, 'X', 'A')
      const collab = {
        id: 2,
        basicInformation: { id: 2, title: 'Y', artists: [{ name: 'B' }, { name: 'A' }] }
      }
      const out = sortDiscogsReleases([collab, single], DISCOGS_SORT_ALPHABETICAL_ARTIST)
      expect(out.map(r => r.id)).toEqual([single.id, collab.id])
    })

    it('treats missing artists array as empty filing key before named artists', () => {
      const noArtists = { id: 10, basicInformation: { title: 'A' } }
      const zed = relArtist(20, 'B', 'Zebra')
      const out = sortDiscogsReleases([zed, noArtists], DISCOGS_SORT_ALPHABETICAL_ARTIST)
      expect(out.map(r => r.id)).toEqual([10, 20])
    })

    it('coerces malformed artist slots when joining names', () => {
      const messy = {
        id: 1,
        basicInformation: { title: 'T', artists: [{ name: null }, {}, { name: '   ' }, { name: 'Valid' }] }
      }
      const other = relArtist(2, 'T', 'Zebra')
      const out = sortDiscogsReleases([other, messy], DISCOGS_SORT_ALPHABETICAL_ARTIST)
      expect(out.map(r => r.id)).toEqual([1, 2])
    })

    it('treats leading The article solo as empty filing key', () => {
      const theOnly = relArtist(9, 'A', 'The ')
      const zebra = relArtist(8, 'B', 'Zebra')
      const out = sortDiscogsReleases([zebra, theOnly], DISCOGS_SORT_ALPHABETICAL_ARTIST)
      expect(out.map(r => r.id)).toEqual([9, 8])
    })
  })

  describe('DISCOGS_SORT_RELEASE_YEAR', () => {
    const relY = (id, title, year) => ({
      id,
      basicInformation: { id, title, year, artists: [{ name: 'X' }] }
    })

    it('orders newest release year first', () => {
      const out = sortDiscogsReleases(
        [relY(1, 'Old', 1990), relY(2, 'New', 2024), relY(3, 'Mid', 2010)],
        DISCOGS_SORT_RELEASE_YEAR
      )
      expect(out.map(r => r.id)).toEqual([2, 3, 1])
    })

    it('keeps catalog order among equal years', () => {
      const a = relY(1, 'A', 2000)
      const b = relY(2, 'B', 2000)
      const out = sortDiscogsReleases([b, a], DISCOGS_SORT_RELEASE_YEAR)
      expect(out.map(r => r.id)).toEqual([2, 1])
    })

    it('puts unknown year after known years', () => {
      const known = relY(1, 'K', 2000)
      const unknown = { id: 2, basicInformation: { title: 'U', artists: [] } }
      const out = sortDiscogsReleases([unknown, known], DISCOGS_SORT_RELEASE_YEAR)
      expect(out.map(r => r.id)).toEqual([1, 2])
    })

    it('keeps catalog order when neither release has known year', () => {
      const u1 = { id: 101, basicInformation: { title: 'A', artists: [] } }
      const u2 = { id: 202, basicInformation: { title: 'B', artists: [] } }
      const out = sortDiscogsReleases([u2, u1], DISCOGS_SORT_RELEASE_YEAR)
      expect(out.map(r => r.id)).toEqual([202, 101])
    })
  })

  describe('DISCOGS_SORT_ADDED (default date behavior)', () => {
    it('puts newer added items first when timestamps present', () => {
      const old = rel(10, 'O', '2024-01-01T00:00:00Z')
      const neo = rel(20, 'N', '2025-06-01T00:00:00Z')
      const mid = rel(30, 'M', '2024-06-15T12:30:00Z')
      const out = sortDiscogsReleases([old, neo, mid], DISCOGS_SORT_ADDED)
      expect(out.map(r => r.id)).toEqual([20, 30, 10])
    })

    it('keeps catalog order among items without timestamps', () => {
      const a = rel(1, 'A')
      const b = rel(2, 'B')
      const out = sortDiscogsReleases([b, a], DISCOGS_SORT_ADDED)
      expect(out.map(r => r.id)).toEqual([2, 1])
    })

    it('puts timestamped releases before unknown dates', () => {
      const withTs = rel(1, 'T', '2025-01-01')
      const noTs = rel(2, 'N')
      const out = sortDiscogsReleases([noTs, withTs], DISCOGS_SORT_ADDED)
      expect(out.map(r => r.id)).toEqual([1, 2])
    })

    it('keeps catalog order when added timestamps tie', () => {
      const t = '2025-06-06T06:06:06.000Z'
      const a = rel(1, 'One', t)
      const b = rel(2, 'Two', t)
      const out = sortDiscogsReleases([b, a], DISCOGS_SORT_ADDED)
      expect(out.map(r => r.id)).toEqual([2, 1])
    })

    it('orders mixed missing timestamps deterministically vs known dates', () => {
      const hasTsFirst = rel(1, 'A', '2099-01-01')
      const noTsMiddle = rel(2, 'B')
      const noTsTrailing = rel(3, 'C')
      const out = sortDiscogsReleases([noTsTrailing, hasTsFirst, noTsMiddle], DISCOGS_SORT_ADDED)
      expect(out.map(r => r.id)).toEqual([1, 3, 2])
    })
  })

  describe('unknown sort mode fallback', () => {
    it('behaves like date-added ordering when mode is unrecognized', () => {
      const past = rel(1, 'First', '2010-01-01')
      const future = rel(2, 'Later', '2040-01-01')
      const out = sortDiscogsReleases([past, future], 'not-a-real-sort-mode-token')
      expect(out.map(r => r.id)).toEqual([2, 1])
    })
  })
})
