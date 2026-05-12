import { formatAiSummarySyncedLabel, pickAiSummarySyncedAtRaw } from './ai-summary-synced-at'

describe('pickAiSummarySyncedAtRaw', () => {
  it('returns undefined for non-objects', () => {
    expect(pickAiSummarySyncedAtRaw(null)).toBeUndefined()
    expect(pickAiSummarySyncedAtRaw(undefined)).toBeUndefined()
    expect(pickAiSummarySyncedAtRaw('x')).toBeUndefined()
  })

  it('prefers meta.synced (metrics API)', () => {
    expect(
      pickAiSummarySyncedAtRaw({
        meta: { synced: '2026-05-12T04:39:04.742Z' },
        aiSummaryUpdatedAt: 'should-not-win'
      })
    ).toBe('2026-05-12T04:39:04.742Z')
  })

  it('prefers aiSummaryUpdatedAt when meta.synced is absent', () => {
    expect(
      pickAiSummarySyncedAtRaw({
        aiSummaryUpdatedAt: 'a',
        aiSummarySyncedAt: 'b',
        syncedAt: 'c'
      })
    ).toBe('a')
  })

  it('falls back through known keys', () => {
    expect(pickAiSummarySyncedAtRaw({ aiSummarySyncedAt: 's' })).toBe('s')
    expect(pickAiSummarySyncedAtRaw({ aiSummaryGeneratedAt: 'g' })).toBe('g')
    expect(pickAiSummarySyncedAtRaw({ syncedAt: 1700000000 })).toBe(1700000000)
  })

  it('uses fallbacks when meta lacks synced', () => {
    expect(pickAiSummarySyncedAtRaw({ meta: {}, aiSummarySyncedAt: 'from-fallback' })).toBe('from-fallback')
  })
})

describe('formatAiSummarySyncedLabel', () => {
  it('returns null for empty input', () => {
    expect(formatAiSummarySyncedLabel(null)).toBeNull()
    expect(formatAiSummarySyncedLabel(undefined)).toBeNull()
    expect(formatAiSummarySyncedLabel('')).toBeNull()
    expect(formatAiSummarySyncedLabel('not-a-date')).toBeNull()
  })

  it('formats ISO strings', () => {
    const label = formatAiSummarySyncedLabel('2020-06-15T12:00:00.000Z')
    expect(label).toBeTruthy()
    expect(label).toMatch(/2020/)
    expect(label.length).toBeGreaterThan(5)
  })

  it('formats unix seconds and ms', () => {
    expect(formatAiSummarySyncedLabel(1592222400)).toBeTruthy()
    expect(formatAiSummarySyncedLabel(1592222400000)).toBeTruthy()
  })

  it('formats Firestore-style { seconds }', () => {
    expect(formatAiSummarySyncedLabel({ seconds: 1592222400 })).toBeTruthy()
  })

  it('formats Date', () => {
    expect(formatAiSummarySyncedLabel(new Date('2020-06-15T12:00:00.000Z'))).toBeTruthy()
  })

  it('returns null for invalid Date instances', () => {
    expect(formatAiSummarySyncedLabel(new Date(Number.NaN))).toBeNull()
  })

  it('returns null for Firestore-style objects with non-finite seconds', () => {
    expect(formatAiSummarySyncedLabel({ seconds: NaN })).toBeNull()
    expect(formatAiSummarySyncedLabel({ seconds: 'not-a-number' })).toBeNull()
  })

  it('returns null for unsupported primitive types', () => {
    expect(formatAiSummarySyncedLabel(true)).toBeNull()
    expect(formatAiSummarySyncedLabel(Symbol('x'))).toBeNull()
  })

  it('returns null when Intl.DateTimeFormat fails', () => {
    const orig = Intl.DateTimeFormat
    Intl.DateTimeFormat = function FailedDateTimeFormat() {
      throw new RangeError('invalid locale')
    }
    try {
      expect(formatAiSummarySyncedLabel('2020-06-15T12:00:00.000Z')).toBeNull()
    } finally {
      Intl.DateTimeFormat = orig
    }
  })
})
