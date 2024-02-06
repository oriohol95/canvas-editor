import styles from './slider.module.css'

export default function Slider ({
  label = '',
  value = 0,
  min = 0,
  max = 1000,
  step = 1,
  onChange = () => {}
}) {
  return (
    <div className={styles.wrapper}>
      <label>
        {label}
      </label>
      <input
        className={styles.slider}
        type='range'
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
    </div>
  )
}
