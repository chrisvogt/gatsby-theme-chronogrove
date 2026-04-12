/**
 * @jest-environment jsdom
 */

import { getChronogroveEmotionCache } from './emotion-cache'

describe('getChronogroveEmotionCache', () => {
  beforeEach(() => {
    document.querySelectorAll('style[data-emotion]').forEach(el => el.remove())
  })

  it('creates a cache with emotion key css', () => {
    const cache1 = getChronogroveEmotionCache()
    const cache2 = getChronogroveEmotionCache()
    expect(cache1).toBe(cache2)
    expect(cache1.key).toBe('css')
    expect(typeof cache1.insert).toBe('function')
  })

  it('uses emotion insertion point meta when present', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'emotion-insertion-point')
    document.head.appendChild(meta)
    jest.isolateModules(() => {
      const { getChronogroveEmotionCache: getFresh } = require('./emotion-cache')
      expect(getFresh()).toBeTruthy()
    })
    document.head.removeChild(meta)
  })

  it('passes a real insertion point meta when present', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'emotion-insertion-point')
    document.head.appendChild(meta)
    jest.isolateModules(() => {
      const { createChronogroveEmotionCache } = require('./emotion-cache')
      const cache = createChronogroveEmotionCache()
      expect(cache).toBeTruthy()
    })
    document.head.removeChild(meta)
  })
})
