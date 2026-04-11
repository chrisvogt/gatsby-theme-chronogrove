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
  defaultBackgroundHex = '#fdf8f5',
  darkBackgroundHex = '#14141F',
  defaultTextHex,
  defaultTextMutedHex,
  darkTextHex,
  darkTextMutedHex,
  defaultPanelBackground = 'rgba(255, 255, 255, 0.45)',
  darkPanelBackground = 'rgba(20, 20, 31, 0.45)',
  defaultPanelText = '#111',
  darkPanelText = '#fff'
}) {
  /**
   * Base `:root` (light) must not depend on `data-theme-ui-color-mode`. In App Router SSR / first
   * paint, that attribute is not set until the inline no-flash script runs—rules that only target
   * `:root[data-theme-ui-color-mode="default"]` would leave `--theme-ui-colors-panel-background`
   * (and glass panels using `bg: 'panel-background'`) unset until hydration.
   */
  return `
:root {
  --theme-ui-colors-background: ${defaultBackgroundHex} !important;
  --theme-ui-colors-panel-background: ${defaultPanelBackground} !important;
  --theme-ui-colors-panel-text: ${defaultPanelText} !important;
  --theme-ui-colors-text: ${defaultTextHex};
  --theme-ui-colors-text-muted: ${defaultTextMutedHex};
}
:root[data-theme-ui-color-mode="dark"],
html.theme-ui-dark {
  --theme-ui-colors-background: ${darkBackgroundHex} !important;
  --theme-ui-colors-panel-background: ${darkPanelBackground} !important;
  --theme-ui-colors-panel-text: ${darkPanelText} !important;
  --theme-ui-colors-text: ${darkTextHex};
  --theme-ui-colors-text-muted: ${darkTextMutedHex};
}
:root[data-theme-ui-color-mode="default"], :root[data-theme-ui-color-mode="default"] * { --theme-ui-colors-text: ${defaultTextHex} !important; --theme-ui-colors-text-muted: ${defaultTextMutedHex} !important; }
:root[data-theme-ui-color-mode="dark"], :root[data-theme-ui-color-mode="dark"] * { --theme-ui-colors-text: ${darkTextHex} !important; --theme-ui-colors-text-muted: ${darkTextMutedHex} !important; }
  `.trim()
}
