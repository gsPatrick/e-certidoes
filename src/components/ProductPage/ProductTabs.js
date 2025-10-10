// Salve em: src/components/ProductPage/ProductTabs.js
'use client';
import { useState } from 'react';
import styles from './ProductPage.module.css';

// Ícone de Mais/Menos para o FAQ
const PlusMinusIcon = ({ isOpen }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ''}`}>
        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);


// Componente para renderizar o FAQ
const FaqSection = ({ content }) => {
    const [openIndex, setOpenIndex] = useState(null);

    let faqItems = [];
    try {
        // Garante que o conteúdo é uma string válida antes de fazer o parse
        if (content && typeof content === 'string') {
            faqItems = JSON.parse(content);
        }
    } catch (error) {
        console.error("Erro ao processar o JSON do FAQ:", error);
        return <p>Ocorreu um erro ao carregar as dúvidas frequentes.</p>;
    }

    if (!Array.isArray(faqItems) || faqItems.length === 0) {
        return <p>Nenhuma dúvida frequente disponível para este produto.</p>;
    }

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.faqContainer}>
            {faqItems.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div key={index} className={styles.faqItem}>
                        <button className={styles.faqQuestion} onClick={() => handleToggle(index)}>
                            <span>{item.q}</span>
                            <PlusMinusIcon isOpen={isOpen} />
                        </button>
                        <div className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}>
                            <div className={styles.faqAnswerContent}>
                                <p>{item.a}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const ProductTabs = ({ descriptionContent, faqContent }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabNav}>
        <button 
          onClick={() => setActiveTab('description')} 
          className={activeTab === 'description' ? styles.activeTab : ''}
        >
          Descrição do Produto
        </button>
        <button 
          onClick={() => setActiveTab('faq')} 
          className={activeTab === 'faq' ? styles.activeTab : ''}
        >
          Dúvidas Frequentes
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'description' && <div>{descriptionContent}</div>}
        {activeTab === 'faq' && <FaqSection content={faqContent} />}
      </div>
    </div>
  );
};
export default ProductTabs;