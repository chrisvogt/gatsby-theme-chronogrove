export const getAvatarURL = metadata => metadata?.avatarURL

export const getBaseURL = metadata => metadata?.baseURL

export const getDescription = metadata => metadata?.description

export const getFooterText = metadata => metadata?.footerText

export const getFlickrWidgetDataSource = metadata => metadata?.widgets?.flickr?.widgetDataSource

export const getFlickrUsername = metadata => metadata?.widgets?.flickr?.username

export const getGithubUsername = metadata => metadata?.widgets?.github?.username

export const getGithubWidgetDataSource = metadata => metadata?.widgets?.github?.widgetDataSource

export const getGoodreadsUsername = metadata => metadata?.widgets?.goodreads?.username

export const getGoodreadsWidgetDataSource = metadata => metadata?.widgets?.goodreads?.widgetDataSource

/**
 * Public Goodreads profile URL from a widget payload `profile` object.
 * Prefer `profileURL` (same field name as other Chronogrove widgets); older responses may only set `link`.
 * @param {{ profileURL?: string, link?: string } | null | undefined} profile
 * @returns {string | undefined}
 */
export const getGoodreadsProfilePageUrl = profile => profile?.profileURL || profile?.link || undefined

export const getHeadline = metadata => metadata?.headline

export const getImageURL = metadata => metadata?.imageURL

export const getInstagramWidgetDataSource = metadata => metadata?.widgets?.instagram?.widgetDataSource

export const getInstagramUsername = metadata => metadata?.widgets?.instagram?.username

export const getLanguageCode = metadata => metadata?.languageCode

export const getSpotifyWidgetDataSource = metadata => metadata?.widgets?.spotify?.widgetDataSource

export const getSteamWidgetDataSource = metadata => metadata?.widgets?.steam?.widgetDataSource

export const getDiscogsWidgetDataSource = metadata => metadata?.widgets?.discogs?.widgetDataSource

export const getSubhead = metadata => metadata?.subhead

export const getTitle = metadata => metadata?.title

export const getTitleTemplate = metadata => metadata?.titleTemplate

export const getTwitterUsername = metadata => metadata?.widgets?.twitter?.username
