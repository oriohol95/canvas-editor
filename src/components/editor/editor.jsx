import { useMemo } from 'react'
import { BsCircleFill, BsFillSquareFill } from 'react-icons/bs'
import { Button, ColorPicker, Slider } from '../../components'
import { useCanvas } from './useCanvas'
import styles from './editor.module.css'
import { SHAPE_TYPES } from '../../classes/abstract/shape'

const EDITABLE_ATTRS = ['width', 'height', 'radius']

export default function Editor () {
  const {
    ref,
    shapes,
    selectedShapes,
    addNewShape,
    deleteSelectedShapes,
    updateShape,
    ...events
  } = useCanvas()

  const selectedShape = useMemo(() => {
    if (selectedShapes.length === 1) return shapes[selectedShapes.at(0)]
    return null
  }, [selectedShapes])

  const addNewRectangle = () => {
    addNewShape(SHAPE_TYPES.RECTANGLE)
  }

  const addNewCircle = () => {
    addNewShape(SHAPE_TYPES.CIRCLE)
  }

  return (
    <section className={styles.wrapper}>
      <aside className={styles.sidePanel}>
        <section className={styles.block}>
          <p className={styles.title}>
            <b>Shapes</b>
          </p>
          <div className={styles.shapesContainer}>
            <Button
              onClick={() => {
                addNewRectangle()
              }}
            >
              <BsFillSquareFill size={80} color='#d3d3d3' />
            </Button>
            <Button
              onClick={() => {
                addNewCircle()
              }}
            >
              <BsCircleFill size={80} color='#d3d3d3' />
            </Button>
          </div>
        </section>
        {selectedShape && (
          <section className={styles.block}>
            <p className={styles.title}>
              <b>Selected Shape</b>
            </p>
            <div className={styles.attrsContainer}>
              <ColorPicker
                label={`Color: ${selectedShape.color}`}
                color={selectedShape.color}
                onChange={(e) => updateShape(selectedShapes.at(0), { color: e.target.value })}
              />
              {
                Object.entries(selectedShape).map(([key, value], i) => {
                  if (!EDITABLE_ATTRS.includes(key)) return null
                  return (
                    <Slider
                      key={i}
                      label={`${key}: ${value}px`}
                      value={value}
                      onChange={(e) => updateShape(selectedShapes.at(0), { [key]: Number(e.target.value) })}
                    />
                  )
                })
              }
            </div>
          </section>
        )}
      </aside>
      <div className={styles.container}>
        <canvas
          className={styles.canvas}
          ref={ref}
          {...events}
        />
      </div>
    </section>
  )
}
