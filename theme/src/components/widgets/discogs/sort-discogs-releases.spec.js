import {
  DEFAULT_DISCOGS_SORT_MODE,
  DISCOGS_SORT_ADDED,
  DISCOGS_SORT_ALPHABETICAL,
  getDiscogsCollectionAddedMs,
  sortDiscogsReleases
} from './sort-discogs-releases'

const rel = (id, title, dateAdded = undefined) => ({
  id,
  dateAdded,
  basicInformation: { id, title, year: 2024, artists: [{ name: 'Artist' }] }
})

describe('sortDiscogsReleases', () => {
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
  })

  describe('DISCOGS_SORT_ALPHABETICAL', () => {
    it('orders by trimmed title ignoring case', () => {
      const out = sortDiscogsReleases([rel(1, 'Zen'), rel(2, 'alpha'), rel(3, 'Beta')], DISCOGS_SORT_ALPHABETICAL)
      expect(out.map(r => r.basicInformation.title)).toEqual(['alpha', 'Beta', 'Zen'])
    })

    it('is stable on equal titles', () => {
      const a = rel(1, 'Same')
      const b = rel(2, 'Same')
      const out = sortDiscogsReleases([a, b], DISCOGS_SORT_ALPHABETICAL)
      expect(out.map(r => r.id)).toEqual([1, 2])
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
  })
})
