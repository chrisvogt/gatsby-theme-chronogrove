import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import MetricBadge from './metric-badge.js'

describe('MetricBadge', () => {
  it('renders children', () => {
    render(
      <ThemeUIProvider theme={{}}>
        <MetricBadge>42</MetricBadge>
      </ThemeUIProvider>
    )
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
