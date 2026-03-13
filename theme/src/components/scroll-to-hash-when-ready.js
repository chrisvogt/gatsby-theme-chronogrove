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
import { scrollToElementWhenReady } from '../helpers/scrollToElementWhenReady'

export default function ScrollToHashWhenReady({ getHash } = {}) {
  const location = useLocation()

  useEffect(() => {
    const hash =
      (typeof getHash === 'function' && getHash()) || (typeof window !== 'undefined' ? window.location.hash : '')
    if (!hash || hash.length < 2) return

    const cleanup = scrollToElementWhenReady(hash)
    return cleanup
  }, [location.pathname, location.hash, getHash])

  return null
}
