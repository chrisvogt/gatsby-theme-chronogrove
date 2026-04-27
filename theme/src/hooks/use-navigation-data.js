import { useStaticQuery, graphql } from 'gatsby'

const useNavigationData = () => {
  const { site: { siteMetadata: { navigation } = {} } = {} } = useStaticQuery(graphql`
    query NavigationData {
      site {
        siteMetadata {
          navigation {
            header {
              home {
                path
                slug
                text
                title
                nativeAnchor
              }
              left {
                path
                slug
                text
                title
                nativeAnchor
              }
            }
            footer {
              path
              slug
              text
              title
              nativeAnchor
            }
          }
        }
      }
    }
  `)

  if (!navigation) {
    return {
      header: { left: [], home: [] },
      footer: []
    }
  }

  return {
    header: {
      left: navigation.header?.left || [],
      home: navigation.header?.home || []
    },
    footer: Array.isArray(navigation.footer) ? navigation.footer : []
  }
}

export default useNavigationData
