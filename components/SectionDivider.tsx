import FloralSprig from "./FloralSprig";
import styles from "./SectionDivider.module.css";

/** Séparateur décoratif (deux traits + brin floral) entre les sections. */
export default function SectionDivider() {
  return (
    <div className={styles.divider}>
      <span className={styles.lineLeft} />
      <FloralSprig className={styles.icon} />
      <span className={styles.lineRight} />
    </div>
  );
}
