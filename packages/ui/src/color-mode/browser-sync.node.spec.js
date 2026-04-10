/**
 * @jest-environment node
 */

import { resolveThemeUiColorMode, syncThemeUiColorMode } from './browser-sync'

describe('browser-sync (node)', () => {
  it('resolve falls back to default without browser APIs', () => {
    expect(resolveThemeUiColorMode()).toBe('default')
  })

  it('sync is a no-op without document', () => {
    expect(() => syncThemeUiColorMode()).not.toThrow()
  })
})
