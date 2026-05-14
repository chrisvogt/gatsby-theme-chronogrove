/** @jsx jsx */
import { jsx } from 'theme-ui'
import { useId } from 'react'

const Book = ({ thumbnailURL, title }) => {
  const uniqueId = useId()
  return (
    <svg
      data-name='Book Preview'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 100 100'
      sx={{ variant: 'styles.Book' }}
    >
      <defs>
        <clipPath id={`clip-${uniqueId}`}>
          <polyline data-name='Book Cover' points='78.6 38.6 78.6 88.3 14.9 88.3 14.9 0 78.6 0 78.6 43.6' fill='none' />
        </clipPath>
      </defs>
      <title>{title}</title>
      <g fill='#1a202c' data-name='Book Sheets'>
        <path d='M78.6,90.9H12.3V0H78.6ZM14.9,88.3H76V2.6H14.9Z' />
        <rect x='85.1' y='9.1' width='2.61' height='46.2' />
        <polygon points='87.7 100 20.83 100 12.35 90.89 14.25 89.11 21.97 97.4 85.1 97.4 85.1 49 87.7 49 87.7 100' />
        <polygon points='80.06 92.36 18.8 92.36 18.8 92.04 79.74 92.04 79.74 3.4 80.06 3.4 80.06 92.36' />
        <polygon points='81.36 93.66 20.1 93.66 20.1 93.34 81.04 93.34 81.04 4.7 81.36 4.7 81.36 93.66' />
        <polygon points='82.66 94.96 21.4 94.96 21.4 94.64 82.34 94.64 82.34 6 82.66 6 82.66 94.96' />
        <polygon points='83.96 96.26 22.7 96.26 22.7 95.94 83.64 95.94 83.64 7.3 83.96 7.3 83.96 96.26' />
      </g>
      <polyline
        data-name='Image Wrapper'
        fill='#1a202c'
        points='77.3 39.9 77.3 89.6 13.6 89.6 13.6 1.3 77.3 1.3 77.3 44.9'
      />
      <g
        style={{
          clipPath: `url(#clip-${uniqueId})`
        }}
      >
        <image
          data-testid='book-preview-thumbnail'
          width='128'
          height='190'
          transform='translate(14.53 -3.68) scale(0.5)'
          xlinkHref={thumbnailURL}
        />
      </g>
    </svg>
  )
}

export default Book
