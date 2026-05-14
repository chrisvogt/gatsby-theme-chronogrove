import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Emoji from './emoji'

describe('Emoji Component', () => {
  it('renders the emoji with aria-hidden when no label is provided', () => {
    render(<Emoji>😊</Emoji>)

    const emojiElement = screen.getByText('😊')
    expect(emojiElement).toHaveAttribute('aria-hidden', 'true')
    expect(emojiElement).toHaveAttribute('role', 'img')
  })

  it('renders the emoji with aria-label when a label is provided', () => {
    render(<Emoji label='Smiling face'>😊</Emoji>)

    const emojiElement = screen.getByText('😊')
    expect(emojiElement).toHaveAttribute('aria-label', 'Smiling face')
    expect(emojiElement).toHaveAttribute('aria-hidden', 'false')
    expect(emojiElement).toHaveAttribute('role', 'img')
  })

  it('renders the correct emoji children', () => {
    render(<Emoji>👍</Emoji>)

    expect(screen.getByText('👍')).toBeInTheDocument()
  })
})
