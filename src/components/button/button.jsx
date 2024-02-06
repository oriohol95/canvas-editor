import styles from './button.module.css'

export default function Button ({
  onClick = () => {},
  disabled = false,
  children
}) {
  return (
    <button
      className={`${styles.button} ${disabled && styles.disabled}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
