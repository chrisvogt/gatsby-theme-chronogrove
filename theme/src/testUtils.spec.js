import React from 'react'
import { render } from '@testing-library/react'
import { TestProvider, TestProviderWithState, store } from './testUtils'

describe('testUtils', () => {
  it('exports the Redux store', () => {
    expect(store).toBeDefined()
    expect(typeof store.dispatch).toBe('function')
    expect(typeof store.getState).toBe('function')
  })

  describe('TestProvider', () => {
    it('provides ThemeUI context to children', () => {
      const TestComponent = () => <div data-testid='test'>Test</div>

      const { getByTestId } = render(
        <TestProvider>
          <TestComponent />
        </TestProvider>
      )

      expect(getByTestId('test')).toBeInTheDocument()
    })
  })

  describe('TestProviderWithState', () => {
    it('provides both Redux and ThemeUI context to children', () => {
      const TestComponent = () => <div data-testid='test'>Test with State</div>

      const { getByTestId } = render(
        <TestProviderWithState>
          <TestComponent />
        </TestProviderWithState>
      )

      expect(getByTestId('test')).toBeInTheDocument()
    })
  })
})
