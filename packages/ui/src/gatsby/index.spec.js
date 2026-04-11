import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import chronogroveTheme from '../theme.js'
import * as gatsby from './index.js'
import { buildThemeUiColorModeHeadComponents } from './build-theme-ui-color-mode-head-components.js'
import { onPreRenderHTMLSortThemeUiColorModeFirst } from './on-pre-render-html-sort.js'
import { onRouteUpdateThemeUiColorMode } from './on-route-update-color-mode.js'

describe('@chronogrove/ui/gatsby public API', () => {
  it('exports reconcile event and helpers from the barrel', () => {
    expect(gatsby.RECONCILE_COLOR_MODE_EVENT).toBe('theme-ui-reconcile-color-mode')
    expect(gatsby.buildThemeUiColorModeHeadComponents).toEqual(expect.any(Function))
    expect(gatsby.onPreRenderHTMLSortThemeUiColorModeFirst).toEqual(expect.any(Function))
    expect(gatsby.onRouteUpdateThemeUiColorMode).toEqual(expect.any(Function))
  })
})

describe('@chronogrove/ui/gatsby', () => {
  describe('buildThemeUiColorModeHeadComponents', () => {
    it('returns no-flash script, HTML background script, and fallback style for the theme', () => {
      const head = buildThemeUiColorModeHeadComponents({ theme: chronogroveTheme })
      expect(head).toHaveLength(3)
      expect(head[0].key).toBe('theme-ui-no-flash')
      expect(head[1].key).toBe('html-bg-color')
      expect(head[2].key).toBe('theme-ui-color-mode-fallback')

      const { container: colorModeScriptContainer } = render(head[0])
      const colorModeScriptTag = colorModeScriptContainer.querySelector('script')
      expect(colorModeScriptTag).toHaveTextContent(/localStorage\.getItem\(['"]theme-ui-color-mode['"]\)/)
      expect(colorModeScriptTag).toHaveTextContent(/data-theme-ui-color-mode/)

      const { container: htmlBgScriptContainer } = render(head[1])
      const htmlBgScriptTag = htmlBgScriptContainer.querySelector('script')
      expect(htmlBgScriptTag).toHaveTextContent(/#14141F/)
      expect(htmlBgScriptTag).toHaveTextContent(/#fdf8f5/)

      const { container: fallbackStyleContainer } = render(head[2])
      const fallbackStyle = fallbackStyleContainer.querySelector('style')
      expect(fallbackStyle).toHaveTextContent(/:root\[data-theme-ui-color-mode="default"\]/)
      expect(fallbackStyle).toHaveTextContent(/--theme-ui-colors-text: #111 !important/)
      expect(fallbackStyle).toHaveTextContent(/--theme-ui-colors-panel-background:/)
      expect(fallbackStyle).toHaveTextContent(/--theme-ui-colors-panel-text:/)
    })
  })

  describe('onPreRenderHTMLSortThemeUiColorModeFirst', () => {
    it('puts color-mode scripts and fallback style before other head components', () => {
      const getHeadComponents = jest.fn(() => [
        { key: 'emotion-insertion-point', type: 'meta' },
        { key: 'theme-ui-no-flash', type: 'script' },
        { key: 'html-bg-color', type: 'script' },
        { key: 'theme-ui-color-mode-fallback', type: 'style' }
      ])
      const replaceHeadComponents = jest.fn()

      onPreRenderHTMLSortThemeUiColorModeFirst({ getHeadComponents, replaceHeadComponents })

      const sorted = replaceHeadComponents.mock.calls[0][0]
      const colorModeKeys = ['theme-ui-no-flash', 'html-bg-color', 'theme-ui-color-mode-fallback']
      const firstThree = sorted.slice(0, 3).map(c => c.key)
      colorModeKeys.forEach(key => expect(firstThree).toContain(key))
      expect(sorted[3].key).toBe('emotion-insertion-point')
    })

    it('sorts color-mode keys before arbitrary head components', () => {
      const getHeadComponents = jest.fn(() => [
        { key: 'other-meta', type: 'meta' },
        { key: 'theme-ui-no-flash', type: 'script' },
        { key: 'another-tag', type: 'link' },
        { key: 'html-bg-color', type: 'script' },
        { key: 'theme-ui-color-mode-fallback', type: 'style' }
      ])
      const replaceHeadComponents = jest.fn()

      onPreRenderHTMLSortThemeUiColorModeFirst({ getHeadComponents, replaceHeadComponents })

      const sorted = replaceHeadComponents.mock.calls[0][0]
      const keys = sorted.map(c => c.key)
      expect(keys.indexOf('theme-ui-no-flash')).toBeLessThan(keys.indexOf('other-meta'))
      expect(keys.indexOf('html-bg-color')).toBeLessThan(keys.indexOf('another-tag'))
      expect(keys.indexOf('theme-ui-color-mode-fallback')).toBeLessThan(keys.indexOf('other-meta'))
    })

    it('preserves relative order among non-priority head components (comparator returns 0)', () => {
      const getHeadComponents = jest.fn(() => [
        { key: 'z-last', type: 'meta' },
        { key: 'a-first', type: 'meta' }
      ])
      const replaceHeadComponents = jest.fn()
      onPreRenderHTMLSortThemeUiColorModeFirst({ getHeadComponents, replaceHeadComponents })
      expect(replaceHeadComponents.mock.calls[0][0].map(c => c.key)).toEqual(['z-last', 'a-first'])
    })

    it('preserves relative order among priority keys when both sides are priority (comparator returns 0)', () => {
      const getHeadComponents = jest.fn(() => [
        { key: 'html-bg-color', type: 'script' },
        { key: 'theme-ui-no-flash', type: 'script' }
      ])
      const replaceHeadComponents = jest.fn()
      onPreRenderHTMLSortThemeUiColorModeFirst({ getHeadComponents, replaceHeadComponents })
      expect(replaceHeadComponents.mock.calls[0][0].map(c => c.key)).toEqual(['html-bg-color', 'theme-ui-no-flash'])
    })
  })

  describe('onRouteUpdateThemeUiColorMode', () => {
    beforeEach(() => {
      window.localStorage.removeItem('theme-ui-color-mode')
      document.documentElement.removeAttribute('data-theme-ui-color-mode')
      document.documentElement.className = ''
    })

    it('syncs DOM from localStorage and dispatches reconcile event', () => {
      window.localStorage.setItem('theme-ui-color-mode', 'dark')
      const listener = jest.fn()
      window.addEventListener('theme-ui-reconcile-color-mode', listener)

      onRouteUpdateThemeUiColorMode()

      expect(document.documentElement.getAttribute('data-theme-ui-color-mode')).toBe('dark')
      expect(listener).toHaveBeenCalled()
    })

    it('does not throw when CustomEvent is unavailable', () => {
      const original = window.CustomEvent
      window.CustomEvent = undefined
      window.localStorage.setItem('theme-ui-color-mode', 'default')
      expect(() => onRouteUpdateThemeUiColorMode()).not.toThrow()
      window.CustomEvent = original
    })
  })
})
