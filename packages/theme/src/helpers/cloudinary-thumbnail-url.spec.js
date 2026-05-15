import {
  isCloudinaryUrl,
  optimizeCloudinaryFillDimensionsSrc,
  optimizeCloudinaryThumbnailSrc
} from './cloudinary-thumbnail-url'

describe('cloudinaryThumbnailUrl', () => {
  const cloudinaryImages = [
    'https://res.cloudinary.com/chrisvogt/image/upload/v1234567890/folder/image1.jpg',
    'https://res.cloudinary.com/chrisvogt/image/upload/v1234567890/folder/image2.jpg'
  ]

  const cloudinaryWithTransforms = [
    'https://res.cloudinary.com/chrisvogt/image/upload/f_auto/v1770085939/galleries/image1.jpg',
    'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1750231638/galleries/image2.jpg'
  ]

  it('isCloudinaryUrl is true only for res.cloudinary.com hostnames', () => {
    expect(isCloudinaryUrl('https://res.cloudinary.com/foo/image/upload/v1/x.jpg')).toBe(true)
    expect(isCloudinaryUrl('https://example.com/image.jpg')).toBe(false)
  })

  it('optimizeCloudinaryThumbnailSrc leaves falsy unchanged', () => {
    expect(optimizeCloudinaryThumbnailSrc(null)).toBe(null)
    expect(optimizeCloudinaryThumbnailSrc(undefined)).toBe(undefined)
    expect(optimizeCloudinaryThumbnailSrc('')).toBe('')
  })

  it('optimizeCloudinaryThumbnailSrc revises Cloudinary delivery URLs', () => {
    const out = optimizeCloudinaryThumbnailSrc(cloudinaryImages[0])
    expect(out).toContain('/upload/')
    expect(out).toContain('w_128')
    expect(out).toContain('v1234567890')
  })

  it('replaces existing Cloudinary transformations with thumbnail transforms', () => {
    const out0 = optimizeCloudinaryThumbnailSrc(cloudinaryWithTransforms[0])
    expect(out0).toMatchInlineSnapshot(
      '"https://res.cloudinary.com/chrisvogt/image/upload/w_128,h_128,c_fill,f_auto,q_auto/v1770085939/galleries/image1.jpg"'
    )
    const out1 = optimizeCloudinaryThumbnailSrc(cloudinaryWithTransforms[1])
    expect(out1).toMatchInlineSnapshot(
      '"https://res.cloudinary.com/chrisvogt/image/upload/w_128,h_128,c_fill,f_auto,q_auto/v1750231638/galleries/image2.jpg"'
    )
  })

  it('does not transform URLs that spoof Cloudinary hostname', () => {
    const maliciousUrls = [
      'https://evil.com/?redirect=res.cloudinary.com/image/upload/v123/image.jpg',
      'https://evil.com/res.cloudinary.com/fake/upload/v123/image.jpg',
      'https://attacker.com/path?url=https://res.cloudinary.com/image/upload/v123/img.jpg'
    ]
    maliciousUrls.forEach(url => {
      expect(optimizeCloudinaryThumbnailSrc(url)).toBe(url)
    })
  })

  it('returns non-Cloudinary URLs unchanged', () => {
    expect(optimizeCloudinaryThumbnailSrc('https://example.com/x.jpg')).toBe('https://example.com/x.jpg')
    expect(optimizeCloudinaryThumbnailSrc('not-a-url')).toBe('not-a-url')
  })

  it('returns Cloudinary URLs without /upload/ unchanged', () => {
    const u = 'https://res.cloudinary.com/demo/image/simple.jpg'
    expect(optimizeCloudinaryThumbnailSrc(u)).toBe(u)
  })

  describe('optimizeCloudinaryFillDimensionsSrc', () => {
    it('applies portrait hero dimensions', () => {
      const out = optimizeCloudinaryFillDimensionsSrc(cloudinaryImages[0], 780, Math.round((780 * 4) / 3))
      expect(out).toMatchInlineSnapshot(
        '"https://res.cloudinary.com/chrisvogt/image/upload/w_780,h_1040,c_fill,f_auto,q_auto/v1234567890/folder/image1.jpg"'
      )
    })

    it('replaces prior transforms like thumb helper does', () => {
      expect(optimizeCloudinaryFillDimensionsSrc(cloudinaryWithTransforms[1], 400, 500)).toMatchInlineSnapshot(
        '"https://res.cloudinary.com/chrisvogt/image/upload/w_400,h_500,c_fill,f_auto,q_auto/v1750231638/galleries/image2.jpg"'
      )
    })

    it('does not rewrite spoof URLs', () => {
      const maliciousUrls = [
        'https://evil.com/?redirect=res.cloudinary.com/image/upload/v123/image.jpg',
        'https://attacker.com/path?url=https://res.cloudinary.com/image/upload/v123/img.jpg'
      ]
      maliciousUrls.forEach(url => {
        expect(optimizeCloudinaryFillDimensionsSrc(url, 780, 1040)).toBe(url)
      })
    })

    it('returns unchanged when dimensions are non-finite', () => {
      expect(optimizeCloudinaryFillDimensionsSrc(cloudinaryImages[0], Number.NaN, 1040)).toBe(cloudinaryImages[0])
    })
  })
})
