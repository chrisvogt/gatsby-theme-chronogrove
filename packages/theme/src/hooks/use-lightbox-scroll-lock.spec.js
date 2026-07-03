import { renderHook, act } from '@testing-library/react'

import useLightboxScrollLock from './use-lightbox-scroll-lock'

describe('useLightboxScrollLock', () => {
  beforeEach(() => {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    window.scrollTo = jest.fn()
    Object.defineProperty(window, 'scrollY', { value: 240, configurable: true })
  })

  it('pins the body with a fixed position offset by the current scroll position', () => {
    const { result } = renderHook(() => useLightboxScrollLock())

    act(() => {
      result.current.lockScroll()
    })

    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.top).toBe('-240px')
    expect(document.body.style.width).toBe('100%')
  })

  it('restores the body and scroll position on unlock', () => {
    const { result } = renderHook(() => useLightboxScrollLock())

    act(() => {
      result.current.lockScroll()
    })

    act(() => {
      result.current.unlockScroll()
    })

    expect(document.body.style.position).toBe('')
    expect(document.body.style.top).toBe('')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 240)
  })

  it('is a no-op to unlock when not locked', () => {
    const { result } = renderHook(() => useLightboxScrollLock())

    act(() => {
      result.current.unlockScroll()
    })

    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('releases the lock on unmount', () => {
    const { result, unmount } = renderHook(() => useLightboxScrollLock())

    act(() => {
      result.current.lockScroll()
    })

    unmount()

    expect(document.body.style.position).toBe('')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 240)
  })
})
