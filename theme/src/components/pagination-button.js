/** @jsx jsx */
import React from 'react'
import { jsx, useThemeUI } from 'theme-ui'
import isDarkMode from '../helpers/isDarkMode'
import { hexToRgb } from '../utils/colors'

const PaginationButton = ({
  children,
  onClick,
  disabled = false,
  active = false,
  variant = 'primary',
  size = 'medium',
  icon,
  ...props
}) => {
  const { colorMode, theme } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

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

  const sizeVariants = {
    small: {
      fontSize: ['10px', '11px'],
      padding: '4px 8px',
      minWidth: ['24px', '28px'],
      height: ['24px', '28px'],
      gap: 1
    },
    medium: {
      fontSize: ['11px', '12px'],
      padding: '6px 10px',
      minWidth: ['28px', '32px'],
      height: ['28px', '32px'],
      gap: 1
    },
    large: {
      fontSize: ['12px', '13px'],
      padding: '8px 12px',
      minWidth: ['32px', '36px'],
      height: ['32px', '36px'],
      gap: 2
    }
  }
  const sizeStyles = sizeVariants[size] || sizeVariants.medium

  const baseStyles = {
    color: active ? 'white' : primaryColor,
    textDecoration: 'none',
    fontWeight: active ? 'bold' : 'medium',
    fontSize: sizeStyles.fontSize,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizeStyles.gap,
    padding: sizeStyles.padding,
    minWidth: sizeStyles.minWidth,
    height: sizeStyles.height,
    borderRadius: '6px',
    background: active ? primaryColor : `rgba(${rgb}, 0.1)`,
    border: active ? `1px solid ${primaryColor}` : `1px solid rgba(${rgb}, 0.2)`,
    transition: 'all 0.2s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    '&:hover:not(:disabled)': {
      background: active ? primaryColor : `rgba(${rgb}, 0.2)`,
      textDecoration: 'none',
      transform: 'scale(1.02)'
    },
    '&:focus:not(:disabled)': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${primaryColor}20`
    },
    '&:active:not(:disabled)': {
      transform: 'scale(0.98)'
    }
  }

  const content = (
    <>
      {children}
      {icon && icon}
    </>
  )

  return (
    <button type='button' onClick={onClick} disabled={disabled} sx={baseStyles} {...props}>
      {content}
    </button>
  )
}

export default PaginationButton
