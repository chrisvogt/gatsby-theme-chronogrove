'use client'

import * as React from 'react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'

/**
 * Emotion cache for Next.js App Router: streaming SSR via `useServerInsertedHTML`, key `css`
 * to match Theme UI / Chronogrove.
 *
 * Intercepts `cache.insert` and flushes only *new* rule names on each `useServerInsertedHTML`
 * invocation. Do **not** use `Object.keys(cache.inserted)` (or similar) in the hook body — that
 * re-emits every rule on every chunk during streaming SSR. Here, `flush()` drains a per-request
 * queue so each rule is serialized once; `cache.inserted` stays as Emotion’s dedupe store.
 *
 * Next.js **pushes** a new callback from every render (`serverInsertedHTMLCallbacks.push`); all
 * closures call the same `flush`, so only the first callback in a flush pass drains pending names.
 *
 * @see https://github.com/emotion-js/emotion/issues/2928
 *
 * @see https://nextjs.org/docs/app/building-your-application/styling/css-in-js
 */
export function ChronogroveNextEmotionRegistry({ children }) {
  const [{ cache, flush }] = React.useState(() => {
    const c = createCache({ key: 'css' })
    c.compat = true
    const prevInsert = c.insert
    let pendingNames = []
    c.insert = (...args) => {
      const serialized = args[1]
      if (serialized != null && c.inserted[serialized.name] === undefined) {
        pendingNames.push(serialized.name)
      }
      return prevInsert(...args)
    }
    const flush = () => {
      const names = pendingNames
      pendingNames = []
      return names
    }
    return { cache: c, flush }
  })

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) {
      return null
    }
    let styles = ''
    for (const name of names) {
      const inserted = cache.inserted[name]
      // `inserted` can be `true` for Global/keyframes when rules are already in a sheet (Next.js + Emotion pattern).
      if (typeof inserted === 'string') {
        styles += inserted
      }
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
