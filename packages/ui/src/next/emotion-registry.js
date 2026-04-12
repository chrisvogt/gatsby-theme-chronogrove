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
 * invocation. Without this, each streaming chunk re-emits the full `cache.inserted` map and
 * duplicates `<style>` tags (see emotion-js/emotion#2928, @Andarist’s pattern).
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
      styles += cache.inserted[name]
    }
    return <style data-emotion={`${cache.key} ${names.join(' ')}`} dangerouslySetInnerHTML={{ __html: styles }} />
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
