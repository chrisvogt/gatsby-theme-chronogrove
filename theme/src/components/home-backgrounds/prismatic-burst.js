import { useEffect, useRef } from 'react'
import './prismatic-burst.css'

/**
 * Prismatic Burst Background
 *
 * Creates an animated radial gradient burst effect with rotating colors.
 * Inspired by React Bits Prismatic Burst component.
 * Source: https://reactbits.dev/backgrounds/prismatic-burst
 */
export default function PrismaticBurst(props) {
  const { colors = ['#FF6B9D', '#C06BFF', '#4ECDC4', '#FFE66D', '#FF6B9D'], speed = 1.0, blur = 100 } = props

  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const animate = () => {
      const width = canvas.width
      const height = canvas.height

      time += 0.01 * speed

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Create radial gradients
      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = Math.sqrt(width * width + height * height) / 2

      // Create multiple rotating gradient circles
      for (let i = 0; i < 3; i++) {
        const angle = time + (i * Math.PI * 2) / 3
        const offsetX = Math.cos(angle) * (maxRadius * 0.3)
        const offsetY = Math.sin(angle) * (maxRadius * 0.3)

        const gradient = ctx.createRadialGradient(
          centerX + offsetX,
          centerY + offsetY,
          0,
          centerX + offsetX,
          centerY + offsetY,
          maxRadius * 0.8
        )

        const colorIndex = i % colors.length
        const nextColorIndex = (i + 1) % colors.length

        gradient.addColorStop(0, colors[colorIndex] + 'CC')
        gradient.addColorStop(0.5, colors[nextColorIndex] + '66')
        gradient.addColorStop(1, 'transparent')

        ctx.globalCompositeOperation = i === 0 ? 'source-over' : 'screen'
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [colors, speed, blur])

  return (
    <div className='prismatic-burst-container'>
      <canvas ref={canvasRef} className='prismatic-burst-canvas' style={{ filter: `blur(${blur}px)` }} />
    </div>
  )
}
