/**
 * @jest-environment jsdom
 */

import { reconcileThemeUiColorModeOnNavigation } from './spa-navigation.js'
import { RECONCILE_COLOR_MODE_EVENT } from './constants.js'

describe('reconcileThemeUiColorModeOnNavigation', () => {
  beforeEach(() => {
    window.localStorage.removeItem('theme-ui-color-mode')
    delete document.documentElement.dataset.themeUiColorMode
    document.documentElement.className = ''
  })

  it('syncs DOM from localStorage and dispatches reconcile event', () => {
    window.localStorage.setItem('theme-ui-color-mode', 'dark')
    const listener = jest.fn()
    window.addEventListener(RECONCILE_COLOR_MODE_EVENT, listener)

    reconcileThemeUiColorModeOnNavigation()

    expect(document.documentElement.dataset.themeUiColorMode).toBe('dark')
    expect(listener).toHaveBeenCalled()
  })
})
