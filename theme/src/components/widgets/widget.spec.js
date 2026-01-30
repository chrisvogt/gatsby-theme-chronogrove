import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Widget from './widget'

describe('Widget', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<Widget>Test</Widget>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('sets the widget id attribute when provided', () => {
    const id = 'fake-widget'
    render(<Widget id={id}>Test</Widget>)
    const section = document.querySelector('section')
    expect(section).toHaveAttribute('id', id)
  })
})
