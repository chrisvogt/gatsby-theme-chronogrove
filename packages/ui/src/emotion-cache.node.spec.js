/**
 * @jest-environment node
 */

describe('createChronogroveEmotionCache (node / no DOM)', () => {
  it('creates a cache without a document insertion point', () => {
    jest.isolateModules(() => {
      const { createChronogroveEmotionCache } = require('./emotion-cache.js')
      const cache = createChronogroveEmotionCache()
      expect(cache.key).toBe('css')
    })
  })
})
