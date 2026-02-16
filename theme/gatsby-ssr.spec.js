import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as gatsbySSR from './gatsby-ssr'

describe('gatsby-ssr', () => {
  it('exports wrapRootElement', () => {
    expect(gatsbySSR.wrapRootElement).toBeDefined()
  })

  it('sets html lang attribute and injects color mode and HTML background scripts in head', () => {
    const setHtmlAttributes = jest.fn()
    const setHeadComponents = jest.fn()

    gatsbySSR.onRenderBody({ setHtmlAttributes, setHeadComponents })

    expect(setHtmlAttributes).toHaveBeenCalledWith({ lang: 'en' })

    expect(setHeadComponents).toHaveBeenCalledTimes(1)
    const headComponents = setHeadComponents.mock.calls[0][0]
    expect(headComponents).toHaveLength(3)

    const { container: colorModeScriptContainer } = render(headComponents[0])
    const colorModeScriptTag = colorModeScriptContainer.querySelector('script')
    expect(colorModeScriptTag).toBeInTheDocument()
    expect(colorModeScriptTag).toHaveTextContent(/localStorage\.getItem\(['"]theme-ui-color-mode['"]\)/)
    expect(colorModeScriptTag).toHaveTextContent(/localStorage\.setItem\(['"]theme-ui-color-mode['"],/)
    expect(colorModeScriptTag).toHaveTextContent(/prefers-color-scheme/)
    expect(colorModeScriptTag).toHaveTextContent(/data-theme-ui-color-mode/)

    const { container: htmlBgScriptContainer } = render(headComponents[1])
    const htmlBgScriptTag = htmlBgScriptContainer.querySelector('script')
    expect(htmlBgScriptTag).toBeInTheDocument()
    expect(htmlBgScriptTag).toHaveTextContent(/localStorage\.getItem\(['"]theme-ui-color-mode['"]\)/)
    expect(htmlBgScriptTag).toHaveTextContent(/localStorage\.setItem\(['"]theme-ui-color-mode['"],/)
    expect(htmlBgScriptTag).toHaveTextContent(/prefers-color-scheme/)
    expect(htmlBgScriptTag).toHaveTextContent(/#14141F/)
    expect(htmlBgScriptTag).toHaveTextContent(/#fdf8f5/)

    const { container: patchContainer } = render(headComponents[2])
    const patchScript = patchContainer.querySelector('script')
    expect(patchScript).toBeInTheDocument()
    expect(patchScript).toHaveTextContent(/head\.insertBefore/)
    expect(patchScript).toHaveTextContent(/head\.contains/)
  })

  it('onPreRenderHTML puts color-mode scripts first in head', () => {
    const getHeadComponents = jest.fn(() => [
      { key: 'emotion-insertbefore-patch', type: 'script' },
      { key: 'theme-ui-no-flash', type: 'script' },
      { key: 'html-bg-color', type: 'script' }
    ])
    const replaceHeadComponents = jest.fn()

    gatsbySSR.onPreRenderHTML({ getHeadComponents, replaceHeadComponents })

    expect(getHeadComponents).toHaveBeenCalled()
    expect(replaceHeadComponents).toHaveBeenCalledTimes(1)
    const sorted = replaceHeadComponents.mock.calls[0][0]
    expect(sorted[0].key).toBe('theme-ui-no-flash')
    expect(sorted[1].key).toBe('html-bg-color')
    expect(sorted[2].key).toBe('emotion-insertbefore-patch')
  })
})
