/**
 * @jest-environment jsdom
 */

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Button from './button'

describe('Button', () => {
  it('renders with label and handles click', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Save</Button>)
    fireEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
