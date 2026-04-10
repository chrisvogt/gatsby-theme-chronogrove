/**
 * @jest-environment jsdom
 */

import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import ColorToggle from './color-toggle'

const mockUseColorMode = jest.fn()

jest.mock('theme-ui', () => ({
  useColorMode: (...args) => mockUseColorMode(...args)
}))

describe('ColorToggle', () => {
  beforeEach(() => {
    mockUseColorMode.mockReset()
  })

  it('toggles from default to dark', () => {
    const setColorMode = jest.fn()
    mockUseColorMode.mockReturnValue(['default', setColorMode])
    render(<ColorToggle />)
    fireEvent.click(screen.getByRole('button', { name: /toggle color mode/i }))
    expect(setColorMode).toHaveBeenCalledWith('dark')
  })

  it('toggles from dark to default', () => {
    const setColorMode = jest.fn()
    mockUseColorMode.mockReturnValue(['dark', setColorMode])
    render(<ColorToggle />)
    fireEvent.click(screen.getByRole('button', { name: /toggle color mode/i }))
    expect(setColorMode).toHaveBeenCalledWith('default')
  })
})
