/**
 * Scroll to the hash target when it appears in the DOM.
 *
 * Home nav links point to section ids (#goodreads, #posts, etc.) that are
 * rendered by widgets. If the user clicks a link before that widget has
 * mounted (e.g. after navigating back to home), the target doesn't exist yet
 * and the browser can't scroll. This effect waits for the element and scrolls
 * to it when it appears.
 */
import { useEffect } from 'react'
import { useLocation } from '@gatsbyjs/reach-router'

const MAX_WAIT_MS = 3000
const RETRY_INTERVAL_MS = 50

export default function ScrollToHashWhenReady() {
  const location = useLocation()

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (!hash || hash.length < 2) return

    const id = decodeURIComponent(hash.slice(1))
    const start = Date.now()

    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return true
      }
      return false
    }

    if (tryScroll()) return

    const interval = setInterval(() => {
      if (Date.now() - start > MAX_WAIT_MS) {
        clearInterval(interval)
        return
      }
      if (tryScroll()) {
        clearInterval(interval)
      }
    }, RETRY_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [location.pathname, location.hash])

  return null
}
