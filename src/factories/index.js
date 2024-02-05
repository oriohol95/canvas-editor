import { Rectangle, Circle } from '../classes'

const shapes = { Rectangle, Circle }

export const shapeFactory = {
  createShape (type, attrs) {
    const ShapeType = shapes[type]
    return new ShapeType(attrs)
  }
}

export const SHAPE_TYPES = {
  RECTANGLE: 'Rectangle',
  CIRCLE: 'Circle'
}
