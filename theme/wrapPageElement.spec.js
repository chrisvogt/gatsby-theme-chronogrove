import React from 'react'
import { render } from '@testing-library/react'
import wrapPageElement from './wrapPageElement'

// Mock the Layout component
jest.mock('./src/components/layout', () => {
  return function MockLayout({ children, testProp }) {
    return (
      <div data-testid='mock-layout' data-test-prop={testProp}>
        {children}
      </div>
    )
  }
})

describe('wrapPageElement', () => {
  it('wraps page element with Layout and passes props', () => {
    const TestElement = <div data-testid='test-element'>Test Content</div>
    const testProps = { testProp: 'test-value' }

    const result = wrapPageElement({
      element: TestElement,
      props: testProps
    })

    const { getByTestId } = render(result)

    // Verify Layout receives the props
    const layout = getByTestId('mock-layout')
    expect(layout).toHaveAttribute('data-test-prop', 'test-value')

    // Verify element is rendered as child
    expect(getByTestId('test-element')).toBeInTheDocument()
  })

  it('renders the element inside Layout', () => {
    const TestElement = <span>Child Content</span>
    const result = wrapPageElement({ element: TestElement, props: {} })

    const { getByTestId, getByText } = render(result)

    expect(getByTestId('mock-layout')).toContainElement(getByText('Child Content'))
  })
})
