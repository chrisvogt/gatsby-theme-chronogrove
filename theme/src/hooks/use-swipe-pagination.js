import { useEffect, useRef, useState } from 'react'

const useSwipePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  transitionDuration = 300,
  swipeThreshold = 80,
  boundaryResistance = 0.3
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragDistance, setDragDistance] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  const applyBoundaryResistance = distance => {
    if (distance > 0 && currentPage === 1) {
      return distance * boundaryResistance
    }

    if (distance < 0 && currentPage === totalPages) {
      return distance * boundaryResistance
    }

    return distance
  }

  const startDrag = pageX => {
    if (isTransitioning) return
    setIsDragging(true)
    setStartX(pageX)
    setDragDistance(0)
  }

  const updateDrag = pageX => {
    if (!isDragging || isTransitioning) return

    const distance = pageX - startX
    setDragDistance(applyBoundaryResistance(distance))
  }

  const handlePageChange = page => {
    if (page === currentPage || isTransitioning || page < 1 || page > totalPages) return

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    setIsTransitioning(true)
    onPageChange(page)
    setDragDistance(0)

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false)
      transitionTimeoutRef.current = null
    }, transitionDuration)
  }

  const endDrag = () => {
    if (!isDragging || isTransitioning) return

    if (Math.abs(dragDistance) > swipeThreshold) {
      if (dragDistance > 0 && currentPage > 1) {
        handlePageChange(currentPage - 1)
      } else if (dragDistance < 0 && currentPage < totalPages) {
        handlePageChange(currentPage + 1)
      }
    }

    setIsDragging(false)
    setDragDistance(0)
  }

  const getTransform = () => {
    if (totalPages <= 1) {
      return 'translateX(0%)'
    }

    const pageWidth = 100 / totalPages
    const baseTransform = -((currentPage - 1) * pageWidth)
    const viewportWidth = typeof window === 'undefined' ? 1 : window.innerWidth || 1
    const dragOffset = isDragging ? (dragDistance / viewportWidth) * pageWidth : 0

    return `translateX(${baseTransform + dragOffset}%)`
  }

  return {
    dragDistance,
    getTransform,
    handleMouseDown: e => startDrag(e.pageX ?? e.clientX ?? 0),
    handleMouseLeave: endDrag,
    handleMouseMove: e => updateDrag(e.pageX ?? e.clientX ?? 0),
    handleMouseUp: endDrag,
    handlePageChange,
    handlePointerCancel: e => {
      if (e.pointerType === 'mouse') return
      endDrag()
    },
    handlePointerDown: e => {
      if (e.pointerType === 'mouse') return
      startDrag(e.pageX ?? e.clientX ?? 0)
    },
    handlePointerMove: e => {
      if (e.pointerType === 'mouse') return
      updateDrag(e.pageX ?? e.clientX ?? 0)
    },
    handlePointerUp: e => {
      if (e.pointerType === 'mouse') return
      endDrag()
    },
    isDragging,
    isTransitioning
  }
}

export default useSwipePagination
