import { useEffect, useRef } from 'react'
import styles from './editor.module.css'

const WIDTH = 1280 / 2
const HEIGHT = 720 / 2

const getShapeBoundaries = (shape) => {
  return {
    left: shape.x,
    right: shape.x + shape.width,
    top: shape.y,
    bottom: shape.y + shape.height
  }
}

export default function Editor () {
  const canvasRef = useRef()
  const contextRef = useRef()
  const shapes = []
  const selectedShapes = new Set()
  let hoveredIndex = null
  let isDragging = false
  let startX = null
  let startY = null
  let isShiftPress = false

  const onKeyDown = (e) => {
    if (e.key === 'Shift') isShiftPress = true
  }

  const onKeyUp = (e) => {
    if (e.key === 'Shift') isShiftPress = false
  }

  useEffect(() => {
    if (canvasRef.current === null) return
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    canvasRef.current.style.background = 'white'
    contextRef.current = canvasRef.current.getContext('2d')

    shapes.push({ x: 10, y: 10, width: 100, height: 100, color: 'pink' })
    shapes.push({ x: 400, y: 50, width: 100, height: 100, color: 'lightgray' })

    drawShapes()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const drawShapes = () => {
    contextRef.current.clearRect(0, 0, WIDTH, HEIGHT)

    shapes.forEach((shape, i) => {
      if (hoveredIndex === i || selectedShapes.has(i)) drawBorder(shape)
      contextRef.current.fillStyle = shape.color
      contextRef.current.fillRect(shape.x, shape.y, shape.width, shape.height)
    })
  }

  const drawBorder = (shape, thickness = 3) => {
    const { x, y, width, height } = shape
    contextRef.current.fillStyle = 'rgba(82, 133, 227, 0.5)'
    contextRef.current.fillRect(x - (thickness), y - (thickness), width + (thickness * 2), height + (thickness * 2))
  }

  const getCanvasOffset = () => {
    const { left, top } = canvasRef.current.getBoundingClientRect()
    return {
      offsetX: left,
      offsetY: top
    }
  }

  const isMouseOverShape = (x, y, shape) => {
    const { left, right, top, bottom } = getShapeBoundaries(shape)
    return x > left && x < right && y > top && y < bottom
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    const { clientX, clientY } = e
    const { offsetX, offsetY } = getCanvasOffset()

    startX = clientX - offsetX
    startY = clientY - offsetY

    shapes.forEach((shape, i) => {
      if (isMouseOverShape(startX, startY, shape)) {
        isDragging = true
        if (isShiftPress) {
          if (selectedShapes.has(i)) selectedShapes.delete(i)
          else selectedShapes.add(i)
        } else if (selectedShapes.size > 1) {
          if (!selectedShapes.has(i)) {
            selectedShapes.clear()
            selectedShapes.add(i)
          }
        } else {
          selectedShapes.clear()
          selectedShapes.add(i)
        }
      }
    })

    if (!isDragging) selectedShapes.clear()

    drawShapes()
  }

  const handleMouseUp = (e) => {
    e.preventDefault()
    isDragging = false
  }

  const handleMouseMove = (e) => {
    e.preventDefault()

    const { clientX, clientY } = e
    const { offsetX, offsetY } = getCanvasOffset()

    const currentX = clientX - offsetX
    const currentY = clientY - offsetY

    hoveredIndex = null
    shapes.forEach((shape, i) => {
      if (isMouseOverShape(currentX, currentY, shape)) {
        hoveredIndex = i
      }
    })

    if (isDragging) {
      const diffX = currentX - startX
      const diffY = currentY - startY

      selectedShapes.forEach((i) => {
        const currentShape = shapes[i]
        currentShape.x += diffX
        currentShape.y += diffY

        hoveredIndex = i
      })
    }

    drawShapes()

    startX = currentX
    startY = currentY
  }

  return (
    <canvas
      width={WIDTH}
      height={HEIGHT}
      className={styles.canvas}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  )
}
