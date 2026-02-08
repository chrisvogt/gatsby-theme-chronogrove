import { useStaticQuery, graphql } from 'gatsby'

const useSiteMetadata = () => {
  const { site: { siteMetadata } = {} } = useStaticQuery(graphql`
    query SiteMetadata {
      site {
        siteMetadata {
          baseURL
          siteUrl
          description
          footerText
          headline
          hCard {
            email
            givenName
            familyName
            locality
            region
            countryName
            category
            photoURL
          }
          imageURL
          languageCode
          social {
            twitterUsername
          }
          socialProfiles {
            displayName
            href
            slug
            icon {
              class
              name
              reactIcon
              set
            }
          }
          subhead
          title
          titleTemplate
          widgets {
            flickr {
              username
              widgetDataSource
            }
            github {
              username
              widgetDataSource
            }
            goodreads {
              username
              widgetDataSource
            }
            instagram {
              username
              widgetDataSource
            }
            spotify {
              username
              widgetDataSource
            }
            steam {
              username
              widgetDataSource
            }
            discogs {
              username
              widgetDataSource
            }
          }
          webmentionUrl
        }
      }
    }
  `)

  return siteMetadata
}

export default useSiteMetadata
