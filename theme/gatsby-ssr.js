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

  const htmlBackgroundScript = `
    (function() {
      try {
        var mode = localStorage.getItem('theme-ui-color-mode');
        if (!mode) {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          mode = prefersDark ? 'dark' : 'default';
        }
        // Set HTML background color to match theme to prevent light background showing through semi-transparent animation
        var bgColor = mode === 'dark' ? '#14141F' : '#fdf8f5';
        document.documentElement.style.backgroundColor = bgColor;
      } catch (e) {}
    })();
  `

  setPreBodyComponents([
    <script key='theme-ui-no-flash' dangerouslySetInnerHTML={{ __html: colorModeScript }} />,
    <script key='html-bg-color' dangerouslySetInnerHTML={{ __html: htmlBackgroundScript }} />
  ])
}
