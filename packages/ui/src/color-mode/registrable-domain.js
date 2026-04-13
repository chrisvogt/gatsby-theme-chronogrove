/**
 * Public suffix / site registrable domain used for `Domain=` on shared cookies (e.g. `example.com`,
 * not `www.example.com`). Must be safe to embed in a Set-Cookie line.
 */
export function validateRegistrableDomain(registrableDomain) {
  if (typeof registrableDomain !== 'string') {
    return null
  }
  const t = registrableDomain.trim().toLowerCase()
  if (!t || t.includes('..') || !/^[a-z0-9.-]+$/.test(t)) {
    return null
  }
  return t
}

/**
 * True when `hostname` is the apex or a subdomain of `registrableDomain` (e.g. `www.example.com`
 * under `example.com`). Rejects lookalikes like `notexample.com`.
 */
export function isHostnameUnderRegistrableDomain(hostname, registrableDomain) {
  const base = validateRegistrableDomain(registrableDomain)
  if (!base) {
    return false
  }
  if (!hostname || typeof hostname !== 'string') {
    return false
  }
  const h = hostname.trim().toLowerCase()
  return h === base || h.endsWith(`.${base}`)
}
