/** @jsx jsx */
import { jsx } from 'theme-ui'

import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import lgAutoplay from 'lightgallery/plugins/autoplay'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgVideo from 'lightgallery/plugins/video'
import lgZoom from 'lightgallery/plugins/zoom'
import LightGallery from 'lightgallery/react'
import VanillaTilt from 'vanilla-tilt'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-video.css'
import 'lightgallery/css/lg-autoplay.css'

import fetchDataSource from '../../../actions/fetchDataSource'
import { getInstagramWidgetDataSource } from '../../../selectors/metadata'
import {
  getMedia,
  getMetrics,
  getProfileDisplayName,
  getProfileURL,
  getHasFatalError,
  getIsLoading
} from '../../../selectors/instagram'
import useSiteMetadata from '../../../hooks/use-site-metadata'

import CallToAction from '../call-to-action'
import ProfileMetricsBadge from '../profile-metrics-badge'
import Widget from '../widget'
import WidgetHeader from '../widget-header'
import WidgetItem from './instagram-widget-item'
import WidgetCarousel from '../widget-carousel'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'

const ITEMS_PER_PAGE = 8

export default () => {
  const dispatch = useDispatch()

  const metadata = useSiteMetadata()
  const instagramDataSource = getInstagramWidgetDataSource(metadata)

  const hasFatalError = useSelector(getHasFatalError)
  const isLoading = useSelector(getIsLoading)
  const media = useSelector(getMedia)
  const metrics = useSelector(getMetrics)
  const profileDisplayName = useSelector(getProfileDisplayName)
  const profileURL = useSelector(getProfileURL)

  const lightGalleryRef = useRef(null)

  useEffect(() => {
    if (isLoading) {
      dispatch(fetchDataSource('instagram', instagramDataSource))
    }
  }, [dispatch, instagramDataSource, isLoading])

  useEffect(() => {
    if (!isLoading) {
      VanillaTilt.init(document.querySelectorAll('.instagram-item-button'), {
        perspective: 1500,
        reverse: true,
        scale: 1.05,
        speed: 200
      })
    }
  }, [isLoading])

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

  const renderInstagramItem = (post, idx) => (
    <WidgetItem key={post.id || idx} handleClick={() => openLightbox(idx)} index={idx} post={post} />
  )

  return (
    <Widget id='instagram' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faInstagram}>
        Instagram
      </WidgetHeader>

      <ProfileMetricsBadge metrics={metrics} isLoading={isLoading} />

      <div className='gallery'>
        <WidgetCarousel
          items={media || []}
          isLoading={isLoading}
          itemsPerPage={ITEMS_PER_PAGE}
          renderItem={renderInstagramItem}
          gridTemplateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)', '', 'repeat(4, 1fr)']}
          gridGap={[3, 3, 3, 4]}
        />
      </div>

      {media?.length && (
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
