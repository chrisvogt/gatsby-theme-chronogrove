import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Placeholder from './placeholder'

describe('GitHub Placeholder Renderer', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<Placeholder />)
    expect(asFragment()).toMatchSnapshot()
  })
})
