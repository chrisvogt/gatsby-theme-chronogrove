import {
  getMedia,
  getMetrics,
  getProfileDisplayName,
  getProfileURL,
  getHasFatalError,
  getIsLoading
} from './instagram'

describe('Instagram selectors', () => {
  const mockState = {
    widgets: {
      instagram: {
        state: 'SUCCESS',
        data: {
          collections: {
            media: [
              {
                id: '123',
                caption: 'Test Caption',
                cdnMediaURL: 'https://cdn.example.com/images/test.jpg',
                mediaType: 'IMAGE'
              }
            ]
          },
          metrics: [
            { displayName: 'Followers', id: '1', value: 100 },
            { displayName: 'Following', id: '2', value: 50 }
          ],
          profile: {
            displayName: 'TestUser',
            profileURL: 'https://instagram.com/testuser'
          }
        }
      }
    }
  }

  const emptyState = {
    widgets: {
      instagram: {
        state: 'INIT',
        data: null
      }
    }
  }

  const errorState = {
    widgets: {
      instagram: {
        state: 'FAILURE',
        data: null,
        error: 'API Error'
      }
    }
  }

  describe('getMedia', () => {
    it('should return media array from state', () => {
      expect(getMedia(mockState)).toEqual([
        {
          id: '123',
          caption: 'Test Caption',
          cdnMediaURL: 'https://cdn.example.com/images/test.jpg',
          mediaType: 'IMAGE'
        }
      ])
    })

    it('should return empty array when no data', () => {
      expect(getMedia(emptyState)).toEqual([])
    })
  })

  describe('getMetrics', () => {
    it('should return metrics array from state', () => {
      expect(getMetrics(mockState)).toEqual([
        { displayName: 'Followers', id: '1', value: 100 },
        { displayName: 'Following', id: '2', value: 50 }
      ])
    })

    it('should return empty array when no data', () => {
      expect(getMetrics(emptyState)).toEqual([])
    })
  })

  describe('getProfileDisplayName', () => {
    it('should return profile display name from state', () => {
      expect(getProfileDisplayName(mockState)).toBe('TestUser')
    })

    it('should return undefined when no profile data', () => {
      expect(getProfileDisplayName(emptyState)).toBeUndefined()
    })
  })

  describe('getProfileURL', () => {
    it('should return profile URL from state', () => {
      expect(getProfileURL(mockState)).toBe('https://instagram.com/testuser')
    })

    it('should return undefined when no profile data', () => {
      expect(getProfileURL(emptyState)).toBeUndefined()
    })
  })

  describe('getHasFatalError', () => {
    it('should return true when state is FAILURE', () => {
      expect(getHasFatalError(errorState)).toBe(true)
    })

    it('should return false when state is not FAILURE', () => {
      expect(getHasFatalError(mockState)).toBe(false)
      expect(getHasFatalError(emptyState)).toBe(false)
    })
  })

  describe('getIsLoading', () => {
    it('should return true when state is not SUCCESS', () => {
      expect(getIsLoading(emptyState)).toBe(true)
      expect(getIsLoading(errorState)).toBe(true)
    })

    it('should return false when state is SUCCESS', () => {
      expect(getIsLoading(mockState)).toBe(false)
    })
  })
})
