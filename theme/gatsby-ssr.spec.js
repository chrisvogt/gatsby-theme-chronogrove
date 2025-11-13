import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as gatsbySSR from './gatsby-ssr'

describe('gatsby-ssr', () => {
  it('exports wrapRootElement', () => {
    expect(gatsbySSR.wrapRootElement).toBeDefined()
  })

  it('sets html lang attribute and injects the color mode and HTML background scripts', () => {
    const setHtmlAttributes = jest.fn()
    const setPreBodyComponents = jest.fn()

    gatsbySSR.onRenderBody({ setHtmlAttributes, setPreBodyComponents })

    // Assert the HTML lang attribute
    expect(setHtmlAttributes).toHaveBeenCalledWith({ lang: 'en' })

    // Test that both scripts are injected
    expect(setPreBodyComponents).toHaveBeenCalledTimes(1)
    const scriptComponents = setPreBodyComponents.mock.calls[0][0]
    expect(scriptComponents).toHaveLength(2)

    // Test the color mode script (first script)
    const { container: colorModeScriptContainer } = render(scriptComponents[0])
    const colorModeScriptTag = colorModeScriptContainer.querySelector('script')
    expect(colorModeScriptTag).toBeInTheDocument()
    expect(colorModeScriptTag).toHaveTextContent(/localStorage\.getItem\(['"]theme-ui-color-mode['"]\)/)
    expect(colorModeScriptTag).toHaveTextContent(/prefers-color-scheme/)
    expect(colorModeScriptTag).toHaveTextContent(/data-theme-ui-color-mode/)

    // Test the HTML background script (second script)
    const { container: htmlBgScriptContainer } = render(scriptComponents[1])
    const htmlBgScriptTag = htmlBgScriptContainer.querySelector('script')
    expect(htmlBgScriptTag).toBeInTheDocument()
    expect(htmlBgScriptTag).toHaveTextContent(/localStorage\.getItem\(['"]theme-ui-color-mode['"]\)/)
    expect(htmlBgScriptTag).toHaveTextContent(/prefers-color-scheme/)
    expect(htmlBgScriptTag).toHaveTextContent(/backgroundColor/)
    expect(htmlBgScriptTag).toHaveTextContent(/#14141F/)
    expect(htmlBgScriptTag).toHaveTextContent(/#fdf8f5/)
  })
})
