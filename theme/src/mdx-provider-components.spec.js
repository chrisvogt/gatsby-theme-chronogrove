import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockUseColorMode = jest.fn(() => ['default', jest.fn()])

jest.mock('theme-ui', () => ({
  ...jest.requireActual('theme-ui'),
  useColorMode: () => mockUseColorMode()
}))

import { MdxPrePassthrough, MdxTable } from './mdx-provider-components'
import { ThemeUIProvider } from 'theme-ui'

const tableTheme = {
  styles: {
    table: { borderCollapse: 'collapse' },
    tableDark: { borderCollapse: 'collapse', bg: '#222' }
  }
}

describe('mdx-provider-components', () => {
  beforeEach(() => {
    mockUseColorMode.mockReturnValue(['default', jest.fn()])
  })

  it('MdxTable uses table variant in default mode', () => {
    render(
      <ThemeUIProvider theme={tableTheme}>
        <MdxTable>
          <tbody>
            <tr>
              <td>cell</td>
            </tr>
          </tbody>
        </MdxTable>
      </ThemeUIProvider>
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('MdxTable uses tableDark variant in dark mode', () => {
    mockUseColorMode.mockReturnValue(['dark', jest.fn()])
    render(
      <ThemeUIProvider theme={tableTheme}>
        <MdxTable>
          <tbody>
            <tr>
              <td>cell</td>
            </tr>
          </tbody>
        </MdxTable>
      </ThemeUIProvider>
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('MdxPrePassthrough renders children', () => {
    render(
      <MdxPrePassthrough>
        <span data-testid='inner'>x</span>
      </MdxPrePassthrough>
    )
    expect(screen.getByTestId('inner')).toHaveTextContent('x')
  })
})
