import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as gatsbySSR from './gatsby-ssr'

describe('gatsby-ssr', () => {
  it('exports wrapRootElement', () => {
    expect(gatsbySSR.wrapRootElement).toBeDefined()
  })

  it('sets html lang attribute and injects Emotion insertion point, color mode, and HTML background scripts in head', () => {
    const setHtmlAttributes = jest.fn()
    const setHeadComponents = jest.fn()

    gatsbySSR.onRenderBody({ setHtmlAttributes, setHeadComponents })

    expect(setHtmlAttributes).toHaveBeenCalledWith({ lang: 'en' })

    expect(setHeadComponents).toHaveBeenCalledTimes(1)
    const headComponents = setHeadComponents.mock.calls[0][0]
    expect(headComponents).toHaveLength(5)

    expect(headComponents[0].type).toBe('meta')
    expect(headComponents[0].props.name).toBe('emotion-insertion-point')

    expect(headComponents[1].type).toBe('meta')
    expect(headComponents[1].props.name).toBe('gatsby-theme-chronogrove-version')
    expect(headComponents[1].props.content).toMatch(/^\d+\.\d+\.\d+$/)

    const { container: colorModeScriptContainer } = render(headComponents[2])
    const colorModeScriptTag = colorModeScriptContainer.querySelector('script')
    expect(colorModeScriptTag).toBeInTheDocument()
    expect(colorModeScriptTag).toHaveTextContent(/localStorage\.getItem\(['"]theme-ui-color-mode['"]\)/)
    expect(colorModeScriptTag).toHaveTextContent(/localStorage\.setItem\(['"]theme-ui-color-mode['"],/)
    expect(colorModeScriptTag).toHaveTextContent(/prefers-color-scheme/)
    expect(colorModeScriptTag).toHaveTextContent(/data-theme-ui-color-mode/)

    const { container: htmlBgScriptContainer } = render(headComponents[3])
    const htmlBgScriptTag = htmlBgScriptContainer.querySelector('script')
    expect(htmlBgScriptTag).toBeInTheDocument()
    expect(htmlBgScriptTag).toHaveTextContent(/localStorage\.getItem\(['"]theme-ui-color-mode['"]\)/)
    expect(htmlBgScriptTag).toHaveTextContent(/localStorage\.setItem\(['"]theme-ui-color-mode['"],/)
    expect(htmlBgScriptTag).toHaveTextContent(/prefers-color-scheme/)
    expect(htmlBgScriptTag).toHaveTextContent(/#14141F/)
    expect(htmlBgScriptTag).toHaveTextContent(/#fdf8f5/)

    const { container: fallbackStyleContainer } = render(headComponents[4])
    const fallbackStyle = fallbackStyleContainer.querySelector('style')
    expect(fallbackStyle).toBeInTheDocument()
    expect(fallbackStyle).toHaveTextContent(/:root\[data-theme-ui-color-mode="default"\]/)
    expect(fallbackStyle).toHaveTextContent(/--theme-ui-colors-text: #111 !important/)
    expect(fallbackStyle).toHaveTextContent(/:root\[data-theme-ui-color-mode="dark"\]/)
    expect(fallbackStyle).toHaveTextContent(/--theme-ui-colors-text: #fff !important/)
  })

  it('onPreRenderHTML puts color-mode scripts and fallback style first in head', () => {
    const getHeadComponents = jest.fn(() => [
      { key: 'emotion-insertion-point', type: 'meta' },
      { key: 'theme-ui-no-flash', type: 'script' },
      { key: 'html-bg-color', type: 'script' },
      { key: 'theme-ui-color-mode-fallback', type: 'style' }
    ])
    const replaceHeadComponents = jest.fn()

    gatsbySSR.onPreRenderHTML({ getHeadComponents, replaceHeadComponents })

    expect(getHeadComponents).toHaveBeenCalled()
    expect(replaceHeadComponents).toHaveBeenCalledTimes(1)
    const sorted = replaceHeadComponents.mock.calls[0][0]
    const colorModeKeys = ['theme-ui-no-flash', 'html-bg-color', 'theme-ui-color-mode-fallback']
    const firstThree = sorted.slice(0, 3).map(c => c.key)
    colorModeKeys.forEach(key => expect(firstThree).toContain(key))
    expect(sorted[3].key).toBe('emotion-insertion-point')
  })
})
