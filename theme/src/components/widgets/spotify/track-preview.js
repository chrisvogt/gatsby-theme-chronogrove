/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'

const TrackPreview = ({ link, name, thumbnailURL }) => (
  <Themed.a
    href={link}
    title={name}
    sx={{
      variant: 'styles.TrackPreview'
    }}
  >
    <img
      alt='album cover'
      loading='lazy'
      crossOrigin='anonymous'
      src={thumbnailURL}
      sx={{
        objectFit: 'cover',
        width: '100%'
      }}
    />
  </Themed.a>
)

export default TrackPreview
