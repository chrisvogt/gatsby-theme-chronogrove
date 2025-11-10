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
        display: 'flex',
        color: 'var(--theme-ui-colors-panel-text)',
        textDecoration: 'none'
      }}
      to={link}
    >
      <Card
        variant='actionCard'
        sx={{
          height: '100%',
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
                  width: horizontal ? ['100%', '200px'] : '100%',
                  height: horizontal ? ['auto', '105px'] : 'auto',
                  aspectRatio: '1.9 / 1',
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
              {category && (
                <div sx={{ mb: 3 }}>
                  <Category type={category} />
                </div>
              )}

              <Themed.h3
                sx={{
                  mt: 0,
                  mb: 2,
                  fontFamily: 'serif',
                  fontSize: horizontal ? 2 : 3,
                  lineHeight: 1.3
                }}
              >
                {title}
              </Themed.h3>

              <time
                className='created'
                sx={{
                  display: 'block',
                  color: 'textMuted',
                  fontFamily: 'sans',
                  fontSize: 0,
                  mb: excerpt ? 3 : 0
                }}
              >
                {date}
              </time>

              {excerpt && (
                <p
                  className='description'
                  sx={{
                    mt: 0,
                    mb: 0,
                    fontSize: [1, 2],
                    lineHeight: 1.6,
                    color: 'text'
                  }}
                >
                  {excerpt}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
