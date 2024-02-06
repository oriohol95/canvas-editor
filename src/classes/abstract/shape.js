export default class Shape {
  constructor ({
    x = 10,
    y = 10,
    color = 'lightgray'
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
