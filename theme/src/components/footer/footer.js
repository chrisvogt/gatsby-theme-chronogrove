/** @jsx jsx */
import { Container, jsx, Link as ThemedLink } from 'theme-ui'
import { Link } from 'gatsby'

import Profiles from './profiles'

import useNavigationData from '../../hooks/use-navigation-data'
import useSiteMetadata from '../../hooks/use-site-metadata'
import { getFooterText } from '../../selectors/metadata'
import { getFooterLinkItems, shouldUseNativeNavigationLink } from '../../selectors/navigation'

const footerLinkSx = { textDecoration: 'underline' }

export default () => {
  const metadata = useSiteMetadata()
  const navigation = useNavigationData()
  const footerText = getFooterText(metadata)
  const footerLinks = getFooterLinkItems(navigation)

  return (
    <footer role='contentinfo' id='footer' sx={{ variant: 'styles.PageFooter' }}>
      <Container sx={{ textAlign: 'center' }}>
        <div sx={{ mb: 3, py: [2, 3] }}>
          <Profiles />

          {footerText || footerLinks.length > 0 ? (
            <div sx={{ mt: [0, 1] }}>
              {footerText ? <div>{footerText}</div> : null}
              {footerLinks.map((item, i) => (
                <span key={item.slug}>
                  {i > 0 ? ' | ' : null}
                  {shouldUseNativeNavigationLink(item.path, item) ? (
                    <ThemedLink href={item.path} title={item.title} sx={footerLinkSx}>
                      {item.text}
                    </ThemedLink>
                  ) : (
                    <Link to={item.path} title={item.title} sx={footerLinkSx}>
                      {item.text}
                    </Link>
                  )}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </footer>
  )
}
