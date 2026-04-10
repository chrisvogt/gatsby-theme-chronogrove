import { THEME_UI_COLOR_MODE_STORAGE_KEY } from './constants.js'

function q(str) {
  return JSON.stringify(str)
}

export function buildThemeUiNoFlashInlineScript(storageKey = THEME_UI_COLOR_MODE_STORAGE_KEY) {
  const key = q(storageKey)
  return `
    (function() {
      try {
        var mode = localStorage.getItem(${key});
        if (!mode) {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          mode = prefersDark ? 'dark' : 'default';
          localStorage.setItem(${key}, mode);
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
}

export function buildHtmlBackgroundInlineScript({
  storageKey = THEME_UI_COLOR_MODE_STORAGE_KEY,
  defaultBackgroundHex,
  darkBackgroundHex
}) {
  const key = q(storageKey)
  const lightBg = q(defaultBackgroundHex)
  const darkBg = q(darkBackgroundHex)
  return `
    (function() {
      try {
        var mode = localStorage.getItem(${key});
        if (!mode) {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          mode = prefersDark ? 'dark' : 'default';
          localStorage.setItem(${key}, mode);
        }
        var bgColor = mode === 'dark' ? ${darkBg} : ${lightBg};
        document.documentElement.style.backgroundColor = bgColor;
      } catch (e) {}
    })();
  `
}

export function buildThemeUiColorModeFallbackCss({
  defaultTextHex,
  defaultTextMutedHex,
  darkTextHex,
  darkTextMutedHex
}) {
  return `
:root[data-theme-ui-color-mode="default"], :root[data-theme-ui-color-mode="default"] * { --theme-ui-colors-text: ${defaultTextHex} !important; --theme-ui-colors-text-muted: ${defaultTextMutedHex} !important; }
:root[data-theme-ui-color-mode="dark"], :root[data-theme-ui-color-mode="dark"] * { --theme-ui-colors-text: ${darkTextHex} !important; --theme-ui-colors-text-muted: ${darkTextMutedHex} !important; }
  `.trim()
}
