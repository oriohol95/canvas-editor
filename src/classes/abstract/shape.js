export default class Shape {
  constructor ({
    x = 0,
    y = 0,
    color = '#d3d3d3'
  }) {
    this.x = x
    this.y = y
    this.color = color
  }
}

export const SHAPE_TYPES = {
  RECTANGLE: 'Rectangle',
  CIRCLE: 'Circle'
}
