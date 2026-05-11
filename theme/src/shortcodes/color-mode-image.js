/** @jsx jsx */
import { jsx, useColorMode } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'

import isDarkMode from '../helpers/isDarkMode'

/**
 * True when the hostname is a subdomain of cloudinary.com (e.g. res.cloudinary.com).
 * Uses DNS labels instead of substring checks so lookalikes like evil-cloudinary.com are rejected.
 *
 * @param {unknown} hostname
 * @returns {boolean}
 */
export function isCloudinaryDeliveryHostname(hostname) {
  if (!hostname || typeof hostname !== 'string') return false
  const labels = hostname.toLowerCase().split('.').filter(Boolean)
  const n = labels.length
  return n >= 3 && labels[n - 2] === 'cloudinary' && labels[n - 1] === 'com'
}

/**
 * Insert `f_auto,q_auto` after `/upload/` when the URL is a vanilla Cloudinary
 * delivery URL (no existing transformation segment).
 *
 * @param {string} url
 * @returns {string}
 */
export function applyCloudinaryAutoTransform(url) {
  if (!url || typeof url !== 'string') return url
  try {
    const parsed = new URL(url)
    if (!isCloudinaryDeliveryHostname(parsed.hostname)) return url
    const segments = parsed.pathname.split('/').filter(Boolean)
    const uploadIdx = segments.indexOf('upload')
    if (uploadIdx === -1) return url
    const afterUpload = segments.slice(uploadIdx + 1).join('/')
    if (!afterUpload || /(^|\/)f_auto|\bq_auto\b/.test(afterUpload)) return url
    segments.splice(uploadIdx + 1, 0, 'f_auto,q_auto')
    parsed.pathname = `/${segments.join('/')}`
    return parsed.toString()
  } catch {
    return url
  }
}

/**
 * Renders an <img> whose src follows Theme UI color mode (light vs dark).
 * Intended as an MDX shortcode — no import needed in posts.
 *
 * @param {Object} props
 * @param {string} props.light - Image URL for light mode
 * @param {string} props.dark - Image URL for dark mode
 * @param {string} props.alt - Accessible alternative text
 * @param {boolean} [props.optimizeDelivery=true] - Apply Cloudinary f_auto,q_auto when URLs omit transforms
 */
const ColorModeImage = ({ light, dark, alt, optimizeDelivery = true, loading, ...rest }) => {
  const [colorMode] = useColorMode()
  const pickDark = isDarkMode(colorMode)
  const lightSrc = optimizeDelivery ? applyCloudinaryAutoTransform(light) : light
  const darkSrc = optimizeDelivery ? applyCloudinaryAutoTransform(dark) : dark
  const src = pickDark ? darkSrc : lightSrc

  return <Themed.img {...rest} alt={alt} src={src} loading={loading ?? 'lazy'} />
}

export default ColorModeImage
