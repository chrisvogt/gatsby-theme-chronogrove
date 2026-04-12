/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render } from '@testing-library/react'

import { ChronogroveNextRootLayoutHead } from './root-layout-head.js'

describe('ChronogroveNextRootLayoutHead', () => {
  it('emits scripts and fallback CSS (meta belongs in document <head> in real App Router layouts)', () => {
    const { container } = render(<ChronogroveNextRootLayoutHead />)
    // RTL renders into a div; React omits invalid <meta> there — in Next, `<head><ChronogroveNextRootLayoutHead /></head>` keeps the meta.
    expect(container.querySelectorAll('script')).toHaveLength(2)
    expect(container.querySelector('style')).toBeTruthy()
    expect(container.textContent).toMatch(/theme-ui-color-mode/)
  })
})
