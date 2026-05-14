import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { TestProvider } from '../testUtils'
import HomeNavigation from './home-navigation'
import useNavigationData from '../hooks/use-navigation-data'
import useSiteMetadata from '../hooks/use-site-metadata'

jest.mock('../hooks/use-navigation-data')
jest.mock('../hooks/use-site-metadata')

describe('HomeNavigation hash navigation → scroll + focus', () => {
  beforeEach(() => {
    useNavigationData.mockImplementation(() => ({
      header: {
        home: []
      }
    }))
    useSiteMetadata.mockReturnValue({})
    document.body.replaceChildren()
  })

  /**
   * `home-navigation.spec.js` mocks `scroll-to-element-when-ready`; keep one integration check
   * here with the real helper so regressions cannot hide behind the mock.
   */
  it('focuses posts section after Latest Posts anchor is activated', () => {
    const scrollIntoView = jest.fn()
    const focusPosts = jest.fn()

    const posts = document.createElement('section')
    posts.id = 'posts'
    posts.tabIndex = -1
    posts.scrollIntoView = scrollIntoView
    posts.focus = focusPosts
    document.body.appendChild(posts)

    const { container } = render(
      <TestProvider>
        <HomeNavigation scrollSyncDisabled />
      </TestProvider>
    )

    fireEvent.click(container.querySelector('a[href="#posts"]'))

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(focusPosts).toHaveBeenCalledWith({ preventScroll: true })
  })
})
