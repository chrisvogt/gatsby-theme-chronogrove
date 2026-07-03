/**
 * Applies a hairline divider between direct children — for panels that show a list of
 * rows (e.g. GitHub pinned items) instead of one card per row.
 */
export const dividedRowListSx = {
  '& > *:not(:last-of-type)': {
    borderBottom: '1px solid',
    borderBottomColor: 'divider'
  }
}
