import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@theme-ui/components'
import { useInView } from 'react-intersection-observer'

const DefaultPlaceholder = ({ height = '100%', width = '100%' }) => (
  <Box
    data-testid='default-placeholder'
    sx={{
      minHeight: '1px',
      minWidth: '1px',
      height,
      width
    }}
  >
    {' '}
  </Box>
)

DefaultPlaceholder.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

/**
 * Lazy Loader
 *
 * Hides a component until it's been visible in the viewport.
 *
 * IntersectionObserver does not run on the server; children are never included in SSR HTML.
 * On the client, observation is deferred until after mount so Next.js (and other SSR
 * frameworks) hydrate the placeholder first, then attach the observer — avoiding a
 * first-paint flash of real content when the block is already in view.
 *
 * @param {object} [props.useInViewOptions] -
 *   Passed to `useInView` after defaults (`triggerOnce: true`, `threshold: 0`,
 *   `initialInView: false`). Use `rootMargin` or `threshold` for stricter visibility.
 *   Pass `skip` to disable observation (merged with the internal client-only `skip`).
 */
const LazyLoad = ({ children, placeholder = <DefaultPlaceholder />, useInViewOptions = {} }) => {
  const [mounted, setMounted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const { skip: skipFromOptions, ...restInViewOptions } = useInViewOptions

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
    initialInView: false,
    ...restInViewOptions,
    skip: !mounted || !!skipFromOptions
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && inView) {
      setRevealed(true)
    }
  }, [mounted, inView])

  return <Box ref={ref}>{revealed ? children : placeholder}</Box>
}

LazyLoad.propTypes = {
  children: PropTypes.node.isRequired,
  placeholder: PropTypes.node,
  useInViewOptions: PropTypes.object
}

export default LazyLoad
