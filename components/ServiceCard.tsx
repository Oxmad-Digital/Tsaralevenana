import type { ServiceItem } from "@/lib/data";
import ServiceIcon from "./ServiceIcon";
import styles from "./ServiceCard.module.css";

export default function ServiceCard({ number, title, description, icon }: ServiceItem) {
  return (
    <div className={styles.card}>
      <ServiceIcon name={icon} className={styles.icon} />
      <div className={styles.number}>{number}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
