/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'
import { Card } from '@theme-ui/components'
import { Link } from 'gatsby'
import Category from '../../category'
import ImageThumbnails from './image-thumbnails'

export default ({ banner, category, date, excerpt, link, title, horizontal = false, thumbnails = null }) => {
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
          {/* Show thumbnails above text for vertical cards (Recaps) */}
          {!horizontal && thumbnails && thumbnails.length > 0 && (
            <div className='card-thumbnails' sx={{ flexShrink: 0, mb: 2 }}>
              <ImageThumbnails images={thumbnails} maxImages={4} />
            </div>
          )}

          {/* Show banner for posts without thumbnails */}
          {banner && (!thumbnails || thumbnails.length === 0) && (
            <div className='card-media' sx={{ flexShrink: 0, mb: 2 }}>
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
              />
            </div>
          )}

          <div sx={{ flex: 1, ml: horizontal && banner && (!thumbnails || thumbnails.length === 0) ? 3 : 0 }}>
            {/* Show thumbnails inside text area for horizontal cards (Photography) */}
            {horizontal && thumbnails && thumbnails.length > 0 && (
              <div className='card-thumbnails' sx={{ mb: 2 }}>
                <ImageThumbnails images={thumbnails} maxImages={4} />
              </div>
            )}

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

            {date && (
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
            )}

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
        </div>
      </Card>
    </Link>
  )
}
