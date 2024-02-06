import { useState } from 'react'
import { BsCircleFill, BsFillSquareFill } from 'react-icons/bs'
import { Button, Slider } from '../../components'
import { useCanvas } from './useCanvas'
import styles from './editor.module.css'
import { SHAPE_TYPES } from '../../factories'

export default function Editor () {
  const { ref, addNewShape, deleteSelectedShapes, ...events } = useCanvas()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

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
        <section className={styles.block}>
          <p className={styles.title}>
            <b>Selected Shape</b>
          </p>
          <div className={styles.shapesContainer}>
            <Slider
              label='Width'
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </div>
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
