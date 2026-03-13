import { scrollToElementWhenReady } from './scrollToElementWhenReady'

describe('scrollToElementWhenReady', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns undefined and scrolls when element exists immediately', () => {
    const scrollIntoView = jest.fn()
    document.body.innerHTML = '<div id="target">Target</div>'
    document.getElementById('target').scrollIntoView = scrollIntoView

    const cleanup = scrollToElementWhenReady('#target')

    expect(cleanup).toBeUndefined()
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('accepts id without leading hash', () => {
    const scrollIntoView = jest.fn()
    document.body.innerHTML = '<div id="section">Section</div>'
    document.getElementById('section').scrollIntoView = scrollIntoView

    scrollToElementWhenReady('section')

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('returns cleanup when element appears after interval', () => {
    document.body.innerHTML = ''
    const scrollIntoView = jest.fn()

    const cleanup = scrollToElementWhenReady('#lazy')
    expect(cleanup).toBeInstanceOf(Function)

    const el = document.createElement('div')
    el.id = 'lazy'
    el.scrollIntoView = scrollIntoView
    document.body.appendChild(el)
    jest.advanceTimersByTime(50)

    expect(scrollIntoView).toHaveBeenCalled()
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
