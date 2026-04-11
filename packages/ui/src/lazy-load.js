import { useState, useEffect } from 'react'
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

/**
 * Lazy Loader
 *
 * Hides a component until it's been visible in the viewport.
 */
const LazyLoad = ({ children, placeholder = <DefaultPlaceholder /> }) => {
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0
  })

  useEffect(() => {
    if (inView && !hasBeenVisible) {
      setHasBeenVisible(true)
    }
  }, [inView, hasBeenVisible])

  return <Box ref={ref}>{hasBeenVisible ? children : placeholder}</Box>
}

export default LazyLoad
