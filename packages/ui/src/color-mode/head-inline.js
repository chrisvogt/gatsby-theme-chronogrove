import {
  chronogroveThemeSurfaceColorsDark,
  chronogroveThemeSurfaceColorsLight
} from '../chronogrove-theme-surface-colors.js'

import { CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME, THEME_UI_COLOR_MODE_STORAGE_KEY } from './constants.js'
import { validateRegistrableDomain } from './registrable-domain.js'

function q(str) {
  return JSON.stringify(str)
}

/**
 * Inline JS that sets `mode` and syncs `localStorage`. When `crossDomainColorMode.registrableDomain`
 * is set (validated), reads the shared cookie first so subdomains stay aligned.
 *
 * @param {string} [storageKey]
 * @param {{ registrableDomain?: string, cookieName?: string } | null} [crossDomainColorMode]
 */
export function buildInitialThemeUiColorModeResolutionInlineFragment(
  storageKey = THEME_UI_COLOR_MODE_STORAGE_KEY,
  crossDomainColorMode = null
) {
  const cookieName = crossDomainColorMode?.cookieName ?? CHRONOGROVE_CROSS_DOMAIN_COLOR_MODE_COOKIE_NAME
  const domainOk =
    crossDomainColorMode &&
    typeof crossDomainColorMode.registrableDomain === 'string' &&
    validateRegistrableDomain(crossDomainColorMode.registrableDomain)

  if (!domainOk) {
    const keyOnly = q(storageKey)
    return `
        var __cgKey = ${keyOnly};
        var mode;
        try {
          mode = localStorage.getItem(__cgKey);
        } catch (e) {
          mode = null;
        }
        if (!mode) {
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          mode = prefersDark ? 'dark' : 'default';
        }
        if (mode === 'light') {
          mode = 'default';
        }
        try { localStorage.setItem(__cgKey, mode); } catch (e2) {}
  `.trim()
  }

  const key = q(storageKey)
  const cname = q(cookieName)
  return `
        function __cgGetCookie(name) {
          try {
            var parts = ('; ' + document.cookie).split('; ' + name + '=');
            if (parts.length < 2) return null;
            var raw = parts.pop().split(';').shift() || '';
            try { return decodeURIComponent(raw.trim()); } catch (e1) { return raw.trim(); }
          } catch (e) { return null; }
        }
        function __cgNormMode(m) {
          if (m === 'light') return 'default';
          if (m === 'dark' || m === 'default') return m;
          return null;
        }
        var __cgKey = ${key};
        var __cgCookieMode = __cgNormMode(__cgGetCookie(${cname}));
        var mode;
        if (__cgCookieMode) {
          mode = __cgCookieMode;
          try { localStorage.setItem(__cgKey, mode); } catch (e) {}
        } else {
          try {
            mode = localStorage.getItem(__cgKey);
          } catch (e) {
            mode = null;
          }
          if (!mode) {
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            mode = prefersDark ? 'dark' : 'default';
          }
          if (mode === 'light') {
            mode = 'default';
          }
          try { localStorage.setItem(__cgKey, mode); } catch (e2) {}
        }
        if (mode === 'light') {
          mode = 'default';
        }
  `.trim()
}

/**
 * @param {string | { storageKey?: string, crossDomainColorMode?: { registrableDomain?: string, cookieName?: string } | null }} [options]
 */
export function buildThemeUiNoFlashInlineScript(options) {
  const { storageKey, crossDomainColorMode } = normalizeNoFlashInlineScriptOptions(options)
  const fragment = buildInitialThemeUiColorModeResolutionInlineFragment(storageKey, crossDomainColorMode)
  return `
    (function() {
      try {
        ${fragment}
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

function normalizeNoFlashInlineScriptOptions(options) {
  if (options == null || typeof options === 'string') {
    return {
      storageKey: typeof options === 'string' ? options : THEME_UI_COLOR_MODE_STORAGE_KEY,
      crossDomainColorMode: null
    }
  }
  return {
    storageKey: options.storageKey ?? THEME_UI_COLOR_MODE_STORAGE_KEY,
    crossDomainColorMode: options.crossDomainColorMode ?? null
  }
}

export function buildHtmlBackgroundInlineScript({
  storageKey = THEME_UI_COLOR_MODE_STORAGE_KEY,
  defaultBackgroundHex,
  darkBackgroundHex,
  crossDomainColorMode = null
} = {}) {
  const fragment = buildInitialThemeUiColorModeResolutionInlineFragment(storageKey, crossDomainColorMode)
  const lightBg = q(defaultBackgroundHex)
  const darkBg = q(darkBackgroundHex)
  return `
    (function() {
      try {
        ${fragment}
        var bgColor = mode === 'dark' ? ${darkBg} : ${lightBg};
        document.documentElement.style.backgroundColor = bgColor;
      } catch (e) {}
    })();
  `
}

const surfaceLight = chronogroveThemeSurfaceColorsLight
const surfaceDark = chronogroveThemeSurfaceColorsDark

export function buildThemeUiColorModeFallbackCss({
  defaultBackgroundHex = surfaceLight.background,
  darkBackgroundHex = surfaceDark.background,
  defaultTextHex = surfaceLight.text,
  defaultTextMutedHex = surfaceLight.textMuted,
  darkTextHex = surfaceDark.text,
  darkTextMutedHex = surfaceDark.textMuted,
  defaultPanelBackground = surfaceLight['panel-background'],
  darkPanelBackground = surfaceDark['panel-background'],
  defaultPanelText = surfaceLight.text,
  darkPanelText = surfaceDark.text
} = {}) {
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
