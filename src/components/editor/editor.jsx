import { useCanvas } from './useCanvas'
import styles from './editor.module.css'
import { SHAPE_TYPES } from '../../factories'

const WIDTH = 1280 / 2
const HEIGHT = 720 / 2

export default function Editor () {
  const { ref, addNewShape, ...events } = useCanvas({ width: WIDTH, height: HEIGHT })

  const addNewRectangle = () => {
    addNewShape(SHAPE_TYPES.RECTANGLE)
  }

  const addNewCircle = () => {
    addNewShape(SHAPE_TYPES.CIRCLE)
  }

  return (
    <section>
      <div className='tools'>
        <button
          onClick={() => {
            addNewRectangle()
          }}
        >
          NEW RECTANGLE
        </button>
        <button
          onClick={() => {
            addNewCircle()
          }}
        >
          NEW CIRCLE
        </button>
      </div>
      <canvas
        width={WIDTH}
        height={HEIGHT}
        className={styles.canvas}
        ref={ref}
        {...events}
      />
    </section>
  )
}
