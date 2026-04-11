import { CHRONOGROVE_COLOR_MODE_HEAD_PRIORITY_KEYS } from '../color-mode/constants.js'

/**
 * Gatsby `onPreRenderHTML`: move Theme UI color-mode head entries (`theme-ui-no-flash`, `html-bg-color`,
 * `theme-ui-color-mode-fallback`) before other head components to minimize flash and ordering issues.
 *
 * @param {{ getHeadComponents: () => unknown[], replaceHeadComponents: (c: unknown[]) => void }} api
 */
export function onPreRenderHTMLSortThemeUiColorModeFirst({ getHeadComponents, replaceHeadComponents }) {
  const headComponents = getHeadComponents()
  const priorityKeys = CHRONOGROVE_COLOR_MODE_HEAD_PRIORITY_KEYS
  const sorted = [...headComponents].sort((a, b) => {
    const aKey = a?.key ?? ''
    const bKey = b?.key ?? ''
    const aFirst = priorityKeys.includes(aKey) ? -1 : 0
    const bFirst = priorityKeys.includes(bKey) ? -1 : 0
    if (aFirst !== bFirst) return aFirst - bFirst
    return 0
  })
  replaceHeadComponents(sorted)
}
