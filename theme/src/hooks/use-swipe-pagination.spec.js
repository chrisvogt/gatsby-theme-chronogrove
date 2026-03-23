import { renderHook, act } from '@testing-library/react'

import useSwipePagination from './use-swipe-pagination'

describe('useSwipePagination', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns a neutral transform when there is only one page', () => {
    const onPageChange = jest.fn()
    const { result } = renderHook(() =>
      useSwipePagination({
        currentPage: 1,
        totalPages: 1,
        onPageChange
      })
    )

    expect(result.current.getTransform()).toBe('translateX(0%)')
  })

  it('applies boundary resistance on the first page when dragging right', () => {
    const onPageChange = jest.fn()
    const { result } = renderHook(() =>
      useSwipePagination({
        currentPage: 1,
        totalPages: 3,
        onPageChange
      })
    )

    act(() => {
      result.current.handleMouseDown({ clientX: 100 })
    })

    act(() => {
      result.current.handleMouseMove({ clientX: 200 })
    })

    expect(result.current.dragDistance).toBe(30)
  })

  it('applies boundary resistance on the last page when dragging left', () => {
    const onPageChange = jest.fn()
    const { result } = renderHook(() =>
      useSwipePagination({
        currentPage: 3,
        totalPages: 3,
        onPageChange
      })
    )

    act(() => {
      result.current.handlePointerDown({ pointerType: 'touch', clientX: 200 })
    })

    act(() => {
      result.current.handlePointerMove({ pointerType: 'touch', clientX: 100 })
    })

    expect(result.current.dragDistance).toBe(-30)
  })

  it('navigates to the previous page when drag threshold is exceeded to the right', () => {
    jest.useFakeTimers()

    const onPageChange = jest.fn()
    const { result } = renderHook(() =>
      useSwipePagination({
        currentPage: 2,
        totalPages: 3,
        onPageChange
      })
    )

    act(() => {
      result.current.handleMouseDown({ clientX: 100 })
    })

    act(() => {
      result.current.handleMouseMove({ clientX: 220 })
    })

    act(() => {
      result.current.handleMouseUp()
    })

    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('navigates to the next page when drag threshold is exceeded to the left', () => {
    jest.useFakeTimers()

    const onPageChange = jest.fn()
    const { result } = renderHook(() =>
      useSwipePagination({
        currentPage: 1,
        totalPages: 3,
        onPageChange
      })
    )

    act(() => {
      result.current.handlePointerDown({ pointerType: 'touch', clientX: 220 })
    })

    act(() => {
      result.current.handlePointerMove({ pointerType: 'touch', clientX: 100 })
    })

    act(() => {
      result.current.handlePointerUp({ pointerType: 'touch' })
    })

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('ignores invalid page changes and mouse pointer events', () => {
    const onPageChange = jest.fn()
    const { result } = renderHook(() =>
      useSwipePagination({
        currentPage: 2,
        totalPages: 3,
        onPageChange
      })
    )

    act(() => {
      result.current.handlePageChange(2)
      result.current.handlePageChange(0)
      result.current.handlePageChange(4)
      result.current.handlePointerDown({ pointerType: 'mouse', clientX: 100 })
      result.current.handlePointerMove({ pointerType: 'mouse', clientX: 200 })
      result.current.handlePointerUp({ pointerType: 'mouse' })
      result.current.handlePointerCancel({ pointerType: 'mouse' })
    })

    expect(onPageChange).not.toHaveBeenCalled()
    expect(result.current.dragDistance).toBe(0)
  })

  it('clears the in-flight transition timeout when unmounted', () => {
    jest.useFakeTimers()
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const onPageChange = jest.fn()

    const { result, unmount } = renderHook(() =>
      useSwipePagination({
        currentPage: 1,
        totalPages: 3,
        onPageChange
      })
    )

    act(() => {
      result.current.handlePageChange(2)
    })

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
