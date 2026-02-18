import React from 'react'
import fs from 'fs'
import path from 'path'
import { createHash } from 'crypto'

export { default as wrapRootElement } from './wrapRootElement'

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: 'en' })

  const colorModeScript = `
    (function() {
      try {
        var mode = localStorage.getItem('theme-ui-color-mode');
        if (!mode) {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          mode = prefersDark ? 'dark' : 'default';
          localStorage.setItem('theme-ui-color-mode', mode);
        }
        if (mode === 'light') {
          mode = 'default';
        }
        var htmlElement = document.documentElement;
        var classesToRemove = [];
        for (var i = 0; i < htmlElement.classList.length; i++) {
          var className = htmlElement.classList[i];
          if (className.indexOf('theme-ui-') === 0) {
            classesToRemove.push(className);
          }
        }
        for (var j = 0; j < classesToRemove.length; j++) {
          htmlElement.classList.remove(classesToRemove[j]);
        }
        htmlElement.classList.add('theme-ui-' + mode);
        htmlElement.setAttribute('data-theme-ui-color-mode', mode);
      } catch (e) {}
    })();
  `

  const htmlBackgroundScript = `
    (function() {
      try {
        var mode = localStorage.getItem('theme-ui-color-mode');
        if (!mode) {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          mode = prefersDark ? 'dark' : 'default';
          localStorage.setItem('theme-ui-color-mode', mode);
        }
        var bgColor = mode === 'dark' ? '#14141F' : '#fdf8f5';
        document.documentElement.style.backgroundColor = bgColor;
      } catch (e) {}
    })();
  `

  // Force correct text vars when *the root* has data-theme-ui-color-mode so we win over Theme UI.
  // Use :root[...] only so a child with a different attribute (e.g. Theme UI's wrapper with "default")
  // doesn't get our light rule and force #111 on the main content when we intend dark.
  const colorModeFallbackCSS = `
:root[data-theme-ui-color-mode="default"], :root[data-theme-ui-color-mode="default"] * { --theme-ui-colors-text: #111 !important; --theme-ui-colors-text-muted: #333 !important; }
:root[data-theme-ui-color-mode="dark"], :root[data-theme-ui-color-mode="dark"] * { --theme-ui-colors-text: #fff !important; --theme-ui-colors-text-muted: #d8d8d8 !important; }
  `.trim()

  setHeadComponents([
    <meta key='emotion-insertion-point' name='emotion-insertion-point' content='' />,
    <script key='theme-ui-no-flash' dangerouslySetInnerHTML={{ __html: colorModeScript }} />,
    <script key='html-bg-color' dangerouslySetInnerHTML={{ __html: htmlBackgroundScript }} />,
    <style key='chronogrove-color-mode-fallback' dangerouslySetInnerHTML={{ __html: colorModeFallbackCSS }} />
  ])
}

const COLOR_MODE_HEAD_KEYS = ['theme-ui-no-flash', 'html-bg-color']

/**
 * Extracts inline CSS from style tags and moves them to external stylesheet files.
 * This reduces the size of the <head> tag significantly.
 *
 * Only runs in production builds to keep development fast.
 */
export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents()

  // In development, just sort components (keep inline CSS for hot reload)
  if (process.env.NODE_ENV !== 'production') {
    const sorted = [...headComponents].sort((a, b) => {
      const aKey = a?.key ?? ''
      const bKey = b?.key ?? ''
      const aFirst = COLOR_MODE_HEAD_KEYS.includes(aKey) ? -1 : 0
      const bFirst = COLOR_MODE_HEAD_KEYS.includes(bKey) ? -1 : 0
      if (aFirst !== bFirst) return aFirst - bFirst
      return 0
    })
    replaceHeadComponents(sorted)
    return
  }

  // In production, extract CSS to external files
  const styleTags = []
  const otherComponents = []
  let hasEmotionStyles = false

  headComponents.forEach(component => {
    const key = component?.key ?? ''

    // Keep color mode scripts first
    if (COLOR_MODE_HEAD_KEYS.includes(key)) {
      otherComponents.push(component)
      return
    }

    // Keep emotion insertion point meta tag
    if (key === 'emotion-insertion-point' || component?.props?.name === 'emotion-insertion-point') {
      otherComponents.push(component)
      return
    }

    // Keep our color mode fallback CSS inline (small, critical)
    if (key === 'chronogrove-color-mode-fallback') {
      otherComponents.push(component)
      return
    }

    // Extract style tags (Emotion-generated CSS)
    if (component?.type === 'style' || (component?.props && 'dangerouslySetInnerHTML' in component.props)) {
      const styleContent = component?.props?.dangerouslySetInnerHTML?.__html
      if (styleContent && styleContent.trim().length > 0) {
        styleTags.push(styleContent)
        hasEmotionStyles = true
      }
    } else {
      // Keep all other components (meta, link, script, etc.)
      otherComponents.push(component)
    }
  })

  // If we have Emotion styles, extract them to an external CSS file
  if (hasEmotionStyles && styleTags.length > 0) {
    const combinedCSS = styleTags.join('\n\n')

    // Create a hash of the CSS content for cache busting
    // Since Emotion generates the same CSS across pages, this will create
    // a consistent filename that all pages can reference
    const cssHash = createHash('md5').update(combinedCSS).digest('hex').substring(0, 8)
    const cssFilename = `emotion-styles-${cssHash}.css`
    const cssPath = path.join(process.cwd(), 'public', cssFilename)

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    // Write CSS to file only if it doesn't exist or content changed
    // This avoids unnecessary writes since all pages generate the same CSS
    if (!fs.existsSync(cssPath)) {
      fs.writeFileSync(cssPath, combinedCSS, 'utf8')
    }

    // Replace style tags with a single link tag
    const cssLink = <link key='emotion-extracted-styles' rel='stylesheet' href={`/${cssFilename}`} />

    // Put color mode scripts first, then CSS link, then other components
    const sorted = [
      ...otherComponents.filter(c => COLOR_MODE_HEAD_KEYS.includes(c?.key ?? '')),
      cssLink,
      ...otherComponents.filter(c => !COLOR_MODE_HEAD_KEYS.includes(c?.key ?? ''))
    ]

    replaceHeadComponents(sorted)
  } else {
    // No Emotion styles to extract, just sort
    const sorted = [...headComponents].sort((a, b) => {
      const aKey = a?.key ?? ''
      const aFirst = COLOR_MODE_HEAD_KEYS.includes(aKey) ? -1 : 0
      const bFirst = COLOR_MODE_HEAD_KEYS.includes(b?.key ?? '') ? -1 : 0
      if (aFirst !== bFirst) return aFirst - bFirst
      return 0
    })
    replaceHeadComponents(sorted)
  }
}
