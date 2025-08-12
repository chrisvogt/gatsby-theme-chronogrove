/** @jsx jsx */
import { jsx } from 'theme-ui'

import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

import fetchDataSource from '../../../actions/fetchDataSource'
import { getFlickrUsername, getFlickrWidgetDataSource } from '../../../selectors/metadata'
import { SUCCESS, FAILURE, getFlickrWidget } from '../../../reducers/widgets'
import useSiteMetadata from '../../../hooks/use-site-metadata'

import CallToAction from '../call-to-action'
import ProfileMetricsBadge from '../profile-metrics-badge'
import Widget from '../widget'
import WidgetHeader from '../widget-header'
import WidgetCarousel from '../widget-carousel'
import { faFlickr } from '@fortawesome/free-brands-svg-icons'

import FlickrWidgetItem from './flickr-widget-item'

const ITEMS_PER_PAGE = 8

const getPhotos = state => getFlickrWidget(state).data?.collections?.photos
const getHasFatalError = state => getFlickrWidget(state).state === FAILURE
const getIsLoading = state => getFlickrWidget(state).state !== SUCCESS
const getMetrics = state => getFlickrWidget(state).data?.metrics

export default () => {
  const dispatch = useDispatch()
  const lightGalleryRef = useRef(null)

  const metadata = useSiteMetadata()
  const flickrUsername = getFlickrUsername(metadata)
  const flickrDataSource = getFlickrWidgetDataSource(metadata)

  const hasFatalError = useSelector(getHasFatalError)
  const isLoading = useSelector(getIsLoading)
  const photos = useSelector(getPhotos)
  const metrics = useSelector(getMetrics)

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
    if (isLoading) {
      dispatch(fetchDataSource('flickr', flickrDataSource))
    }
  }, [dispatch, flickrDataSource, isLoading])

  useEffect(() => {
    if (!isLoading) {
      VanillaTilt.init(document.querySelectorAll('.flickr-item-button'), {
        perspective: 1500,
        reverse: true,
        scale: 1.05,
        speed: 200
      })
    }
  }, [isLoading])

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

  const renderFlickrItem = (photo, idx) => (
    <FlickrWidgetItem key={photo.id || idx} photo={photo} index={idx} handleClick={() => openLightbox(idx)} />
  )

  return (
    <Widget id='flickr' hasFatalError={hasFatalError}>
      <WidgetHeader aside={callToAction} icon={faFlickr}>
        Flickr
      </WidgetHeader>

      <ProfileMetricsBadge metrics={metrics} isLoading={isLoading} />

      <div className='gallery'>
        <WidgetCarousel
          items={photos || []}
          isLoading={isLoading}
          itemsPerPage={ITEMS_PER_PAGE}
          renderItem={renderFlickrItem}
          gridTemplateColumns={['repeat(2, 1fr)', 'repeat(3, 1fr)', '', 'repeat(4, 1fr)']}
          gridGap={[3, 3, 3, 4]}
        />
      </div>

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
