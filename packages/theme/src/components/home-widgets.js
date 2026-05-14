import React from 'react'

import GitHub from '../components/widgets/github'
import Goodreads from '../components/widgets/goodreads'
import Instagram from '../components/widgets/instagram'
import Flickr from '../components/widgets/flickr'
import RecentPosts from '../components/widgets/recent-posts'
import Spotify from '../components/widgets/spotify'
import Steam from '../components/widgets/steam'
import Discogs from '../components/widgets/discogs'

import useSiteMetadata from '../hooks/use-site-metadata'
import {
  getGithubWidgetDataSource,
  getGoodreadsWidgetDataSource,
  getInstagramWidgetDataSource,
  getFlickrWidgetDataSource,
  getSpotifyWidgetDataSource,
  getSteamWidgetDataSource,
  getDiscogsWidgetDataSource
} from '../selectors/metadata'

/**
 * Home Widgets
 *
 * Exports widgets to be rendered onto the home page. Override this file using
 * shadowing to add or remove widgets onto the home page.
 *
 * For example, if you are using this as a parent theme, create a new file at
 * /src/gatsby-theme-chronogrove/components/home-widgets.js to use GatsbyJS
 * theme shadowing to override this file. The import path for theme widgets
 * is: 'gatsby-theme-chronogrove/src/components/widgets/recent-posts'
 */
const HomeWidgets = () => {
  const metadata = useSiteMetadata()

  const githubDataSource = getGithubWidgetDataSource(metadata)
  const goodreadsDataSource = getGoodreadsWidgetDataSource(metadata)
  const instagramDataSource = getInstagramWidgetDataSource(metadata)
  const flickrDataSource = getFlickrWidgetDataSource(metadata)
  const spotifyDataSource = getSpotifyWidgetDataSource(metadata)
  const steamDataSource = getSteamWidgetDataSource(metadata)
  const discogsDataSource = getDiscogsWidgetDataSource(metadata)

  return (
    <>
      <RecentPosts />

      {instagramDataSource && <Instagram />}
      {flickrDataSource && <Flickr />}
      {githubDataSource && <GitHub />}
      {goodreadsDataSource && <Goodreads />}
      {spotifyDataSource && <Spotify />}
      {discogsDataSource && <Discogs />}
      {steamDataSource && <Steam />}
    </>
  )
}

export default HomeWidgets
