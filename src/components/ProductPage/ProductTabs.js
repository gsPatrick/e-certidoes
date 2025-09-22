// Salve em: src/components/ProductPage/ProductTabs.js
'use client';
import { useState } from 'react';
import styles from './ProductPage.module.css';

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
        {activeTab === 'faq' && <div>{faqContent}</div>}
      </div>
    </div>
  );
};
export default ProductTabs;