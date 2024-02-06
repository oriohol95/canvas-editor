import { useRef, useEffect } from 'react'
import { shapeFactory, SHAPE_TYPES } from '../../factories'

const CANVAS_PADDING_WIDTH = 400
const CANVAS_PADDING_HEIGHT = 150

export const useCanvas = () => {
  const canvasRef = useRef()
  const contextRef = useRef()
  const shapes = useRef([])
  const selectedShapes = useRef(new Set())
  const hoveredIndex = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(null)
  const startY = useRef(null)
  const isShiftPress = useRef(false)

  const onKeyDown = (e) => {
    if (e.key === 'Shift') isShiftPress.current = true
    if (e.key === 'Backspace') deleteSelectedShapes()
  }

  const onKeyUp = (e) => {
    if (e.key === 'Shift') isShiftPress.current = false
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

    shapes.current.forEach((shape, i) => {
      shape.draw(contextRef.current, { isHovered: hoveredIndex.current === i, isSelected: selectedShapes.current.has(i) })
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
    shapes.current.push(newShape)

    selectedShapes.current.clear()
    selectedShapes.current.add(shapes.current.length - 1)

    drawShapes()
  }

  const deleteSelectedShapes = () => {
    shapes.current = shapes.current.filter((_, i) => !selectedShapes.current.has(i))
    selectedShapes.current.clear()
    hoveredIndex.current = null

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

    startX.current = clientX - offsetX
    startY.current = clientY - offsetY

    shapes.current.forEach((shape, i) => {
      if (shape.isMouseOver(startX.current, startY.current)) {
        isDragging.current = true
        if (isShiftPress.current) {
          if (selectedShapes.current.has(i)) selectedShapes.current.delete(i)
          else selectedShapes.current.add(i)
        } else if (selectedShapes.current.size > 1) {
          if (!selectedShapes.current.has(i)) {
            selectedShapes.current.clear()
            selectedShapes.current.add(i)
          }
        } else {
          selectedShapes.current.clear()
          selectedShapes.current.add(i)
        }
      }
    })

    if (!isDragging.current) selectedShapes.current.clear()

    drawShapes()
  }

  const handleMouseUp = (e) => {
    e.preventDefault()
    isDragging.current = false
  }

  const handleMouseMove = (e) => {
    e.preventDefault()

    const { clientX, clientY } = e
    const { offsetX, offsetY } = getCanvasOffset()

    const currentX = clientX - offsetX
    const currentY = clientY - offsetY

    hoveredIndex.current = null
    shapes.current.forEach((shape, i) => {
      if (shape.isMouseOver(currentX, currentY)) {
        hoveredIndex.current = i
      }
    })

    if (isDragging.current) {
      const diffX = currentX - startX.current
      const diffY = currentY - startY.current

      selectedShapes.current.forEach((i) => {
        const currentShape = shapes.current[i]
        currentShape.x += diffX
        currentShape.y += diffY

        hoveredIndex.current = i
      })
    }

    drawShapes()

    startX.current = currentX
    startY.current = currentY
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
