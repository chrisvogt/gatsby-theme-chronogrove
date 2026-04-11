'use client'

import * as React from 'react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'

/**
 * Emotion cache for App Router: streaming SSR via useServerInsertedHTML, key `css` to match Theme UI / Chronogrove.
 * @see https://nextjs.org/docs/app/building-your-application/styling/css-in-js
 */
export default function EmotionRegistry({ children }) {
  const [cache] = React.useState(() => {
    const c = createCache({ key: 'css' })
    c.compat = true
    return c
  })

  useServerInsertedHTML(() => {
    const inserted = cache.inserted
    if (!inserted || Object.keys(inserted).length === 0) {
      return null
    }
    const names = Object.keys(inserted)
    let styles = ''
    for (const name of names) {
      styles += inserted[name]
    }
    return <style data-emotion={`${cache.key} ${names.join(' ')}`} dangerouslySetInnerHTML={{ __html: styles }} />
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
