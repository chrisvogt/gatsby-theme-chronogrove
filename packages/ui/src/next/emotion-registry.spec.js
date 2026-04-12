/**
 * @jest-environment jsdom
 */

jest.mock('next/navigation', () => ({
  useServerInsertedHTML: jest.fn()
}))

import React from 'react'
import { render } from '@testing-library/react'
import { Global, css } from '@emotion/react'
import { useServerInsertedHTML } from 'next/navigation'

import { ChronogroveNextEmotionRegistry } from './emotion-registry.js'

/** `className={css({...})}` does not always hit `cache.insert` in Jest/jsdom; `Global` does. */
function EmotionChild({ color }) {
  return (
    <Global
      styles={css`
        body {
          color: ${color};
        }
      `}
    />
  )
}

describe('ChronogroveNextEmotionRegistry', () => {
  let flushCallbacks

  beforeEach(() => {
    flushCallbacks = []
    useServerInsertedHTML.mockImplementation(cb => {
      flushCallbacks.push(cb)
    })
  })

  it('flushes only new insertions per useServerInsertedHTML call (avoids duplicate style tags when streaming)', () => {
    const { rerender } = render(
      <ChronogroveNextEmotionRegistry>
        <EmotionChild color='tomato' />
      </ChronogroveNextEmotionRegistry>
    )

    const first = flushCallbacks[flushCallbacks.length - 1]()
    expect(first).not.toBeNull()
    expect(first.props.dangerouslySetInnerHTML.__html.length).toBeGreaterThan(0)

    expect(flushCallbacks[flushCallbacks.length - 1]()).toBeNull()

    rerender(
      <ChronogroveNextEmotionRegistry>
        <EmotionChild color='steelblue' />
      </ChronogroveNextEmotionRegistry>
    )

    const afterNewRules = flushCallbacks[flushCallbacks.length - 1]()
    expect(afterNewRules).not.toBeNull()
    expect(flushCallbacks[flushCallbacks.length - 1]()).toBeNull()
  })

  /**
   * Next.js registers `useServerInsertedHTML` once per render (`push` onto an array). All handlers
   * share one `flush`; only the first invocation per drain should emit — not N copies of the full
   * `cache.inserted` map.
   */
  it('drains pending styles once when multiple handlers run (matches Next.js callback stacking)', () => {
    const { rerender } = render(
      <ChronogroveNextEmotionRegistry>
        <EmotionChild color='tomato' />
      </ChronogroveNextEmotionRegistry>
    )

    expect(flushCallbacks).toHaveLength(1)

    rerender(
      <ChronogroveNextEmotionRegistry>
        <EmotionChild color='tomato' />
      </ChronogroveNextEmotionRegistry>
    )
    rerender(
      <ChronogroveNextEmotionRegistry>
        <EmotionChild color='tomato' />
      </ChronogroveNextEmotionRegistry>
    )

    expect(flushCallbacks).toHaveLength(3)

    const html0 = flushCallbacks[0]()
    const html1 = flushCallbacks[1]()
    const html2 = flushCallbacks[2]()

    expect(html0).not.toBeNull()
    expect(html1).toBeNull()
    expect(html2).toBeNull()
  })
})
