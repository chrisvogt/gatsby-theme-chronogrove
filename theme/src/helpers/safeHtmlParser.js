import React from 'react'
import parse, { domToReact, Element } from 'html-react-parser'

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

  const options = {
    replace: domNode => {
      if (domNode instanceof Element && domNode.attribs) {
        const { name, attribs, children } = domNode

        // Whitelist of allowed tags
        const allowedTags = ['b', 'i', 'em', 'br', 'a', 'p', 'strong']

        // Check if tag is allowed
        if (!allowedTags.includes(name)) {
          // For disallowed tags, return false to skip rendering the tag entirely
          // but still process its children
          return false
        }

        // Handle self-closing tags that don't have Themed equivalents
        if (name === 'br') {
          return <br key={Math.random()} />
        }

        // Handle anchor tags with href validation
        if (name === 'a') {
          const href = attribs.href
          if (!href || !isValidUrl(href)) {
            // If no valid href, just return the text content
            return domNode.children && domNode.children.length > 0 ? domToReact(domNode.children, options) : null
          }

          return (
            <a key={Math.random()} href={href} target='_blank' rel='noopener noreferrer'>
              {domToReact(children, options)}
            </a>
          )
        }

        // Handle other allowed tags (b, i, em, p, strong) using regular HTML elements
        const Element = name
        return <Element key={Math.random()}>{domToReact(children, options)}</Element>
      }
    }
  }

  return parse(text, options)
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

export default parseSafeHtml
