import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import WidgetHeader from './widget-header'

const aside = <div className='sidebar-content'>Sidebar</div>

describe('WidgetHeader', () => {
  it('matches the snapshot', () => {
    const widgetTitle = 'Neat & Interesting Widget'
    const { asFragment } = render(
      <WidgetHeader aside={aside} platform='GitHub'>
        {widgetTitle}
      </WidgetHeader>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
