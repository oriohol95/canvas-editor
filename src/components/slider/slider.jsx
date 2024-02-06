import styles from './slider.module.css'

export default function Slider ({
  value = 0,
  min = 0,
  max = 1000,
  step = 5,
  onChange = () => {}
}) {
  return (
    <input
      className={styles.slider}
      type='range'
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
    />
  )
}
