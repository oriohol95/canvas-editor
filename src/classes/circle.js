import Shape from './abstract/shape'

const BORDER_THICKNESS = 3

export default class Circle extends Shape {
  constructor ({ radius = 50, ...attrs }) {
    super(attrs)
    this.type = 'Circle'
    this.radius = radius
  }

  draw (ctx, { isHovered = false, isSelected = false }) {
    if (isSelected || isHovered) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius + BORDER_THICKNESS, 0, Math.PI * 2, false)
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
}
