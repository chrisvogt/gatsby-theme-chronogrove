import { actionCardPinnedLayoutSx } from './action-card-layout.js'

describe('actionCardPinnedLayoutSx', () => {
  it('exports a Theme UI sx object for action-card hover layout', () => {
    expect(actionCardPinnedLayoutSx).toMatchObject({
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease-in-out'
    })
    expect(actionCardPinnedLayoutSx['&:hover']).toEqual({ transform: 'translateY(-4px)' })
  })
})
