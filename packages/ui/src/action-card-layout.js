/**
 * Layout `sx` aligned with GitHub pinned cards — pair with `Card variant="actionCard"`.
 * @see packages/theme/src/components/widgets/github/pinned-item-card.js
 */
export const actionCardPinnedLayoutSx = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
}
