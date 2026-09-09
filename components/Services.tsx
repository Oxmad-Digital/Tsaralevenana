import { services } from "@/lib/data";
import ServiceCard from "./ServiceCard";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <section id="prestations" className={styles.services}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="eyebrow">Ce que nous offrons</p>
          <h2 className="sectionTitle">Nos prestations</h2>
        </div>
        <div className={styles.grid}>
          {services.map((service) => (
            <ServiceCard key={service.number} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
