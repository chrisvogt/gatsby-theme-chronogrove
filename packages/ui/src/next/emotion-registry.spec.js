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
  let flushCallback

  beforeEach(() => {
    flushCallback = null
    useServerInsertedHTML.mockImplementation(cb => {
      flushCallback = cb
    })
  })

  it('flushes only new insertions per useServerInsertedHTML call (avoids duplicate style tags when streaming)', () => {
    const { rerender } = render(
      <ChronogroveNextEmotionRegistry>
        <EmotionChild color='tomato' />
      </ChronogroveNextEmotionRegistry>
    )

    const first = flushCallback()
    expect(first).not.toBeNull()
    expect(first.props.dangerouslySetInnerHTML.__html.length).toBeGreaterThan(0)

    expect(flushCallback()).toBeNull()

    rerender(
      <ChronogroveNextEmotionRegistry>
        <EmotionChild color='steelblue' />
      </ChronogroveNextEmotionRegistry>
    )

    const afterNewRules = flushCallback()
    expect(afterNewRules).not.toBeNull()
    expect(flushCallback()).toBeNull()
  })
})
