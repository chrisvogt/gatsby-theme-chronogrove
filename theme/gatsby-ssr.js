import React from 'react'
export { default as wrapRootElement } from './wrapRootElement'

// Patches document.head.insertBefore to avoid NotFoundError when the reference
// node is no longer a child of head (e.g. after third-party scripts like New
// Relic mutate the head). Emotion and other libs can then insert style tags
// without throwing. Injected early so it runs before other head scripts.
const emotionInsertBeforePatch = `
(function() {
  try {
    var head = document.head;
    if (!head) return;
    var orig = head.insertBefore;
    head.insertBefore = function(newNode, refNode) {
      try {
        if (refNode && !head.contains(refNode)) refNode = null;
        return orig.call(head, newNode, refNode);
      } catch (e) {
        try {
          return orig.call(head, newNode, null);
        } catch (e2) {
          head.appendChild(newNode);
          return newNode;
        }
      }
    };
  } catch (e) {}
})();
`

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents, setPreBodyComponents }) => {
  setHtmlAttributes({ lang: 'en' })

  setHeadComponents([
    <script key='emotion-insertbefore-patch' dangerouslySetInnerHTML={{ __html: emotionInsertBeforePatch }} />
  ])

  const colorModeScript = `
    (function() {
      try {
        var mode = localStorage.getItem('theme-ui-color-mode');
        if (!mode) {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          mode = prefersDark ? 'dark' : 'default';
        }
        document.documentElement.setAttribute('data-theme-ui-color-mode', mode);
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
