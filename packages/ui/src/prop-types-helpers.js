import PropTypes from 'prop-types'

/**
 * Explicit `null` as a PropTypes value (e.g. Zustand initial state, loading placeholders).
 * Prefer `nullable*` helpers below; export this for one-off `oneOfType` compositions.
 */
export const nullLiteral = PropTypes.oneOf([null])

export const nullableString = PropTypes.oneOfType([PropTypes.string, nullLiteral])
export const nullableNumber = PropTypes.oneOfType([PropTypes.number, nullLiteral])
export const nullableObject = PropTypes.oneOfType([PropTypes.object, nullLiteral])

/** MDX / frontmatter fields that may be string, number, or null. */
export const mdxMediaScalar = PropTypes.oneOfType([PropTypes.string, PropTypes.number, nullLiteral])

export const nullableStringArray = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), nullLiteral])

/** Widget metric rows: array of objects or `null` while idle / loading. */
export const nullableObjectArray = PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), nullLiteral])

const crossDomainColorModeShape = PropTypes.shape({
  registrableDomain: PropTypes.string,
  cookieName: PropTypes.string
})

export const nullableCrossDomainColorMode = PropTypes.oneOfType([crossDomainColorModeShape, nullLiteral])
