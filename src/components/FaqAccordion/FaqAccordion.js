// Salve em: src/components/FaqAccordion/FaqAccordion.js
'use client';

import { useState } from 'react';
import { faqData } from './faqData';
import PlusMinusIcon from './PlusMinusIcon';
import styles from './FaqAccordion.module.css';

const FaqAccordion = () => {
  const [openKey, setOpenKey] = useState(null);

  const handleToggle = (key) => {
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <div className={styles.accordion}>
      {faqData.FAQ.map((topicItem, topicIndex) => (
        <section key={topicIndex} className={styles.topicSection}>
          <h2 className={styles.topicTitle}>{topicItem.topic}</h2>
          {topicItem.subtopics.map((faqItem, subIndex) => {
            const currentKey = `${topicIndex}-${subIndex}`;
            const isOpen = openKey === currentKey;

            return (
              <div key={currentKey} className={styles.faqItem}>
                <button
                  className={styles.question}
                  onClick={() => handleToggle(currentKey)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.questionText}>{faqItem.question}</span>
                  <div className={styles.iconWrapper}>
                    <PlusMinusIcon
                      isOpen={isOpen}
                      className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}
                    />
                  </div>
                </button>
                <div
                  className={`${styles.answer} ${isOpen ? styles.answerOpen : ''}`}
                >
                  <div className={styles.answerContent}>
                    {faqItem.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
};

export default FaqAccordion;