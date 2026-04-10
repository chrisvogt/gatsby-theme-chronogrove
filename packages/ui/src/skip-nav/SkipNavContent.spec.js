/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import SkipNavContent from './SkipNavContent'

describe('SkipNavContent', () => {
  it('renders target region with id and data attribute', () => {
    render(
      <SkipNavContent>
        <span>main</span>
      </SkipNavContent>
    )
    const region = document.getElementById('skip-nav-content')
    expect(region).not.toBeNull()
    expect(region).toHaveAttribute('data-skip-nav-content', '')
    expect(region).toHaveAttribute('tabIndex', '-1')
    expect(screen.getByText('main')).toBeInTheDocument()
  })
})
