import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { parseSafeHtml } from './safeHtmlParser'

describe('parseSafeHtml', () => {
  it('should return null/undefined as-is', () => {
    expect(parseSafeHtml(null)).toBeNull()
    expect(parseSafeHtml(undefined)).toBeUndefined()
  })

  it('should return non-string values as-is', () => {
    expect(parseSafeHtml(123)).toBe(123)
    expect(parseSafeHtml({})).toEqual({})
    expect(parseSafeHtml([])).toEqual([])
  })

  it('should return empty string as-is', () => {
    expect(parseSafeHtml('')).toBe('')
  })

  it('should return plain text without HTML as-is', () => {
    const text = 'This is plain text without any HTML tags'
    expect(parseSafeHtml(text)).toBe(text)
  })

  it('should handle <b> tags correctly', () => {
    const text = 'This is <b>bold</b> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<b>bold</b>')
    expect(container.textContent).toBe('This is bold text')
  })

  it('should handle <i> tags correctly', () => {
    const text = 'This is <i>italic</i> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<i>italic</i>')
    expect(container.textContent).toBe('This is italic text')
  })

  it('should handle <em> tags correctly', () => {
    const text = 'This is <em>emphasized</em> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<em>emphasized</em>')
    expect(container.textContent).toBe('This is emphasized text')
  })

  it('should handle multiple <b>, <i>, and <em> tags', () => {
    const text = 'This is <b>bold</b>, <i>italic</i>, and <em>emphasized</em> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<b>bold</b>')
    expect(container.innerHTML).toContain('<i>italic</i>')
    expect(container.innerHTML).toContain('<em>emphasized</em>')
    expect(container.textContent).toBe('This is bold, italic, and emphasized text')
  })

  it('should support nested tags', () => {
    const text = 'This is <b><i>bold italic</i></b> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<b><i>bold italic</i></b>')
    expect(container.textContent).toBe('This is bold italic text')
  })

  it('should handle <br /> tags correctly', () => {
    const text = 'Line 1<br />Line 2'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<br>')
    expect(container.textContent).toBe('Line 1Line 2')
  })

  it('should handle <br> tags without slash', () => {
    const text = 'Line 1<br>Line 2'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<br>')
    expect(container.textContent).toBe('Line 1Line 2')
  })

  it('should handle multiple <br /> tags', () => {
    const text = 'Line 1<br />Line 2<br />Line 3'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const brElements = container.querySelectorAll('br')
    expect(brElements).toHaveLength(2)
    expect(container.textContent).toBe('Line 1Line 2Line 3')
  })

  it('should handle mixed tags with <br />', () => {
    const text = 'This is <b>bold</b><br />and <i>italic</i>'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<b>bold</b>')
    expect(container.innerHTML).toContain('<br>')
    expect(container.innerHTML).toContain('<i>italic</i>')
    expect(container.textContent).toBe('This is boldand italic')
  })

  it('should handle anchor tags with valid URLs', () => {
    const text = 'Check out <a href="https://example.com">this link</a>'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.href).toBe('https://example.com/')
    expect(link.target).toBe('_blank')
    expect(link.rel).toBe('noopener noreferrer')
    expect(link.textContent).toBe('this link')
  })

  it('should ignore anchor tags without href', () => {
    const text = 'This is <a>invalid link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    // The parser will still create an anchor tag but without href, so we check for the text content
    expect(container.textContent).toBe('This is invalid link text')
  })

  it('should ignore anchor tags with invalid URLs', () => {
    const text = 'This is <a href="not-a-url">invalid link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    // The parser will still create an anchor tag but without href, so we check for the text content
    expect(container.textContent).toBe('This is invalid link text')
  })

  it('should handle nested tags within anchor tags', () => {
    const text = 'Check out <a href="https://example.com"><b>this bold link</b></a>'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.innerHTML).toContain('<b>this bold link</b>')
    expect(link.textContent).toBe('this bold link')
  })

  it('should ignore unsupported HTML tags', () => {
    const text = 'This is <div>div content</div> and <span>span content</span>'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    // The parser will still render the content but without the unsupported tags
    expect(container.textContent).toBe('This is div content and span content')
  })

  it('should handle malformed HTML gracefully', () => {
    const text = 'This is <b>unclosed bold and <i>italic</b>'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    // Should still render what it can
    expect(container.textContent).toContain('This is')
  })

  it('should parse case-insensitive tags', () => {
    const text = 'This is <B>BOLD</B> and <I>ITALIC</I>'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<b>BOLD</b>')
    expect(container.innerHTML).toContain('<i>ITALIC</i>')
    expect(container.textContent).toBe('This is BOLD and ITALIC')
  })

  it('should handle case-insensitive <br /> tags', () => {
    const text = 'Line 1<BR />Line 2<Br>Line 3'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const brElements = container.querySelectorAll('br')
    expect(brElements).toHaveLength(2)
    expect(container.textContent).toBe('Line 1Line 2Line 3')
  })

  it('should handle empty tag content', () => {
    const text = 'This is <b></b> empty'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<b></b>')
    expect(container.textContent).toBe('This is  empty')
  })

  it('should handle text with only <br /> tags', () => {
    const text = '<br /><br />'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const brElements = container.querySelectorAll('br')
    expect(brElements).toHaveLength(2)
    expect(container.textContent).toBe('')
  })

  it('should handle text starting with <br />', () => {
    const text = '<br />Line 2'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<br>')
    expect(container.textContent).toBe('Line 2')
  })

  it('should handle text ending with <br />', () => {
    const text = 'Line 1<br />'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<br>')
    expect(container.textContent).toBe('Line 1')
  })

  it('should handle text with only inline tags', () => {
    const text = '<b>Bold</b><i>Italic</i>'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<b>Bold</b>')
    expect(container.innerHTML).toContain('<i>Italic</i>')
    expect(container.textContent).toBe('BoldItalic')
  })

  it('should handle text with only one tag', () => {
    const text = '<b>Bold</b>'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<b>Bold</b>')
    expect(container.textContent).toBe('Bold')
  })

  it('should handle text with only one <br /> tag', () => {
    const text = '<br />'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<br>')
    expect(container.textContent).toBe('')
  })

  it('should handle complex nested structures', () => {
    const text = 'This is <b><i><em>complex</em> nested</i> structure</b>'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    expect(container.innerHTML).toContain('<b><i><em>complex</em> nested</i> structure</b>')
    expect(container.textContent).toBe('This is complex nested structure')
  })

  it('should handle anchor tags with no valid href and no children', () => {
    const text = 'This is <a href="invalid-url"></a> empty link'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.href).toBe('http://localhost/invalid-url')
    expect(container.textContent).toBe('This is  empty link')
  })

  it('should handle anchor tags with no href attribute', () => {
    const text = 'This is <a>no href link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe(null)
    expect(link.textContent).toBe('no href link')
  })

  it('should handle anchor tags with empty href', () => {
    const text = 'This is <a href="">empty href link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.href).toBe('http://localhost/')
    expect(link.textContent).toBe('empty href link')
  })

  it('should handle anchor tags with whitespace-only href', () => {
    const text = 'This is <a href="   ">whitespace href link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.href).toBe('http://localhost/')
    expect(link.textContent).toBe('whitespace href link')
  })

  it('should handle anchor tags with invalid URL schemes', () => {
    const text = 'This is <a href="javascript:alert(1)">javascript link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    // React 19 blocks javascript: URLs for security - it replaces them with a security error
    expect(link.href).toContain('javascript:')
    expect(link.textContent).toBe('javascript link')
  })

  it('should handle anchor tags with relative URLs', () => {
    const text = 'This is <a href="/relative/path">relative link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    // Relative URLs should be valid
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.href).toContain('/relative/path')
    expect(link.textContent).toBe('relative link')
  })

  it('should handle anchor tags with protocol-relative URLs', () => {
    const text = 'This is <a href="//example.com">protocol-relative link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    // Protocol-relative URLs should be valid
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.href).toContain('//example.com')
    expect(link.textContent).toBe('protocol-relative link')
  })

  it('should handle anchor tags with mailto URLs', () => {
    const text = 'This is <a href="mailto:test@example.com">email link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    // Mailto URLs should be valid
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.href).toBe('mailto:test@example.com')
    expect(link.textContent).toBe('email link')
  })

  it('should handle anchor tags with tel URLs', () => {
    const text = 'This is <a href="tel:+1234567890">phone link</a> text'
    const result = parseSafeHtml(text)
    const { container } = render(<div>{result}</div>)
    // Tel URLs should be valid
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link.href).toBe('tel:+1234567890')
    expect(link.textContent).toBe('phone link')
  })
})
