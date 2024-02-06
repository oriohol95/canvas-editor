import { useMemo } from 'react'
import { BsCircleFill, BsFillSquareFill, BsTrash3, BsBackspace } from 'react-icons/bs'
import { Button, ColorPicker, Slider } from '../../components'
import { useCanvas } from './useCanvas'
import { SHAPE_TYPES } from '../../classes/abstract/shape'
import styles from './editor.module.css'

const EDITABLE_ATTRS = ['width', 'height', 'radius']

export default function Editor () {
  const {
    ref,
    shapes,
    selectedShapes,
    addNewShape,
    deleteSelectedShapes,
    updateShape,
    resetCanvas,
    ...events
  } = useCanvas()

  const selectedShape = useMemo(() => {
    if (selectedShapes.length === 1) return shapes[selectedShapes.at(0)]
    return null
  }, [selectedShapes])

  return (
    <section className={styles.wrapper}>
      <aside className={styles.sidePanel}>
        <div>
          <section className={styles.block}>
            <p className={styles.title}>
              <b>Shapes</b>
            </p>
            <div className={styles.shapesContainer}>
              <Button onClick={() => addNewShape(SHAPE_TYPES.RECTANGLE)}>
                <BsFillSquareFill size={80} color='#d3d3d3' />
              </Button>
              <Button onClick={() => addNewShape(SHAPE_TYPES.CIRCLE)}>
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
        </div>
        <section className={styles.bottomBlock}>
          <Button
            disabled={shapes.length === 0}
            onClick={resetCanvas}
          >
            <BsTrash3 size={40} color='#e31638' />
          </Button>
          <Button
            disabled={selectedShapes.length === 0}
            onClick={deleteSelectedShapes}
          >
            <BsBackspace size={40} color='var(--color-dark)' />
          </Button>
        </section>
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
