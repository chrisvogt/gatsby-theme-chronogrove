/**
 * @jest-environment node
 */

import { resolveChronogroveSurfaceColors } from './resolve-theme-colors.js'
import { applyDocumentColorModeSurface } from './use-document-color-mode-surface.js'

describe('applyDocumentColorModeSurface (node / no DOM)', () => {
  it('returns immediately when document is not available', () => {
    expect(applyDocumentColorModeSurface('default', {}, resolveChronogroveSurfaceColors({}))).toBeUndefined()
  })
})
