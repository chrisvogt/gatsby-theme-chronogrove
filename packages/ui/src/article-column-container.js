import React from 'react'
import { Container } from '@theme-ui/components'

/**
 * Primary text column width for MDX posts, blog index, and about-style pages.
 * Keep in sync wherever the article measure must match (Gatsby post template, blog index, etc.).
 */
export const articleColumnContainerSx = {
  position: 'relative',
  width: ['', '', 'max(80ch, 50vw)'],
  lineHeight: 1.7
}

/**
 * Theme UI `Container` with {@link articleColumnContainerSx}. Pass `sx` to merge (e.g. `flexGrow: 1` on the blog index).
 */
export function ArticleColumnContainer({ children, sx = {}, ...rest }) {
  return (
    <Container sx={{ ...articleColumnContainerSx, ...sx }} {...rest}>
      {children}
    </Container>
  )
}
