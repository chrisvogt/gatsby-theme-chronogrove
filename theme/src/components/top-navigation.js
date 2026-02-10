/** @jsx jsx */
import { jsx, Container } from 'theme-ui'
import { Link } from 'gatsby'
import { Themed } from '@theme-ui/mdx'

import ColorToggle from '../components/color-toggle'
import { getHeaderLeftItems } from '../selectors/navigation'
import { getTitle } from '../selectors/metadata'
import useNavigationData from '../hooks/use-navigation-data'
import useSiteMetadata from '../hooks/use-site-metadata'

/**
 * Header Navigation
 *
 * Top navigation component for the page.
 */
const TopNavigation = () => {
  const metadata = useSiteMetadata()

  const navigation = useNavigationData()
  const menuItems = getHeaderLeftItems(navigation)
  const title = getTitle(metadata)

  return (
    <Themed.div
      sx={{
        variant: 'styles.TopNavigation',
        minHeight: '64px',
        color: 'text'
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: ['column', '', 'row'],
          alignItems: ['flex-start', '', 'center'],
          justifyContent: 'space-between',
          py: 3
        }}
      >
        {/* Left side: Brand link and color toggle */}
        <Themed.div
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: [2, '', 0],
            width: ['100%', '', 'auto']
          }}
        >
          <Link
            to='/'
            sx={{
              variant: 'styles.a',
              color: 'text',
              display: 'inline',
              fontFamily: 'heading',
              fontSize: [2, 3],
              fontWeight: 'bold',
              letterSpacing: '1.1px',
              marginRight: 2,
              textDecoration: 'none'
            }}
          >
            {title}
          </Link>

          <Themed.div sx={{ display: 'flex', alignItems: 'center' }}>
            <ColorToggle />
          </Themed.div>
        </Themed.div>

        {/* Right side: Menu items */}
        <Themed.div
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: ['flex-start', '', 'flex-end'],
            width: ['100%', '', 'auto']
          }}
        >
          <nav role='navigation'>
            {menuItems.map(({ slug, path, title, text }) => (
              <Link
                key={slug}
                sx={{
                  fontSize: 2,
                  variant: 'styles.a',
                  color: 'text',
                  mr: 3,
                  mb: [1, '', 0]
                }}
                title={title}
                to={path}
              >
                {text}
              </Link>
            ))}
          </nav>
        </Themed.div>
      </Container>
    </Themed.div>
  )
}

export default TopNavigation
