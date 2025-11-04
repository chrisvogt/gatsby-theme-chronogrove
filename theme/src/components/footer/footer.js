/** @jsx jsx */
import { Container, jsx } from 'theme-ui'
import { Link } from 'gatsby'
import { Link as ThemedLink } from 'theme-ui'

import Profiles from './profiles'

import { getFooterText } from '../../selectors/metadata'
import useSiteMetadata from '../../hooks/use-site-metadata'

export default () => {
  const metadata = useSiteMetadata()
  const footerText = getFooterText(metadata)

  return (
    <footer role='contentinfo' id='footer' sx={{ variant: 'styles.PageFooter' }}>
      <Container sx={{ textAlign: 'center' }}>
        <div sx={{ mb: 3, py: [2, 3] }}>
          <Profiles />

          <div sx={{ mt: [0, 1] }}>
            {footerText ? <div>{footerText}</div> : null}
            <span>
              <ThemedLink href='/rss.xml' sx={{ textDecoration: 'underline' /* synced with Gatsby Link */ }}>
                Subscribe via RSS
              </ThemedLink>
            </span>
            {' | '}
            <span>
              <Link to='/privacy'>Privacy Policy</Link>
            </span>
            {' | '}
            <span>
              <Link to='https://github.com/chrisvogt/gatsby-theme-chronogrove'>View Source</Link>
            </span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
