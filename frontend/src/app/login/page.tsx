import styles from './login.module.css';

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.heading}>Login</h2>
        <form>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Email</label>
            <input type="email" className={styles.input} placeholder="Enter your email" />
          </div>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} placeholder="Enter your password" />
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
