import { hexToRgba } from '../../../utils/colors'

/**
 * Background for the AI summary fade overlay: matches page `colors.background` where possible.
 *
 * @param {{ colors?: { background?: unknown } }|undefined} theme
 * @returns {string} CSS `background` value
 */
export function getAiSummaryFadeBackground(theme) {
  const bg = theme?.colors?.background
  if (typeof bg === 'string' && bg.startsWith('#')) {
    return `linear-gradient(to bottom, ${hexToRgba(bg, 0)} 0%, ${hexToRgba(bg, 0.82)} 38%, ${bg} 100%)`
  }
  if (typeof bg === 'string') {
    return `linear-gradient(to bottom, transparent 0%, ${bg} 100%)`
  }
  return 'linear-gradient(to bottom, transparent, rgba(253, 248, 245, 1))'
}
