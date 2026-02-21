import React from 'react'
import { version as themeVersion } from './package.json'

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
    <meta key='gatsby-theme-chronogrove-version' name='gatsby-theme-chronogrove-version' content={themeVersion} />,
    <script key='theme-ui-no-flash' dangerouslySetInnerHTML={{ __html: colorModeScript }} />,
    <script key='html-bg-color' dangerouslySetInnerHTML={{ __html: htmlBackgroundScript }} />,
    <style key='theme-ui-color-mode-fallback' dangerouslySetInnerHTML={{ __html: colorModeFallbackCSS }} />
  ])
}

const COLOR_MODE_HEAD_KEYS = ['theme-ui-no-flash', 'html-bg-color', 'theme-ui-color-mode-fallback']

export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents()
  const sorted = [...headComponents].sort((a, b) => {
    const aKey = a?.key ?? ''
    const bKey = b?.key ?? ''
    const aFirst = COLOR_MODE_HEAD_KEYS.includes(aKey) ? -1 : 0
    const bFirst = COLOR_MODE_HEAD_KEYS.includes(bKey) ? -1 : 0
    if (aFirst !== bFirst) return aFirst - bFirst
    return 0
  })
  replaceHeadComponents(sorted)
}
