/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Card } from '@theme-ui/components'
import { Link } from 'gatsby'
import Category from '../../category'

export default ({ banner, category, date, excerpt, link, title, horizontal = false, isRecap = false }) => {
  return (
    <Link
      sx={{
        color: 'var(--theme-ui-colors-panel-text)',
        textDecoration: 'none'
      }}
      to={link}
      onClick={() => {
        // Ensure page scrolls to top when navigating
        window.scrollTo(0, 0)
      }}
    >
      <Card
        variant='PostCard'
        sx={{
          display: 'flex',
          flexDirection: horizontal ? 'row' : 'column',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }}
      >
        <div
          className='card-content'
          sx={{
            display: 'flex',
            flexDirection: horizontal ? 'row' : 'column',
            width: '100%'
          }}
        >
          {banner && (
            <div className='card-media' sx={{ flexShrink: 0, mb: isRecap ? '0 !important' : 2 }}>
              <div
                sx={{
                  backgroundImage: `url(${banner})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '8px',
                  width: horizontal ? '120px' : '100%',
                  height: horizontal ? '120px' : 'auto',
                  aspectRatio: horizontal ? '1 / 1' : '1.9 / 1',
                  transition: 'all 2.5s ease'
                }}
                title={isRecap ? title : undefined}
                role='img'
                aria-label={isRecap ? title : undefined}
              />
            </div>
          )}

          {!isRecap && (
            <div sx={{ flex: 1, ml: horizontal && banner ? 3 : 0 }}>
              {category && <Category type={category} sx={{ mt: horizontal ? 0 : 1 }} />}

              <Themed.h3 sx={{ mt: horizontal ? 1 : 2, fontFamily: 'serif', fontSize: horizontal ? 2 : 3 }}>
                {title}
              </Themed.h3>

              <time
                className='created'
                sx={{
                  color: 'textMuted',
                  fontFamily: 'sans',
                  fontSize: 1
                }}
              >
                {date}
              </time>

              {excerpt && (
                <Themed.p
                  className='description'
                  sx={{
                    mt: 2,
                    mb: 0,
                    fontSize: 1
                  }}
                >
                  {excerpt}
                </Themed.p>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
