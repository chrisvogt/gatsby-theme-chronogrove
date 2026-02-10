import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import MetricCard from './metric-card'

describe('MetricCard', () => {
  it('matches the snapshot', () => {
    const { asFragment } = render(<MetricCard title='Fake Metric' value='Fake Value' ready='true' />)
    expect(asFragment()).toMatchSnapshot()
  })
})
