/** @jsx jsx */
import { Box, jsx } from 'theme-ui'

/**
 * Callout panel for notes, updates, and other asides in blog posts.
 * Supports theme colors; can be extended with variants in the future.
 */
const Note = ({ children }) => (
  <Box
    as='blockquote'
    sx={{
      borderLeft: '4px solid',
      borderColor: 'primary',
      bg: theme => `rgba(${theme.colors.primaryRgb}, 0.08)`,
      py: 2,
      px: 3,
      my: 4,
      borderRadius: '0 4px 4px 0',
      fontSize: [2, 3],
      color: 'text',
      '& a': {
        color: 'primary',
        textDecoration: 'none',
        '&:hover, &:focus': {
          textDecoration: 'underline'
        },
        '&:focus': {
          outline: 'none',
          boxShadow: theme => `0 0 0 2px ${theme.colors.primary}40`
        }
      }
    }}
  >
    {children}
  </Box>
)

export default Note
