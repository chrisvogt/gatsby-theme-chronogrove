import { scrollToElementWhenReady } from './scroll-to-element-when-ready'

describe('scrollToElementWhenReady', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns undefined and scrolls when element exists immediately', () => {
    const scrollIntoView = jest.fn()
    const focus = jest.fn()
    document.body.innerHTML = '<div id="target" tabindex="-1">Target</div>'
    const el = document.getElementById('target')
    el.scrollIntoView = scrollIntoView
    el.focus = focus

    const cleanup = scrollToElementWhenReady('#target')

    expect(cleanup).toBeUndefined()
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('accepts id without leading hash', () => {
    const scrollIntoView = jest.fn()
    const focus = jest.fn()
    document.body.innerHTML = '<div id="section" tabindex="-1">Section</div>'
    const el = document.getElementById('section')
    el.scrollIntoView = scrollIntoView
    el.focus = focus

    scrollToElementWhenReady('section')

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('does not focus when focusTarget is false', () => {
    const scrollIntoView = jest.fn()
    const focus = jest.fn()
    document.body.innerHTML = '<div id="target" tabindex="-1">Target</div>'
    const el = document.getElementById('target')
    el.scrollIntoView = scrollIntoView
    el.focus = focus

    scrollToElementWhenReady('#target', { focusTarget: false })

    expect(scrollIntoView).toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalled()
  })

  it('scrolls without calling focus when the element omits focus', () => {
    const scrollIntoView = jest.fn()
    document.body.innerHTML = '<div id="bare" tabindex="-1">Bare</div>'
    const el = document.getElementById('bare')
    el.scrollIntoView = scrollIntoView
    el.focus = null

    expect(() => scrollToElementWhenReady('#bare')).not.toThrow()
    expect(scrollIntoView).toHaveBeenCalled()
  })

  it('returns cleanup when element appears after interval', () => {
    document.body.innerHTML = ''
    const scrollIntoView = jest.fn()
    const focus = jest.fn()

    const cleanup = scrollToElementWhenReady('#lazy')
    expect(cleanup).toBeInstanceOf(Function)

    const el = document.createElement('div')
    el.id = 'lazy'
    el.tabIndex = -1
    el.scrollIntoView = scrollIntoView
    el.focus = focus
    document.body.appendChild(el)
    jest.advanceTimersByTime(50)

    expect(scrollIntoView).toHaveBeenCalled()
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    cleanup()
  })

  it('cleanup clears the interval', () => {
    document.body.innerHTML = ''
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')

    const cleanup = scrollToElementWhenReady('#missing')
    expect(cleanup).toBeInstanceOf(Function)
    cleanup()

    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
