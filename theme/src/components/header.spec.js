import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import Header from './header'

describe('Header', () => {
  it('renders with children', () => {
    const { asFragment } = render(
      <Header>
        <h1>Test Header</h1>
      </Header>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with custom styles', () => {
    const customStyles = {
      backgroundColor: 'red',
      color: 'white'
    }
    const { asFragment } = render(
      <Header styles={customStyles}>
        <h1>Test Header with Styles</h1>
      </Header>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders without styles prop', () => {
    const { asFragment } = render(
      <Header>
        <h1>Test Header without Styles</h1>
      </Header>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders with empty styles object', () => {
    const { asFragment } = render(
      <Header styles={{}}>
        <h1>Test Header with Empty Styles</h1>
      </Header>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
