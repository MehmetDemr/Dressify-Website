import styles from "./spinner.module.css";

export function LoadSpinner({ color = "#00ac87" }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} style={{ borderTopColor: color }} />
    </div>
  );
}
