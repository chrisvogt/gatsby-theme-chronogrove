import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PageHeader from './page-header'

describe('PageHeader', () => {
  it('renders correctly with given children', () => {
    render(<PageHeader>Hello, World!</PageHeader>)
    const headingElement = screen.getByRole('heading', { name: /Hello, World!/i })
    expect(headingElement).toBeInTheDocument()
  })

  it('matches snapshot', () => {
    const { asFragment } = render(<PageHeader>Hello, World!</PageHeader>)
    expect(asFragment()).toMatchSnapshot()
  })
})
