/**
 * Pick a sync / generation timestamp for the AI summary from a metrics widget payload.
 * The metrics API exposes `meta.synced` (ISO string); other keys remain as fallbacks.
 *
 * @param {Record<string, unknown>|null|undefined} payload
 * @returns {unknown|undefined}
 */
export function pickAiSummarySyncedAtRaw(payload) {
  if (payload == null || typeof payload !== 'object') {
    return undefined
  }
  const meta = payload.meta
  const metaSynced =
    meta != null && typeof meta === 'object' && 'synced' in meta
      ? /** @type {{ synced?: unknown }} */ (meta).synced
      : undefined

  return (
    metaSynced ??
    payload.aiSummaryUpdatedAt ??
    payload.aiSummarySyncedAt ??
    payload.aiSummaryGeneratedAt ??
    payload.syncedAt
  )
}

/**
 * @param {unknown} raw ISO string, unix ms/seconds, Date, or Firestore-style `{ seconds }`
 * @returns {string|null} medium date in the visitor's locale, or null if unparseable
 */
export function formatAiSummarySyncedLabel(raw) {
  if (raw == null || raw === '') {
    return null
  }

  if (raw instanceof Date) {
    const t = raw.getTime()
    return Number.isNaN(t) ? null : formatWithMediumDate(new Date(t))
  }

  if (typeof raw === 'object' && raw !== null && 'seconds' in raw) {
    const sec = /** @type {{ seconds?: number }} */ (raw).seconds
    if (typeof sec === 'number' && Number.isFinite(sec)) {
      return formatWithMediumDate(new Date(sec * 1000))
    }
    return null
  }

  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const ms = raw > 1e12 ? raw : raw * 1000
    return formatWithMediumDate(new Date(ms))
  }

  if (typeof raw === 'string') {
    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? null : formatWithMediumDate(d)
  }

  return null
}

function formatWithMediumDate(d) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d)
  } catch {
    return null
  }
}
