/**
 * Scroll to the element with the given id when it appears in the DOM.
 * If the element is not yet present, polls until it appears or maxWaitMs is exceeded.
 * Used by home-navigation (hash link clicks) and scroll-to-hash-when-ready (route/hash sync).
 *
 * @param {string} targetId - Element id, with or without leading '#'
 * @param {{ maxWaitMs?: number, retryIntervalMs?: number }} [options]
 * @returns {(() => void) | undefined} Cleanup function that clears the poll interval when polling was started, or undefined if scroll happened immediately
 */
export function scrollToElementWhenReady(targetId, { maxWaitMs = 3000, retryIntervalMs = 50 } = {}) {
  if (typeof document === 'undefined') return undefined
  const id = decodeURIComponent(String(targetId).replace(/^#/, ''))
  const start = Date.now()

  const tryScroll = () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return true
    }
    return false
  }

  if (tryScroll()) return undefined

  const interval = setInterval(() => {
    if (Date.now() - start > maxWaitMs) {
      clearInterval(interval)
      return
    }
    if (tryScroll()) clearInterval(interval)
  }, retryIntervalMs)

  return () => clearInterval(interval)
}
