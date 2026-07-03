import { useCallback, useEffect, useRef } from 'react'

/**
 * Locks background scroll while a LightGallery lightbox is open.
 *
 * `overflow: hidden` on <body> alone does not block touch-driven scrolling
 * on iOS Safari, so the lock instead pins <body> with `position: fixed` and
 * offsets it by the current scroll position, restoring the scroll position
 * on unlock. Wire `lockScroll`/`unlockScroll` to a LightGallery instance's
 * `onBeforeOpen`/`onAfterClose` callbacks.
 */
const useLightboxScrollLock = () => {
  const scrollYRef = useRef(0)
  const isLockedRef = useRef(false)

  const lockScroll = useCallback(() => {
    if (typeof document === 'undefined' || isLockedRef.current) return

    scrollYRef.current = window.scrollY
    isLockedRef.current = true

    const { body } = document
    body.style.position = 'fixed'
    body.style.top = `-${scrollYRef.current}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
  }, [])

  const unlockScroll = useCallback(() => {
    if (typeof document === 'undefined' || !isLockedRef.current) return

    isLockedRef.current = false

    const { body } = document
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''

    window.scrollTo(0, scrollYRef.current)
  }, [])

  // Safety net: release the lock if the component unmounts while open
  useEffect(() => () => unlockScroll(), [unlockScroll])

  return { lockScroll, unlockScroll }
}

export default useLightboxScrollLock
