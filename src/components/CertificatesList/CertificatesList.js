// Salve em: src/components/CertificatesList/CertificatesList.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CertificatesList.module.css';
import { allCertificates, categories } from './certificatesData';
import { CertificateIcon } from './CertificateIcons';
import { SearchIcon } from './SearchIcon';

const ITEMS_PER_PAGE = 10;

const CertificatesList = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredCertificates = allCertificates.filter(certificate => {
    const categoryMatch = activeCategory === 'Todos' || certificate.category === activeCategory;
    const searchMatch = certificate.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory, searchTerm]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* O cabeçalho e a busca ficam FORA do contêiner branco */}
        <div className={styles.header}>
            <h2 className={styles.title}>Serviço Privado que Facilita a Busca e Entrega de Documentos em todo o Brasil</h2>
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Qual documento você precisa?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>
        </div>
        
        {/* === NOVO CONTÊINER BRANCO PARA AGRUPAR FILTROS E LISTA === */}
        <div className={styles.contentWrapper}>
            <div className={styles.filterHeader}>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`${styles.filterButton} ${activeCategory === category ? styles.activeFilter : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className={styles.listContainer}>
                {filteredCertificates.length > 0 ? (
                    filteredCertificates.slice(0, visibleCount).map((certificate) => {
                    const linkUrl = certificate.customUrl || `/certidoes/${certificate.slug}`;
                    return (
                        <Link href={linkUrl} key={certificate.id} className={styles.listItem}>
                        <div className={styles.iconWrapper}>
                            <CertificateIcon iconName={certificate.icon} />
                        </div>
                        <p className={styles.itemName}>{certificate.name}</p>
                        <span className={styles.chevron}>&gt;</span>
                        </Link>
                    );
                    })
                ) : (
                    <p className={styles.noResults}>Nenhuma certidão encontrada.</p>
                )}
            </div>
        </div>
        
        {visibleCount < filteredCertificates.length && (
          <div className={styles.loadMoreContainer}>
            <button onClick={handleLoadMore} className={styles.loadMoreButton}>
              Ver Mais
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default CertificatesList;