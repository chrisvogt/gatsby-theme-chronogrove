/** @jsx jsx */
import React from 'react'
import { jsx, useThemeUI } from 'theme-ui'
import isDarkMode from '../helpers/isDarkMode'

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
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  // Color variants - same as ActionButton
  const colorVariants = {
    primary: {
      light: '#422EA3',
      dark: '#4a9eff'
    },
    secondary: {
      light: '#666',
      dark: '#888'
    },
    success: {
      light: '#28a745',
      dark: '#4CAF50'
    },
    warning: {
      light: '#ffc107',
      dark: '#FF9800'
    },
    danger: {
      light: '#dc3545',
      dark: '#f44336'
    }
  }

  // Size variants - adapted for pagination
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

  const selectedColor = colorVariants[variant] || colorVariants.primary
  const primaryColor = darkModeActive ? selectedColor.dark : selectedColor.light
  const sizeStyles = sizeVariants[size] || sizeVariants.medium

  // Helper function to convert hex to RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '74, 158, 255' // fallback to blue
  }

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
    background: active
      ? primaryColor
      : darkModeActive
        ? `rgba(${hexToRgb(primaryColor)}, 0.1)`
        : `rgba(${hexToRgb(primaryColor)}, 0.1)`,
    border: active
      ? `1px solid ${primaryColor}`
      : darkModeActive
        ? `1px solid rgba(${hexToRgb(primaryColor)}, 0.2)`
        : `1px solid rgba(${hexToRgb(primaryColor)}, 0.2)`,
    transition: 'all 0.2s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    '&:hover:not(:disabled)': {
      background: active
        ? primaryColor
        : darkModeActive
          ? `rgba(${hexToRgb(primaryColor)}, 0.2)`
          : `rgba(${hexToRgb(primaryColor)}, 0.2)`,
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
