/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'

const TrackPreview = ({ link, name, thumbnailURL }) => (
  <Themed.a
    href={link}
    title={name}
    sx={{
      variant: 'styles.TrackPreview'
    }}
  >
    <Box
      alt='album cover'
      as='img'
      crossOrigin='anonymous'
      loading='lazy'
      src={thumbnailURL}
      sx={{
        objectFit: 'cover',
        width: '100%'
      }}
    />
  </Themed.a>
)

export default TrackPreview
