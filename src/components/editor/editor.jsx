import { useMemo } from 'react'
import { BsCircleFill, BsFillSquareFill } from 'react-icons/bs'
import { Button, Slider } from '../../components'
import { useCanvas } from './useCanvas'
import styles from './editor.module.css'
import { SHAPE_TYPES } from '../../classes/abstract/shape'

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
              <BsFillSquareFill size={80} color='lightgray' />
            </Button>
            <Button
              onClick={() => {
                addNewCircle()
              }}
            >
              <BsCircleFill size={80} color='lightgray' />
            </Button>
          </div>
        </section>
        {selectedShape && (
          <section className={styles.block}>
            <p className={styles.title}>
              <b>Selected Shape</b>
            </p>
            <div className={styles.attrsContainer}>
              {selectedShape.type === SHAPE_TYPES.RECTANGLE && (
                <>
                  <Slider
                    label={`Width: ${selectedShape.width}px`}
                    value={selectedShape.width}
                    onChange={(e) => updateShape(selectedShapes.at(0), { width: Number(e.target.value) })}
                  />
                  <Slider
                    label={`Height: ${selectedShape.height}px`}
                    value={selectedShape.height}
                    onChange={(e) => updateShape(selectedShapes.at(0), { height: Number(e.target.value) })}
                  />
                </>
              )}
              {selectedShape.type === SHAPE_TYPES.CIRCLE && (
                <>
                  <Slider
                    label={`Radius: ${selectedShape.radius}px`}
                    value={selectedShape.radius}
                    onChange={(e) => updateShape(selectedShapes.at(0), { radius: Number(e.target.value) })}
                  />
                </>
              )}
              {/* <Slider
                label='Color'
                value={selectedShape.radius}
                onChange={(e) => updateShape(selectedShapes.at(0), { radius: Number(e.target.value) })}
              /> */}
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
