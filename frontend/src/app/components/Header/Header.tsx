import React from 'react';
import styles from '../Header/Header.module.css';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
    <div className={styles.search_container}>
      <input className={styles.search_bar} type="text" placeholder="Search..." />
      <button className={styles.search_button} aria-label="Search"></button>
    </div>
  </div>
  );
};

export default Header;
