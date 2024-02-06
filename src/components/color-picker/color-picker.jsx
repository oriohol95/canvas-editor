import styles from './color-picker.module.css'

export default function ColorPicker ({
  label = '',
  color = 0,
  onChange = () => {}
}) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label}
      </label>
      <input
        className={styles.input}
        type='color'
        value={color}
        onChange={onChange}
      />
    </div>
  )
}
