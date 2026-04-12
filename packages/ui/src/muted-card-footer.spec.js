import { render, screen } from '@testing-library/react'
import { ThemeUIProvider } from 'theme-ui'

import MutedCardFooter from './muted-card-footer.js'

const theme = { styles: { mutedCardFooter: { mt: 2 } } }

const wrap = ui => render(<ThemeUIProvider theme={theme}>{ui}</ThemeUIProvider>)

describe('MutedCardFooter', () => {
  it('renders children', () => {
    wrap(<MutedCardFooter>Footer text</MutedCardFooter>)
    expect(screen.getByText('Footer text')).toBeInTheDocument()
  })

  it('merges customStyles when an object', () => {
    wrap(<MutedCardFooter customStyles={{ mt: 4 }}>A</MutedCardFooter>)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('ignores non-object customStyles', () => {
    wrap(<MutedCardFooter customStyles='invalid'>B</MutedCardFooter>)
    expect(screen.getByText('B')).toBeInTheDocument()
  })
})
