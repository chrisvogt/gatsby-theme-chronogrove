import createCache from '@emotion/cache'

const CACHE_KEY = 'css'

export function createChronogroveEmotionCache() {
  const insertionPoint =
    typeof document !== 'undefined' ? document.querySelector('meta[name="emotion-insertion-point"]') : undefined

  return createCache({
    key: CACHE_KEY,
    insertionPoint: insertionPoint || undefined
  })
}

let emotionCacheSingleton

export function getChronogroveEmotionCache() {
  if (!emotionCacheSingleton) {
    emotionCacheSingleton = createChronogroveEmotionCache()
  }
  return emotionCacheSingleton
}
