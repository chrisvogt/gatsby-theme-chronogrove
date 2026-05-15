/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import PropTypes from 'prop-types'
import { nullableString } from '@chronogrove/ui/prop-types-helpers'
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

TrackPreview.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  thumbnailURL: nullableString
}

export default TrackPreview
