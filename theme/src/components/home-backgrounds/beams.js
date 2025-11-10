import { useEffect, useRef } from 'react'
import './beams.css'

/**
 * Beams Background
 *
 * Creates animated light beams emanating from the center.
 * Inspired by React Bits Beams component.
 * Source: https://reactbits.dev/backgrounds/beams
 */
export default function Beams(props) {
  const { colors = ['#60a5fa', '#c084fc', '#f472b6'], speed = 1.0, beamCount = 6 } = props

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

      const centerX = width / 2
      const centerY = height / 2
      const maxDist = Math.sqrt(width * width + height * height)

      // Draw beams
      for (let i = 0; i < beamCount; i++) {
        const angle = (time + (i * Math.PI * 2) / beamCount) % (Math.PI * 2)
        const beamWidth = 60

        const gradient = ctx.createLinearGradient(
          centerX,
          centerY,
          centerX + Math.cos(angle) * maxDist,
          centerY + Math.sin(angle) * maxDist
        )

        const color = colors[i % colors.length]
        gradient.addColorStop(0, color + '00')
        gradient.addColorStop(0.3, color + '40')
        gradient.addColorStop(0.6, color + '20')
        gradient.addColorStop(1, color + '00')

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(angle)

        ctx.fillStyle = gradient
        ctx.fillRect(0, -beamWidth / 2, maxDist, beamWidth)

        ctx.restore()
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
  }, [colors, speed, beamCount])

  return (
    <div className='beams-container'>
      <canvas ref={canvasRef} className='beams-canvas' />
    </div>
  )
}
