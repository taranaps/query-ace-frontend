import React from 'react';
import styles from '../Placeholder/Placeholder.module.css';

const Placeholder: React.FC = () => {
  return (
    <div className={styles.container}>
    <div className={styles.clipboards}>
        <div className={styles.clipboard_back}/>
        <div className={styles.clipboard_front}>
          <img src="/clip.png"  className={styles.clipboard_img}/>
        </div>
      </div>
      </div>
  );
};

export default Placeholder;
