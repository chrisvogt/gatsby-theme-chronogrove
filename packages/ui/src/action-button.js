import React from 'react'
import { Box } from '@theme-ui/components'
import { useThemeUI } from 'theme-ui'
import isDarkMode from './helpers/isDarkMode.js'
import { hexToRgb } from './color-utils.js'

const ActionButton = ({ children, href, onClick, variant = 'primary', size = 'medium', icon, ...props }) => {
  const { colorMode, theme } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  const colorVariants = {
    secondary: { light: '#666', dark: '#888' },
    success: { light: '#28a745', dark: '#4CAF50' },
    warning: { light: '#ffc107', dark: '#FF9800' },
    danger: { light: '#dc3545', dark: '#f44336' }
  }
  const isPrimary = variant === 'primary' || !colorVariants[variant]
  let primaryColor = theme?.colors?.primary ?? '#422EA3'
  if (!isPrimary) {
    const palette = colorVariants[variant]
    primaryColor = darkModeActive ? palette.dark : palette.light
  }
  const rgb = isPrimary ? (theme?.colors?.primaryRgb ?? '66, 46, 163') : hexToRgb(primaryColor)

  const sizeVariants = {
    small: { fontSize: ['11px', '12px'], padding: '6px 10px', gap: 1 },
    medium: { fontSize: ['12px', '13px'], padding: '8px 12px', gap: 1 },
    large: { fontSize: ['13px', '14px'], padding: '10px 16px', gap: 2 },
    /** Prominent inline actions (e.g. widget read-more toggles) */
    xlarge: { fontSize: ['14px', '16px'], padding: '12px 20px', gap: 2 }
  }
  const sizeStyles = sizeVariants[size] || sizeVariants.medium

  const baseStyles = {
    color: primaryColor,
    textDecoration: 'none',
    fontWeight: 'medium',
    fontSize: sizeStyles.fontSize,
    display: 'inline-flex',
    alignItems: 'center',
    gap: sizeStyles.gap,
    padding: sizeStyles.padding,
    borderRadius: '6px',
    background: `rgba(${rgb}, 0.1)`,
    border: `1px solid rgba(${rgb}, 0.2)`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      background: `rgba(${rgb}, 0.2)`,
      textDecoration: 'none',
      transform: 'scale(1.02)'
    },
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${primaryColor}20`
    },
    '&:active': {
      transform: 'scale(0.98)'
    }
  }

  const content = (
    <>
      {children}
      {icon}
    </>
  )

  if (href) {
    return (
      <Box as='a' href={href} sx={baseStyles} {...props}>
        {content}
      </Box>
    )
  }

  return (
    <Box as='button' type='button' onClick={onClick} sx={baseStyles} {...props}>
      {content}
    </Box>
  )
}

export default ActionButton
