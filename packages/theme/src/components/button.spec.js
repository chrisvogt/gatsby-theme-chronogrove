import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from './button'
import { ThemeUIProvider } from 'theme-ui'

// Mock Theme
const mockTheme = {
  buttons: {
    primary: {
      backgroundColor: 'blue',
      color: 'white'
    },
    secondary: {
      backgroundColor: 'gray',
      color: 'black'
    }
  }
}

describe('Button', () => {
  it('renders a button with default variant (primary)', () => {
    render(
      <ThemeUIProvider theme={mockTheme}>
        <Button>Click me</Button>
      </ThemeUIProvider>
    )
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveStyle('background-color: rgb(0, 0, 255)')
    expect(button).toHaveStyle('color: rgb(255, 255, 255)')
  })

  it('renders a button with the secondary variant', () => {
    render(
      <ThemeUIProvider theme={mockTheme}>
        <Button variant='secondary'>Click me</Button>
      </ThemeUIProvider>
    )
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveStyle('background-color: rgb(128, 128, 128)')
    expect(button).toHaveStyle('color: rgb(0, 0, 0)')
  })

  it('passes additional props to the button element', () => {
    render(
      <ThemeUIProvider theme={mockTheme}>
        <Button type='submit'>Submit</Button>
      </ThemeUIProvider>
    )

    const button = screen.getByRole('button', { name: /submit/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })
})
