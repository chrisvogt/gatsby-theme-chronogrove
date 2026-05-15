/**
 * @jest-environment jsdom
 */

jest.mock('./color-bends.js', () => {
  return function MockColorBends() {
    return null
  }
})

import DefaultBackground, { ChronogroveAnimatedPageBackground } from './index.js'

describe('animated-page-background barrel', () => {
  it('re-exports the animated background as default and named export', () => {
    expect(ChronogroveAnimatedPageBackground).toEqual(expect.any(Function))
    expect(DefaultBackground).toBe(ChronogroveAnimatedPageBackground)
  })
})
