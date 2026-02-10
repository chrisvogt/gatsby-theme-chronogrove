import React from 'react'
import { render, screen } from '@testing-library/react'

import SkipNavContent from './SkipNavContent'

describe('SkipNavContent', () => {
  it('renders with the default ID', () => {
    render(<SkipNavContent data-testid='skip-content' />)
    const element = screen.getByTestId('skip-content')
    expect(element).toHaveAttribute('id', 'skip-nav-content')
  })

  it('renders with a custom ID', () => {
    render(<SkipNavContent id='main-content' data-testid='skip-content' />)
    const element = screen.getByTestId('skip-content')
    expect(element).toHaveAttribute('id', 'main-content')
  })

  it('has the data-skip-nav-content attribute', () => {
    render(<SkipNavContent data-testid='skip-content' />)
    const element = screen.getByTestId('skip-content')
    expect(element).toHaveAttribute('data-skip-nav-content')
  })

  it('has tabIndex=-1 for programmatic focus', () => {
    render(<SkipNavContent data-testid='skip-content' />)
    const element = screen.getByTestId('skip-content')
    expect(element).toHaveAttribute('tabIndex', '-1')
  })

  it('renders children correctly', () => {
    render(
      <SkipNavContent>
        <p>Main content here</p>
      </SkipNavContent>
    )
    expect(screen.getByText('Main content here')).toBeInTheDocument()
  })

  it('renders as a div by default', () => {
    render(<SkipNavContent data-testid='skip-content' />)
    const element = screen.getByTestId('skip-content')
    expect(element.tagName).toBe('DIV')
  })

  it('supports the as prop for custom element', () => {
    render(<SkipNavContent as='section' data-testid='skip-content' />)
    const element = screen.getByTestId('skip-content')
    expect(element.tagName).toBe('SECTION')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef()
    render(<SkipNavContent ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('passes additional props through', () => {
    render(<SkipNavContent className='main-area' data-testid='skip-content' />)
    const element = screen.getByTestId('skip-content')
    expect(element).toHaveClass('main-area')
  })

  it('has displayName set for debugging', () => {
    expect(SkipNavContent.displayName).toBe('SkipNavContent')
  })

  it('has outline:none style to prevent focus ring', () => {
    render(<SkipNavContent data-testid='skip-content' />)
    const element = screen.getByTestId('skip-content')
    expect(element).toHaveStyle({ outline: 'none' })
  })
})
