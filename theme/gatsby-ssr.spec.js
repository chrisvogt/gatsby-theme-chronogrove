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
    expect(headComponents).toHaveLength(4)

    expect(headComponents[0].type).toBe('meta')
    expect(headComponents[0].props.name).toBe('emotion-insertion-point')

    const { container: colorModeScriptContainer } = render(headComponents[1])
    const colorModeScriptTag = colorModeScriptContainer.querySelector('script')
    expect(colorModeScriptTag).toBeInTheDocument()
    expect(colorModeScriptTag).toHaveTextContent(/localStorage\.getItem\(['"]theme-ui-color-mode['"]\)/)
    expect(colorModeScriptTag).toHaveTextContent(/localStorage\.setItem\(['"]theme-ui-color-mode['"],/)
    expect(colorModeScriptTag).toHaveTextContent(/prefers-color-scheme/)
    expect(colorModeScriptTag).toHaveTextContent(/data-theme-ui-color-mode/)

    const { container: htmlBgScriptContainer } = render(headComponents[2])
    const htmlBgScriptTag = htmlBgScriptContainer.querySelector('script')
    expect(htmlBgScriptTag).toBeInTheDocument()
    expect(htmlBgScriptTag).toHaveTextContent(/localStorage\.getItem\(['"]theme-ui-color-mode['"]\)/)
    expect(htmlBgScriptTag).toHaveTextContent(/localStorage\.setItem\(['"]theme-ui-color-mode['"],/)
    expect(htmlBgScriptTag).toHaveTextContent(/prefers-color-scheme/)
    expect(htmlBgScriptTag).toHaveTextContent(/#14141F/)
    expect(htmlBgScriptTag).toHaveTextContent(/#fdf8f5/)

    const { container: fallbackStyleContainer } = render(headComponents[3])
    const fallbackStyle = fallbackStyleContainer.querySelector('style')
    expect(fallbackStyle).toBeInTheDocument()
    expect(fallbackStyle).toHaveTextContent(/:root\[data-theme-ui-color-mode="default"\]/)
    expect(fallbackStyle).toHaveTextContent(/--theme-ui-colors-text: #111 !important/)
    expect(fallbackStyle).toHaveTextContent(/:root\[data-theme-ui-color-mode="dark"\]/)
    expect(fallbackStyle).toHaveTextContent(/--theme-ui-colors-text: #fff !important/)
  })

  describe('onPreRenderHTML', () => {
    const originalEnv = process.env.NODE_ENV

    afterEach(() => {
      process.env.NODE_ENV = originalEnv
    })

    it('puts color-mode scripts first in head in development', () => {
      process.env.NODE_ENV = 'development'
      const getHeadComponents = jest.fn(() => [
        { key: 'emotion-insertion-point', type: 'meta' },
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
      expect(sorted[2].key).toBe('emotion-insertion-point')
    })

    it('extracts CSS to external file in production', () => {
      process.env.NODE_ENV = 'production'
      const fs = require('fs')
      const path = require('path')
      const publicDir = path.join(process.cwd(), 'public')

      // Ensure public directory exists
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
      }

      const styleContent = '.test-class { color: red; }'
      const getHeadComponents = jest.fn(() => [
        { key: 'emotion-insertion-point', type: 'meta' },
        { key: 'theme-ui-no-flash', type: 'script' },
        { key: 'html-bg-color', type: 'script' },
        {
          type: 'style',
          props: {
            dangerouslySetInnerHTML: { __html: styleContent }
          }
        }
      ])
      const replaceHeadComponents = jest.fn()

      gatsbySSR.onPreRenderHTML({ getHeadComponents, replaceHeadComponents })

      expect(getHeadComponents).toHaveBeenCalled()
      expect(replaceHeadComponents).toHaveBeenCalledTimes(1)
      const sorted = replaceHeadComponents.mock.calls[0][0]

      // Should have color mode scripts first
      expect(sorted[0].key).toBe('theme-ui-no-flash')
      expect(sorted[1].key).toBe('html-bg-color')

      // Should have CSS link instead of style tag
      const cssLink = sorted.find(c => c?.props?.rel === 'stylesheet')
      expect(cssLink).toBeDefined()
      expect(cssLink?.props?.href).toMatch(/^\/emotion-styles-.*\.css$/)

      // Clean up test CSS file
      if (cssLink?.props?.href) {
        const cssPath = path.join(publicDir, cssLink.props.href.replace(/^\//, ''))
        if (fs.existsSync(cssPath)) {
          fs.unlinkSync(cssPath)
        }
      }
    })
  })
})
