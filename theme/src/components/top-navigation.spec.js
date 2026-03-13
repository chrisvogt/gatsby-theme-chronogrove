import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { TestProvider } from '../testUtils'
import TopNavigation from './top-navigation'
import useNavigationData from '../hooks/use-navigation-data'
import useSiteMetadata from '../hooks/use-site-metadata'

const mockSiteMetadata = {
  title: 'My Personal Blog & Portfolio'
}

const mockNavigationData = {
  header: {
    left: [
      {
        path: '/about-me',
        slug: 'about-me',
        text: 'About Me',
        title: 'About Me'
      }
    ]
  }
}

jest.mock('../hooks/use-navigation-data')
jest.mock('../hooks/use-site-metadata')
jest.mock('@gatsbyjs/reach-router', () => ({
  ...jest.requireActual('@gatsbyjs/reach-router'),
  useLocation: jest.fn(() => ({ pathname: '/', hash: '', search: '' }))
}))

beforeEach(() => {
  window.___navigate = window.___navigate || jest.fn()
})

describe('TopNavigation', () => {
  useNavigationData.mockImplementation(() => mockNavigationData)
  useSiteMetadata.mockImplementation(() => mockSiteMetadata)

  it('matches the snapshot', () => {
    const { asFragment } = render(
      <TestProvider>
        <TopNavigation />
      </TestProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('calls window.scrollTo when brand link is clicked on home path', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    useSiteMetadata.mockImplementation(() => mockSiteMetadata)
    useNavigationData.mockImplementation(() => mockNavigationData)
    const { getByText } = render(
      <TestProvider>
        <TopNavigation />
      </TestProvider>
    )
    getByText('My Personal Blog & Portfolio').click()
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
    scrollToSpy.mockRestore()
  })

  it('does not call window.scrollTo when brand link is clicked on non-home path', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const { useLocation } = require('@gatsbyjs/reach-router')
    useLocation.mockReturnValueOnce({ pathname: '/about', hash: '', search: '' })
    const { getByText } = render(
      <TestProvider>
        <TopNavigation />
      </TestProvider>
    )
    getByText('My Personal Blog & Portfolio').click()
    expect(scrollToSpy).not.toHaveBeenCalled()
    scrollToSpy.mockRestore()
  })
})
