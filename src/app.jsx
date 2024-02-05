import { Editor } from './components'
import styles from './app.module.css'

function App () {
  return (
    <div className={styles.wrapper}>
      <div>
        Header
      </div>
      <main className={styles.body}>
        <Editor />
      </main>
    </div>
  )
}

export default App
