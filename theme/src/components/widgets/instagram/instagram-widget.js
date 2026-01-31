/** @jsx jsx */
import { jsx } from 'theme-ui'

import { Grid } from '@theme-ui/components'
import { RectShape } from 'react-placeholder/lib/placeholders'
import { useCallback, useState, useRef } from 'react'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import lgZoom from 'lightgallery/plugins/zoom'
import LightGallery from 'lightgallery/react'
import ReactPlaceholder from 'react-placeholder'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-video.css'
import 'lightgallery/css/lg-autoplay.css'

import { getInstagramWidgetDataSource } from '../../../selectors/metadata'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

import ActionButton from '../../action-button'
import CallToAction from '../call-to-action'
import ProfileMetricsBadge from '../profile-metrics-badge'
import Widget from '../widget'
import WidgetHeader from '../widget-header'
import WidgetItem from './instagram-widget-item'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'

const MAX_IMAGES = {
  default: 8,
  showMore: 16
}

export default () => {
  const metadata = useSiteMetadata()
  const instagramDataSource = getInstagramWidgetDataSource(metadata)

  const { data, isLoading, hasFatalError } = useWidgetData('instagram', instagramDataSource)

  // Extract data from the query result
  const media = data?.collections?.media
  const metrics = data?.metrics
  const profileDisplayName = data?.profile?.displayName
  const profileURL = data?.profile?.profileURL

  const [isShowingMore, setIsShowingMore] = useState(false)
  const lightGalleryRef = useRef(null)

  const openLightbox = useCallback(
    index => {
      const instance = lightGalleryRef.current
      if (instance) {
        instance.openGallery(index)
      } else {
        console.error('LightGallery instance is not initialized')
      }
    },
    [lightGalleryRef]
  )

  const callToAction = (
    <CallToAction
      title={`${profileDisplayName || 'Instagram'} on Instagram`}
      url={profileURL || `https://www.instagram.com/${metadata?.widgets?.instagram?.username || 'instagram'}`}
      isLoading={isLoading}
    >
      Visit Profile
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  const countItemsToRender = isShowingMore ? MAX_IMAGES.showMore : MAX_IMAGES.default

  return (
    <Widget id='instagram' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faInstagram}>
        Instagram
      </WidgetHeader>

      <ProfileMetricsBadge metrics={metrics} isLoading={isLoading} />

      <div className='gallery'>
        <Grid
          sx={{
            gridGap: [3, 3, 3, 4],
            gridTemplateColumns: ['repeat(2, 1fr)', 'repeat(3, 1fr)', '', 'repeat(4, 1fr)']
          }}
        >
          {(isLoading ? Array(countItemsToRender).fill({}) : media || [])
            .slice(0, countItemsToRender)
            .map((post, idx) => (
              <ReactPlaceholder
                customPlaceholder={
                  <div className='image-placeholder'>
                    <RectShape
                      color='#efefef'
                      sx={{
                        borderRadius: '8px',
                        boxShadow: 'md',
                        width: '100%',
                        paddingBottom: '100%'
                      }}
                    />
                  </div>
                }
                key={isLoading ? idx : post.id}
                ready={!isLoading}
                showLoadingAnimation
                type='rect'
              >
                <WidgetItem handleClick={() => openLightbox(idx)} index={idx} post={post} />
              </ReactPlaceholder>
            ))}
        </Grid>
      </div>

      {!isLoading && media?.length > MAX_IMAGES.default && (
        <div sx={{ my: 4, textAlign: 'center' }}>
          <ActionButton size='large' onClick={() => setIsShowingMore(!isShowingMore)}>
            {isShowingMore ? 'Show Less' : 'Show More'}
          </ActionButton>
        </div>
      )}

      {media?.length > 0 && (
        <LightGallery
          onInit={ref => {
            lightGalleryRef.current = ref.instance
          }}
          plugins={[lgThumbnail, lgZoom, lgVideo, lgAutoplay]}
          licenseKey={process.env.GATSBY_LIGHT_GALLERY_LICENSE_KEY}
          download={false}
          dynamic
          dynamicEl={media.map(post => ({
            thumb: `${post.cdnMediaURL}?auto=compress&auto=enhance&auto=format&fit=clip&w=100&h=100`,
            subHtml: post.caption || '',
            ...(post.mediaType !== 'VIDEO'
              ? { src: `${post.cdnMediaURL}?auto=compress&auto=enhance&auto=format` }
              : {}),
            video:
              post.mediaType === 'VIDEO' && post.mediaURL
                ? {
                    source: [
                      {
                        src: post.mediaURL,
                        type: 'video/mp4'
                      }
                    ],
                    attributes: {
                      controls: true // Enable controls for the video
                    }
                  }
                : undefined
          }))}
          autoplayVideoOnSlide={true} // Add this option
          speed={500}
        />
      )}
    </Widget>
  )
}
