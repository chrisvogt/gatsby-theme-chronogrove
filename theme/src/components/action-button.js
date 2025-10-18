/** @jsx jsx */
import React from 'react'
import { jsx, useThemeUI } from 'theme-ui'
import isDarkMode from '../helpers/isDarkMode'

const ActionButton = ({ children, href, onClick, variant = 'primary', size = 'medium', icon, ...props }) => {
  const { colorMode } = useThemeUI()
  const darkModeActive = isDarkMode(colorMode)

  // Color variants
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

  // Size variants
  const sizeVariants = {
    small: {
      fontSize: ['11px', '12px'],
      padding: '6px 10px',
      gap: 1
    },
    medium: {
      fontSize: ['12px', '13px'],
      padding: '8px 12px',
      gap: 1
    },
    large: {
      fontSize: ['13px', '14px'],
      padding: '10px 16px',
      gap: 2
    }
  }

  const selectedColor = colorVariants[variant] || colorVariants.primary
  const primaryColor = darkModeActive ? selectedColor.dark : selectedColor.light
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
    background: darkModeActive ? `rgba(${hexToRgb(primaryColor)}, 0.1)` : `rgba(${hexToRgb(primaryColor)}, 0.1)`,
    border: darkModeActive
      ? `1px solid rgba(${hexToRgb(primaryColor)}, 0.2)`
      : `1px solid rgba(${hexToRgb(primaryColor)}, 0.2)`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      background: darkModeActive ? `rgba(${hexToRgb(primaryColor)}, 0.2)` : `rgba(${hexToRgb(primaryColor)}, 0.2)`,
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

  // Helper function to convert hex to RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '74, 158, 255' // fallback to blue
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
