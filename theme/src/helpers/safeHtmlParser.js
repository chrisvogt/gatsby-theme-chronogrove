import React from 'react'
import parse, { domToReact, Element as DomElement } from 'html-react-parser'

const ALLOWED_TAGS = ['b', 'i', 'em', 'br', 'a', 'p', 'strong']

function isAllowedTag(name) {
  return ALLOWED_TAGS.includes(name)
}

/**
 * Simple URL validation
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
const isValidUrl = url => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Safely converts HTML entities to React elements
 *
 * @param {string} text - The text containing HTML entities
 * @returns {React.ReactNode} - React elements or the original string
 */
export const parseSafeHtml = text => {
  if (!text || typeof text !== 'string') {
    return text
  }

  let keySeed = 0
  const nextKey = prefix => `${prefix}-${++keySeed}`

  const renderAnchor = (domNode, children, nestedOptions, href, key) => {
    if (!href || !isValidUrl(href)) {
      return domNode.children?.length ? domToReact(domNode.children, nestedOptions) : null
    }
    return (
      <a key={key} href={href} target='_blank' rel='noopener noreferrer'>
        {domToReact(children, nestedOptions)}
      </a>
    )
  }

  const renderSemanticTag = (name, domChildren, key, nestedOptions) => {
    const Tag = name
    return <Tag key={key}>{domToReact(domChildren, nestedOptions)}</Tag>
  }

  const options = {
    replace: domNode => {
      if (!(domNode instanceof DomElement) || !domNode.attribs) {
        return undefined
      }

      const { name, attribs, children } = domNode

      if (!isAllowedTag(name)) {
        return false
      }

      const key = nextKey(name)

      if (name === 'br') {
        return <br key={key} />
      }

      if (name === 'a') {
        return renderAnchor(domNode, children, options, attribs.href, key)
      }

      return renderSemanticTag(name, children, key, options)
    }
  }

  return parse(text, options)
}

export default parseSafeHtml
