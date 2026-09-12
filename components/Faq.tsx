"use client";

import { useState } from "react";
import { faqItems } from "@/lib/data";
import styles from "./Faq.module.css";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className="eyebrow">Vos questions</p>
          <h2 className="sectionTitle">Questions fréquentes</h2>
        </div>
        <div className={styles.list}>
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            return (
              <div key={item.question} className={styles.item}>
                <button
                  type="button"
                  id={`faq-question-${index}`}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className={styles.question}
                >
                  <span>{item.question}</span>
                  <span className={styles.sign}>{isOpen ? "—" : "+"}</span>
                </button>
                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className={styles.answerWrapper}
                  >
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
          <div className={styles.divider} />
        </div>
      </div>
    </section>
  );
}
