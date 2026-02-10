import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import StatusCard from './status-card'

describe('StatusCard', () => {
  it('matches the snapshot', () => {
    const message = 'Lorum ipsum dolor sit amet.'
    const { asFragment } = render(<StatusCard>{message}</StatusCard>)
    expect(asFragment()).toMatchSnapshot()
  })
})
