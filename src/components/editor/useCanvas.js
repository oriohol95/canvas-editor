import { useRef, useState, useEffect } from 'react'
import { shapeFactory } from '../../factories'
import { SHAPE_TYPES } from '../../classes/abstract/shape'

const CANVAS_PADDING_WIDTH = 400
const CANVAS_PADDING_HEIGHT = 150

export const useCanvas = () => {
  const [shapes, setShapes] = useState([])
  const [selectedShapes, setSelectedShapes] = useState([])

  const canvasRef = useRef()
  const contextRef = useRef()
  const hoveredIndex = useRef(null)
  const startX = useRef(null)
  const startY = useRef(null)
  const isDragging = useRef(false)
  const isShiftPress = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') isShiftPress.current = true
      if (e.key === 'Backspace') deleteSelectedShapes()
    }

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') isShiftPress.current = false
    }

    const handleResize = () => {
      contextRef.current.canvas.width = window.innerWidth - CANVAS_PADDING_WIDTH
      contextRef.current.canvas.height = window.innerHeight - CANVAS_PADDING_HEIGHT

      drawShapes()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('resize', handleResize)

    canvasRef.current.style.background = 'white'
    contextRef.current = canvasRef.current.getContext('2d')

    handleResize()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', handleResize)
    }
  }, [shapes, selectedShapes])

  const drawShapes = () => {
    contextRef.current.clearRect(0, 0, contextRef.current.canvas.width, contextRef.current.canvas.height)

    shapes.forEach((shape, i) => {
      shape.draw(contextRef.current, { isHovered: hoveredIndex.current === i, isSelected: selectedShapes.includes(i) })
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
    setShapes([...shapes, newShape])
    setSelectedShapes([shapes.length])
  }

  const deleteSelectedShapes = () => {
    const newShapes = shapes.filter((_, i) => !selectedShapes.includes(i))
    setShapes(newShapes)
    setSelectedShapes([])
    hoveredIndex.current = null
  }

  const updateShape = (index, attrs) => {
    const newShapes = shapes.map((shape, i) => {
      if (i !== index) return shape
      shape.updateAttrs(attrs)
      return shape
    })
    setShapes(newShapes)
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

    shapes.forEach((shape, i) => {
      if (shape.isMouseOver(startX.current, startY.current)) {
        isDragging.current = true
        if (isShiftPress.current) {
          if (selectedShapes.includes(i)) {
            const newSelectedShapes = selectedShapes.filter((index) => index !== i)
            setSelectedShapes(newSelectedShapes)
          } else {
            setSelectedShapes([
              ...selectedShapes,
              i
            ])
          }
        } else if (selectedShapes.length > 1) {
          if (!selectedShapes.includes(i)) {
            setSelectedShapes([i])
          }
        } else {
          setSelectedShapes([i])
        }
      }
    })

    if (!isDragging.current) setSelectedShapes([])
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
    shapes.forEach((shape, i) => {
      if (shape.isMouseOver(currentX, currentY)) {
        hoveredIndex.current = i
      }
    })

    if (isDragging.current) {
      const diffX = currentX - startX.current
      const diffY = currentY - startY.current

      selectedShapes.forEach((i) => {
        const currentShape = shapes[i]
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
    shapes,
    selectedShapes,
    addNewShape,
    deleteSelectedShapes,
    updateShape,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseOut: handleMouseUp,
    onMouseMove: handleMouseMove
  }
}
