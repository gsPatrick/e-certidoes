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
  // --- NOVO ESTADO PARA O SUB-FILTRO ---
  const [activeSubFilter, setActiveSubFilter] = useState('Todos');

  const filteredCertificates = allCertificates.filter(certificate => {
    const categoryMatch = activeCategory === 'Todos' || certificate.category === activeCategory;
    const searchMatch = certificate.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // --- LÓGICA DO SUB-FILTRO APLICADA AQUI ---
    const subFilterMatch = activeCategory !== 'Certidões Federais e Estaduais' || 
                           activeSubFilter === 'Todos' || 
                           certificate.esfera === activeSubFilter;

    return categoryMatch && searchMatch && subFilterMatch;
  });

  // Reseta a contagem e o sub-filtro ao mudar de categoria ou busca
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    if (activeCategory !== 'Certidões Federais e Estaduais') {
      setActiveSubFilter('Todos');
    }
  }, [activeCategory, searchTerm]);
  
  // Reseta a contagem ao mudar o sub-filtro
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeSubFilter]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
  };
  
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    // Ao clicar numa nova categoria, reseta o sub-filtro para 'Todos'
    setActiveSubFilter('Todos');
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
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
        
        <div className={styles.contentWrapper}>
            <div className={styles.filterHeader}>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`${styles.filterButton} ${activeCategory === category ? styles.activeFilter : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* --- RENDERIZAÇÃO CONDICIONAL DO SUB-FILTRO --- */}
            {activeCategory === 'Certidões Federais e Estaduais' && (
                <div className={styles.subFilterHeader}>
                    <button onClick={() => setActiveSubFilter('Todos')} className={activeSubFilter === 'Todos' ? styles.activeSubFilter : ''}>Todos</button>
                    <button onClick={() => setActiveSubFilter('Federal')} className={activeSubFilter === 'Federal' ? styles.activeSubFilter : ''}>Federais</button>
                    <button onClick={() => setActiveSubFilter('Estadual')} className={activeSubFilter === 'Estadual' ? styles.activeSubFilter : ''}>Estaduais</button>
                </div>
            )}

            <div className={styles.listContainer}>
                {filteredCertificates.length > 0 ? (
                    filteredCertificates.slice(0, visibleCount).map((certificate) => {
                    const linkUrl = certificate.isPlaceholder ? '#' : (certificate.customUrl || `/certidoes/${certificate.slug}`);
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