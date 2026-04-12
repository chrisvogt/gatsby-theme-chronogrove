import { render, screen } from '@testing-library/react'

import ViewExternalLinkIcon, { ExternalLinkIcon } from './external-link-icon.js'

describe('ExternalLinkIcon', () => {
  it('renders inline svg', () => {
    const { container } = render(<ExternalLinkIcon data-testid='ico' />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTestId('ico')).toBeInTheDocument()
  })

  it('ViewExternalLinkIcon wraps icon in span', () => {
    const { container } = render(<ViewExternalLinkIcon />)
    expect(container.querySelector('span svg')).toBeInTheDocument()
  })
})
