/** @jsx jsx */
import { Box, jsx, useColorMode } from 'theme-ui'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleInfo, faClock } from '@fortawesome/free-solid-svg-icons'

const SUCCESS_COLORS = { light: '#28a745', dark: '#4CAF50' }

const VARIANTS = {
  /** Positive resolution, update, or good news */
  update: {
    icon: faCircleCheck
  },
  /** Informational aside */
  info: {
    icon: faCircleInfo,
    borderColor: 'primary',
    bg: theme => `rgba(${theme.colors.primaryRgb}, 0.06)`
  },
  /** Content may be outdated or in flux */
  outdated: {
    icon: faClock,
    borderColor: '#d97706',
    bg: 'rgba(217, 119, 6, 0.08)'
  }
}

/**
 * Callout panel for notes, updates, and other asides in blog posts.
 * Icon sits on its own row above the content for a clean, modern layout.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content of the note
 * @param {'update'|'info'|'outdated'} [props.variant='info'] - Visual variant
 * @param {boolean} [props.icon=true] - Whether to show the variant icon
 */
const Note = ({ children, variant = 'info', icon: showIcon = true }) => {
  const [colorMode] = useColorMode()
  const config = VARIANTS[variant] ?? VARIANTS.info
  const { icon, borderColor, bg } = config

  const isUpdate = variant === 'update'
  const successColor = SUCCESS_COLORS[colorMode] ?? SUCCESS_COLORS.light
  const resolvedBorderColor = isUpdate ? successColor : borderColor
  const resolvedBg = isUpdate ? (colorMode === 'dark' ? 'rgba(76, 175, 80, 0.12)' : 'rgba(40, 167, 69, 0.08)') : bg
  const iconColor = isUpdate ? successColor : borderColor

  return (
    <Box
      as='blockquote'
      sx={{
        borderLeft: '4px solid',
        borderColor: resolvedBorderColor,
        bg: resolvedBg,
        pt: 3,
        pb: 3,
        px: 3,
        my: 4,
        borderRadius: '0 8px 8px 0',
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
      {showIcon && icon && (
        <Box
          sx={{
            mb: 1,
            color: iconColor,
            fontSize: [3, 4]
          }}
          aria-hidden
        >
          <FontAwesomeIcon icon={icon} />
        </Box>
      )}
      <Box
        sx={{
          pt: 1,
          '& > *:first-of-type': { mt: 0 },
          '& > *:last-of-type': { mb: 0 }
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

Note.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['update', 'info', 'outdated']),
  icon: PropTypes.bool
}

export default Note
