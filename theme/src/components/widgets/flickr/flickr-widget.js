/** @jsx jsx */
import { jsx } from 'theme-ui'

import { Grid } from '@theme-ui/components'
import { RectShape } from 'react-placeholder/lib/placeholders'
import { useState, useEffect, useCallback, useRef } from 'react'
import ReactPlaceholder from 'react-placeholder'
import VanillaTilt from 'vanilla-tilt'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import lgZoom from 'lightgallery/plugins/zoom'
import LightGallery from 'lightgallery/react'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-video.css'
import 'lightgallery/css/lg-autoplay.css'

import { getFlickrUsername, getFlickrWidgetDataSource } from '../../../selectors/metadata'
import useSiteMetadata from '../../../hooks/use-site-metadata'
import useWidgetData from '../../../hooks/use-widget-data'

import ActionButton from '../../action-button'
import CallToAction from '../call-to-action'
import ProfileMetricsBadge from '../profile-metrics-badge'
import Widget from '../widget'
import WidgetHeader from '../widget-header'
import { faFlickr } from '@fortawesome/free-brands-svg-icons'

import FlickrWidgetItem from './flickr-widget-item'

const MAX_IMAGES = {
  default: 8,
  showMore: 16
}

export default () => {
  const lightGalleryRef = useRef(null)

  const metadata = useSiteMetadata()
  const flickrUsername = getFlickrUsername(metadata)
  const flickrDataSource = getFlickrWidgetDataSource(metadata)

  const { data, isLoading, hasFatalError } = useWidgetData('flickr', flickrDataSource)

  // Extract data from the query result
  const photos = data?.collections?.photos
  const metrics = data?.metrics

  const [isShowingMore, setIsShowingMore] = useState(false)

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

  useEffect(() => {
    if (isShowingMore || !isLoading) {
      VanillaTilt.init(document.querySelectorAll('.flickr-item-button'), {
        perspective: 1500,
        reverse: true,
        scale: 1.05,
        speed: 200
      })
    }
  }, [isLoading, isShowingMore])

  const callToAction = (
    <CallToAction
      title={`${flickrUsername} on Flickr`}
      url={`https://www.flickr.com/photos/${flickrUsername}`}
      isLoading={isLoading}
    >
      Visit Profile
      <span className='read-more-icon'>&rarr;</span>
    </CallToAction>
  )

  const countItemsToRender = isShowingMore ? MAX_IMAGES.showMore : MAX_IMAGES.default

  return (
    <Widget id='flickr' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faFlickr}>
        Flickr
      </WidgetHeader>

      <ProfileMetricsBadge metrics={metrics} isLoading={isLoading} />

      <div className='gallery'>
        <Grid
          sx={{
            gridGap: [3, 3, 3, 4],
            gridTemplateColumns: ['repeat(2, 1fr)', 'repeat(3, 1fr)', '', 'repeat(4, 1fr)']
          }}
        >
          {(isLoading ? Array(countItemsToRender).fill({}) : photos || [])
            .slice(0, countItemsToRender)
            .map((photo, idx) => (
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
                      showLoadingAnimation
                    />
                  </div>
                }
                key={photo.id || idx}
                ready={!isLoading}
              >
                <FlickrWidgetItem photo={photo} index={idx} handleClick={() => openLightbox(idx)} />
              </ReactPlaceholder>
            ))}
        </Grid>
      </div>

      {!isLoading && (
        <div sx={{ my: 4, textAlign: 'center' }}>
          <ActionButton size='large' onClick={() => setIsShowingMore(!isShowingMore)}>
            {isShowingMore ? 'Show Less' : 'Show More'}
          </ActionButton>
        </div>
      )}

      {photos?.length && (
        <LightGallery
          onInit={ref => {
            lightGalleryRef.current = ref.instance
          }}
          plugins={[lgThumbnail, lgZoom, lgVideo, lgAutoplay]}
          licenseKey={process.env.GATSBY_LIGHT_GALLERY_LICENSE_KEY}
          download={false}
          dynamic
          dynamicEl={photos.map(photo => ({
            thumb: photo.thumbnailUrl,
            subHtml: photo.title || '',
            src: photo.largeUrl
          }))}
          speed={500}
        />
      )}
    </Widget>
  )
}
