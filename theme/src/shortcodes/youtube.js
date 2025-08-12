/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Themed } from '@theme-ui/mdx'

const YouTube = ({ title, url, sx = {} }) => (
  <Themed.div sx={{ variant: 'styles.VideoWrapper', ...sx }}>
    <iframe
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;'
      allowFullScreen
      className='VideoFrame'
      height='315'
      referrerPolicy='strict-origin-when-cross-origin'
      src={url}
      title={title || 'Video on YouTube'}
      width='560'
    ></iframe>
  </Themed.div>
)

export default YouTube
