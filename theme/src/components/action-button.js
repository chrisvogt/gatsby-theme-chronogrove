/** @jsx jsx */
import React from 'react'
import { jsx, useThemeUI } from 'theme-ui'
import isDarkMode from '../helpers/isDarkMode'
import { hexToRgb } from '../utils/colors'

const ActionButton = ({ children, href, onClick, variant = 'primary', size = 'medium', icon, ...props }) => {
  const { colorMode, theme } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  // Color variants (primary and invalid use theme; others use local hex + hexToRgb)
  const colorVariants = {
    secondary: { light: '#666', dark: '#888' },
    success: { light: '#28a745', dark: '#4CAF50' },
    warning: { light: '#ffc107', dark: '#FF9800' },
    danger: { light: '#dc3545', dark: '#f44336' }
  }
  const isPrimary = variant === 'primary' || !colorVariants[variant]
  const primaryColor = isPrimary
    ? (theme?.colors?.primary ?? '#422EA3')
    : darkModeActive
      ? colorVariants[variant].dark
      : colorVariants[variant].light
  const rgb = isPrimary ? (theme?.colors?.primaryRgb ?? '66, 46, 163') : hexToRgb(primaryColor)

  // Size variants
  const sizeVariants = {
    small: { fontSize: ['11px', '12px'], padding: '6px 10px', gap: 1 },
    medium: { fontSize: ['12px', '13px'], padding: '8px 12px', gap: 1 },
    large: { fontSize: ['13px', '14px'], padding: '10px 16px', gap: 2 }
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
      {icon && icon}
    </>
  )

  if (href) {
    return (
      <a href={href} sx={baseStyles} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button type='button' onClick={onClick} sx={baseStyles} {...props}>
      {content}
    </button>
  )
}

export default ActionButton
