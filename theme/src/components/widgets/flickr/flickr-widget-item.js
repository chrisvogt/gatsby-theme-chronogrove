/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Box } from '@theme-ui/components'

const FlickrWidgetItem = ({ photo = {}, handleClick = () => {}, index }) => {
  const { title = '', thumbnailUrl = '' } = photo || {}

  return (
    <Box
      as='button'
      type='button'
      onClick={() => handleClick(index)}
      className='flickr-item-button'
      sx={{
        variant: 'styles.InstagramItem'
      }}
    >
      <Box
        as='img'
        crossOrigin='anonymous'
        className='flickr-item-image'
        loading='lazy'
        src={thumbnailUrl}
        height='280'
        width='280'
        alt={`Flickr photo: ${title}`}
        sx={{
          width: '100%',
          height: '100%',
          transition: 'all 1.5s ease',
          objectFit: 'cover'
        }}
      />
    </Box>
  )
}

export default FlickrWidgetItem
