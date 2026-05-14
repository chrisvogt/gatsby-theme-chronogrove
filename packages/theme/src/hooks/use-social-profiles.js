import { useStaticQuery, graphql } from 'gatsby'

const useSocialProfiles = () => {
  const { site: { siteMetadata: { socialProfiles = [] } = {} } = {} } = useStaticQuery(graphql`
    query SocialProfiles {
      site {
        siteMetadata {
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
        }
      }
    }
  `)

  return socialProfiles.filter(Boolean)
}

export default useSocialProfiles
