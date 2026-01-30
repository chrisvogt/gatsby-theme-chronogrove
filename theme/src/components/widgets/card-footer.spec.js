import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import CardFooter from './card-footer'

describe('CardFooter', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<CardFooter>Test</CardFooter>)
    expect(asFragment()).toMatchSnapshot()
  })
})
