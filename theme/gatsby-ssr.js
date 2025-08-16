import React from 'react'
export { default as wrapRootElement } from './wrapRootElement'

export const onRenderBody = ({ setHtmlAttributes, setPreBodyComponents }) => {
  setHtmlAttributes({ lang: 'en' })

  const colorModeScript = `
    (function() {
      try {
        var mode = localStorage.getItem('theme-ui-color-mode');
        if (!mode) {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          mode = prefersDark ? 'dark' : 'default';
        }
        // Set both attributes to ensure compatibility
        document.documentElement.setAttribute('data-theme-ui-color-mode', mode);
        document.documentElement.setAttribute('data-theme', mode);
        // Also set the class for additional compatibility
        document.documentElement.classList.add('theme-ui-' + mode);
      } catch (e) {
        console.warn('Failed to set color mode:', e);
      }
    })();
  `

  setPreBodyComponents([<script key='theme-ui-no-flash' dangerouslySetInnerHTML={{ __html: colorModeScript }} />])
}
