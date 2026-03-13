import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import ScrollToHashWhenReady from './scroll-to-hash-when-ready'

const mockUseLocation = jest.fn()
jest.mock('@gatsbyjs/reach-router', () => ({
  ...jest.requireActual('@gatsbyjs/reach-router'),
  useLocation: () => mockUseLocation()
}))

describe('ScrollToHashWhenReady', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseLocation.mockReturnValue({ pathname: '/', hash: '', search: '' })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders nothing (returns null)', () => {
    const { container } = render(<ScrollToHashWhenReady />)
    expect(container.firstChild).toBeNull()
  })

  it('does not scroll when window has no hash', () => {
    const scrollIntoView = jest.fn()
    document.body.innerHTML = '<div id="section">Section</div>'
    document.getElementById('section').scrollIntoView = scrollIntoView

    render(<ScrollToHashWhenReady getHash={() => ''} />)

    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('does not scroll when hash length is less than 2', () => {
    const scrollIntoView = jest.fn()
    document.body.innerHTML = '<div id="x">X</div>'
    document.getElementById('x').scrollIntoView = scrollIntoView

    render(<ScrollToHashWhenReady getHash={() => '#'} />)

    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('scrolls to element when hash is set and element exists', () => {
    const scrollIntoView = jest.fn()
    document.body.innerHTML = '<div id="target">Target</div>'
    document.getElementById('target').scrollIntoView = scrollIntoView

    render(<ScrollToHashWhenReady getHash={() => '#target'} />)

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('decodes URI component in hash when scrolling', () => {
    const scrollIntoView = jest.fn()
    document.body.innerHTML = '<div id="✔">Check</div>'
    document.getElementById('✔').scrollIntoView = scrollIntoView

    render(<ScrollToHashWhenReady getHash={() => '#%E2%9C%94'} />)

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('scrolls to element when it appears after interval', () => {
    document.body.innerHTML = ''

    const { rerender } = render(<ScrollToHashWhenReady getHash={() => '#lazy'} />)

    expect(document.getElementById('lazy')).toBeNull()

    const scrollIntoView = jest.fn()
    const el = document.createElement('div')
    el.id = 'lazy'
    el.scrollIntoView = scrollIntoView
    document.body.appendChild(el)

    jest.advanceTimersByTime(50)

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })

    rerender(<ScrollToHashWhenReady />)
    jest.advanceTimersByTime(50)
    expect(scrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('stops retrying after MAX_WAIT_MS', () => {
    document.body.innerHTML = ''

    const getElementByIdSpy = jest.spyOn(document, 'getElementById')

    render(<ScrollToHashWhenReady getHash={() => '#never'} />)

    jest.advanceTimersByTime(3000)

    expect(getElementByIdSpy).toHaveBeenCalledWith('never')
    getElementByIdSpy.mockRestore()
  })

  it('clears interval when MAX_WAIT_MS is exceeded (timeout branch)', () => {
    document.body.innerHTML = ''
    const scrollIntoView = jest.fn()

    render(<ScrollToHashWhenReady getHash={() => '#missing'} />)

    jest.advanceTimersByTime(2999)
    expect(scrollIntoView).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)

    const el = document.createElement('div')
    el.id = 'missing'
    el.scrollIntoView = scrollIntoView
    document.body.appendChild(el)
    jest.advanceTimersByTime(100)

    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('cleans up interval on unmount', () => {
    document.body.innerHTML = ''

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval')

    const { unmount } = render(<ScrollToHashWhenReady getHash={() => '#unmount'} />)
    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
