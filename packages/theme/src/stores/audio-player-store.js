import { create } from 'zustand'

/** @typedef {'soundcloud' | 'spotify' | null} AudioProvider */

export const initialAudioPlayerState = {
  soundcloudId: null,
  spotifyURL: null,
  isVisible: false,
  /** @type {AudioProvider} */
  provider: null
}

/**
 * Global client state for the fixed bottom audio player (SoundCloud / Spotify embeds).
 * Widget data uses TanStack Query (`useWidgetData`); this store is UI-only.
 */
export const useAudioPlayerStore = create(set => ({
  ...initialAudioPlayerState,

  setSoundcloudTrack: soundcloudId =>
    set({
      soundcloudId,
      spotifyURL: null,
      isVisible: true,
      provider: 'soundcloud'
    }),

  setSpotifyTrack: spotifyURL =>
    set({
      spotifyURL,
      soundcloudId: null,
      isVisible: true,
      provider: 'spotify'
    }),

  hidePlayer: () => set({ isVisible: false }),

  clearTrack: () => set(initialAudioPlayerState)
}))

/**
 * Reset store state (for tests and Storybook-style isolation).
 * @param {Partial<typeof initialAudioPlayerState>} [partial] - merged onto defaults when provided
 */
export function resetAudioPlayerStore(partial) {
  useAudioPlayerStore.setState(partial ? { ...initialAudioPlayerState, ...partial } : initialAudioPlayerState)
}
