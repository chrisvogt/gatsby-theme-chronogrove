import React from 'react'
import useSiteMetadata from '../hooks/use-site-metadata.js'

const HCard = () => {
  const { headline, baseURL, description, hCard } = useSiteMetadata()

  return (
    <div className='h-card' style={{ display: 'none' }}>
      <a className='p-name u-url u-uid' href={baseURL} rel='me'>
        {headline}
      </a>
      {hCard?.photoURL && <img className='u-photo' src={hCard.photoURL} alt={headline} width='1440' height='810' />}
      <p className='p-note'>{description}</p>
      {hCard?.email && (
        <a className='u-email' href={`mailto:${hCard.email}`}>
          {hCard.email}
        </a>
      )}
      {hCard?.givenName && <p className='p-given-name'>{hCard.givenName}</p>}
      {hCard?.familyName && <p className='p-family-name'>{hCard.familyName}</p>}
      {hCard?.locality && <p className='p-locality'>{hCard.locality}</p>}
      {hCard?.region && (
        <abbr className='p-region' title={hCard.region}>
          {hCard.region}
        </abbr>
      )}
      {hCard?.countryName && <div className='p-country-name'>{hCard.countryName}</div>}
      {hCard?.category && <div className='p-category'>{hCard.category}</div>}
    </div>
  )
}

export default HCard
