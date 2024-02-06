import { Header, Editor } from './components'
import styles from './app.module.css'

function App () {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.body}>
        <Editor />
      </main>
    </div>
  )
}

export default App
