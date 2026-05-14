import SteamWidget from './index'
import ActualSteamWidget from './steam-widget'

describe('Steam Widget Index', () => {
  it('exports the SteamWidget component', () => {
    expect(SteamWidget).toBe(ActualSteamWidget)
  })
})
