import { useRef, useEffect } from 'react'
import { shapeFactory, SHAPE_TYPES } from '../../factories'

const CANVAS_PADDING_WIDTH = 400
const CANVAS_PADDING_HEIGHT = 150

export const useCanvas = () => {
  const canvasRef = useRef()
  const contextRef = useRef()
  let shapes = []
  const selectedShapes = new Set()
  let hoveredIndex = null
  let isDragging = false
  let startX = null
  let startY = null
  let isShiftPress = false

  const onKeyDown = (e) => {
    if (e.key === 'Shift') isShiftPress = true
    if (e.key === 'Backspace') deleteSelectedShapes()
  }

  const onKeyUp = (e) => {
    if (e.key === 'Shift') isShiftPress = false
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    canvasRef.current.style.background = 'white'
    contextRef.current = canvasRef.current.getContext('2d')

    const handleResize = () => {
      contextRef.current.canvas.width = window.innerWidth - CANVAS_PADDING_WIDTH
      contextRef.current.canvas.height = window.innerHeight - CANVAS_PADDING_HEIGHT

      drawShapes()
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const drawShapes = () => {
    contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height)

    shapes.forEach((shape, i) => {
      shape.draw(contextRef.current, { isHovered: hoveredIndex === i, isSelected: selectedShapes.has(i) })
    })
  }

  const addNewShape = (
    type = SHAPE_TYPES.RECTANGLE,
    shape = { width: 200, height: 200, radius: 100, color: 'lightgray' }
  ) => {
    const { width, height } = contextRef.current.canvas
    const center = {
      x: type === SHAPE_TYPES.CIRCLE ? width / 2 : (width - shape.width) / 2,
      y: type === SHAPE_TYPES.CIRCLE ? height / 2 : (height - shape.height) / 2
    }

    const newShape = shapeFactory.createShape(type, {
      x: center.x,
      y: center.y,
      width: shape.width,
      height: shape.height,
      radius: shape.radius,
      color: shape.color
    })
    shapes.push(newShape)

    selectedShapes.clear()
    selectedShapes.add(shapes.length - 1)

    drawShapes()
  }

  const deleteSelectedShapes = () => {
    shapes = shapes.filter((_, i) => !selectedShapes.has(i))
    selectedShapes.clear()
    hoveredIndex = null

    drawShapes()
  }

  const getCanvasOffset = () => {
    const { left, top } = canvasRef.current.getBoundingClientRect()
    return {
      offsetX: left,
      offsetY: top
    }
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    const { clientX, clientY } = e
    const { offsetX, offsetY } = getCanvasOffset()

    startX = clientX - offsetX
    startY = clientY - offsetY

    shapes.forEach((shape, i) => {
      if (shape.isMouseOver(startX, startY)) {
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
      if (shape.isMouseOver(currentX, currentY)) {
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

  return {
    ref: canvasRef,
    addNewShape,
    deleteSelectedShapes,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseOut: handleMouseUp,
    onMouseMove: handleMouseMove
  }
}
