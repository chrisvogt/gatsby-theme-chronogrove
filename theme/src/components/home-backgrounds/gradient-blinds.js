import { useEffect, useRef } from 'react'
import './gradient-blinds.css'

/**
 * Gradient Blinds Background
 *
 * Creates animated vertical gradient strips that move and shift colors.
 * Inspired by React Bits Gradient Blinds component.
 * Source: https://reactbits.dev/backgrounds/gradient-blinds
 */
export default function GradientBlinds(props) {
  const { colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'], speed = 1.0, stripes = 8 } = props

  const containerRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let time = 0

    const animate = () => {
      time += 0.002 * speed

      const stripeElements = container.querySelectorAll('.gradient-blind-stripe')
      stripeElements.forEach((stripe, index) => {
        const offset = Math.sin(time + index * 0.5) * 20
        const colorIndex = Math.floor((time * 2 + index) % colors.length)
        const nextColorIndex = (colorIndex + 1) % colors.length

        stripe.style.transform = `translateY(${offset}px)`
        stripe.style.background = `linear-gradient(180deg, ${colors[colorIndex]}, ${colors[nextColorIndex]})`
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Create stripes
    container.innerHTML = ''
    for (let i = 0; i < stripes; i++) {
      const stripe = document.createElement('div')
      stripe.className = 'gradient-blind-stripe'
      stripe.style.left = `${(i / stripes) * 100}%`
      stripe.style.width = `${100 / stripes}%`
      container.appendChild(stripe)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [colors, speed, stripes])

  return <div ref={containerRef} className='gradient-blinds-container' />
}
