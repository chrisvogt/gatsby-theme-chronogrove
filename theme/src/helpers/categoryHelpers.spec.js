import { categoryMappings, toTitleCase, getCategoryDisplayName, getCategoryGroup } from './categoryHelpers'

describe('categoryHelpers', () => {
  describe('categoryMappings', () => {
    it('contains expected category mappings', () => {
      expect(categoryMappings).toEqual({
        'photography/travel': 'Travel Photography',
        'photography/events': 'Event Photography',
        'music/piano-covers': 'Piano Covers',
        'videos/bike-rides': 'Cycling Videos'
      })
    })
  })

  describe('toTitleCase', () => {
    it('converts hyphenated words to title case', () => {
      expect(toTitleCase('blog-post')).toBe('Blog Post')
    })

    it('converts slash-separated words to title case', () => {
      expect(toTitleCase('blog/tech')).toBe('Blog Tech')
    })

    it('handles mixed case input', () => {
      expect(toTitleCase('BLOG/TECH')).toBe('Blog Tech')
    })

    it('handles single word categories', () => {
      expect(toTitleCase('blog')).toBe('Blog')
    })

    it('handles multiple separators', () => {
      expect(toTitleCase('blog/tech-post')).toBe('Blog Tech Post')
    })
  })

  describe('getCategoryDisplayName', () => {
    it('returns mapped name for known categories', () => {
      expect(getCategoryDisplayName('photography/travel')).toBe('Travel Photography')
      expect(getCategoryDisplayName('music/piano-covers')).toBe('Piano Covers')
    })

    it('returns title case for unknown categories', () => {
      expect(getCategoryDisplayName('blog-post')).toBe('Blog Post')
      expect(getCategoryDisplayName('technology')).toBe('Technology')
    })

    it('returns empty string for null or undefined', () => {
      expect(getCategoryDisplayName(null)).toBe('')
      expect(getCategoryDisplayName(undefined)).toBe('')
    })
  })

  describe('getCategoryGroup', () => {
    it('returns "personal" for personal category', () => {
      expect(getCategoryGroup('personal')).toBe('personal')
    })

    it('returns "personal" for posts with "recap" in title', () => {
      expect(getCategoryGroup('other', 'My 2023 Recap')).toBe('personal')
      expect(getCategoryGroup('technology', 'Year-End Recap')).toBe('personal')
    })

    it('returns "music" for music categories', () => {
      expect(getCategoryGroup('music')).toBe('music')
      expect(getCategoryGroup('music/piano-covers')).toBe('music')
    })

    it('returns "photography" for photography categories', () => {
      expect(getCategoryGroup('photography')).toBe('photography')
      expect(getCategoryGroup('photography/travel')).toBe('photography')
    })

    it('returns "technology" for technology categories', () => {
      expect(getCategoryGroup('technology')).toBe('technology')
      expect(getCategoryGroup('tech-tips')).toBe('technology')
    })

    it('returns "other" for unknown categories', () => {
      expect(getCategoryGroup('blog')).toBe('other')
      expect(getCategoryGroup('random')).toBe('other')
    })

    it('returns "other" for null or undefined category', () => {
      expect(getCategoryGroup(null)).toBe('other')
      expect(getCategoryGroup(undefined)).toBe('other')
    })

    it('returns "other" when both category and title are missing', () => {
      expect(getCategoryGroup()).toBe('other')
      expect(getCategoryGroup(null, null)).toBe('other')
      expect(getCategoryGroup(undefined, undefined)).toBe('other')
    })

    it('uses "other" as default category when category is empty string', () => {
      expect(getCategoryGroup('')).toBe('other')
      expect(getCategoryGroup('', 'Some Post')).toBe('other')
    })
  })
})
