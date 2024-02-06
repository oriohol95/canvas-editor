import Shape, { SHAPE_TYPES } from './abstract/shape'

const BORDER_THICKNESS = 3

export default class Rectangle extends Shape {
  constructor ({ width = 100, height = 100, ...attrs }) {
    super(attrs)
    this.type = SHAPE_TYPES.RECTANGLE
    this.width = width
    this.height = height
  }

  draw (ctx, { isHovered = false, isSelected = false }) {
    if (isSelected || isHovered) {
      ctx.fillStyle = 'rgba(82, 133, 227, 0.5)'
      ctx.fillRect(this.x - (BORDER_THICKNESS), this.y - (BORDER_THICKNESS), this.width + (BORDER_THICKNESS * 2), this.height + (BORDER_THICKNESS * 2))
    }
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  isMouseOver (x, y) {
    const { left, right, top, bottom } = this.#getBoundaries()
    return x > left && x < right && y > top && y < bottom
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
