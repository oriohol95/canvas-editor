import Shape, { SHAPE_TYPES } from './abstract/shape'

const HOVER_BORDER_THICKNESS = 3
const SELECTED_BORDER_THICKNESS = 5

const VALID_ATTRS = [
  'width',
  'height',
  'color'
]

export default class Rectangle extends Shape {
  constructor ({ width = 100, height = 100, ...attrs }) {
    super(attrs)
    this.type = SHAPE_TYPES.RECTANGLE
    this.width = width
    this.height = height
  }

  draw (ctx, { isHovered = false, isSelected = false }) {
    if (isSelected || isHovered) {
      const borderThickness = isSelected ? SELECTED_BORDER_THICKNESS : HOVER_BORDER_THICKNESS
      ctx.fillStyle = 'rgba(82, 133, 227, 0.5)'
      ctx.fillRect(this.x - (borderThickness), this.y - (borderThickness), this.width + (borderThickness * 2), this.height + (borderThickness * 2))
    }
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  isMouseOver (x, y) {
    const { left, right, top, bottom } = this.#getBoundaries()
    return x > left && x < right && y > top && y < bottom
  }

  updateAttrs (attrs = {}) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (VALID_ATTRS.includes(key)) this[key] = value
    })
  }

  #getBoundaries () {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    }
  }
}
