import Shape, { SHAPE_TYPES } from './abstract/shape'

const HOVER_BORDER_THICKNESS = 3
const SELECTED_BORDER_THICKNESS = 5

const VALID_ATTRS = [
  'radius',
  'color'
]

export default class Circle extends Shape {
  constructor ({ radius = 50, ...attrs }) {
    super(attrs)
    this.type = SHAPE_TYPES.CIRCLE
    this.radius = radius
  }

  draw (ctx, { isHovered = false, isSelected = false }) {
    if (isSelected || isHovered) {
      const borderThickness = isSelected ? SELECTED_BORDER_THICKNESS : HOVER_BORDER_THICKNESS
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius + borderThickness, 0, Math.PI * 2, false)
      ctx.fillStyle = 'rgba(82, 133, 227, 0.5)'
      ctx.fill()
      ctx.closePath()
    }

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

  isMouseOver (x, y) {
    const distance = Math.sqrt(
      ((x - this.x) * (x - this.x)) + ((y - this.y) * (y - this.y))
    )
    return distance < this.radius
  }

  updateAttrs (attrs = {}) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (VALID_ATTRS.includes(key)) this[key] = value
    })
  }
}
