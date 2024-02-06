import React from 'react'
import styles from './header.module.css'

export default function Header () {
  return (
    <header className={styles.header}>
      <img
        src='/screencastify-logo.svg'
        alt='ScreenCastify logo'
        width={192}
        height={48}
      />
      <h1 className={styles.title}>
        Canvas Editor
      </h1>
      <div className={styles.invisible} />
    </header>
  )
}
