// Salve em: src/components/CertificatesList/CertificatesList.js
'use client';

import { useState, useEffect } from 'react'; // 1. Importar useEffect
import Link from 'next/link';
import styles from './CertificatesList.module.css';
import { allCertificates, categories } from './certificatesData';
import { CertificateIcon } from './CertificateIcons';
import { SearchIcon } from './SearchIcon';

const ITEMS_PER_PAGE = 10; // 2. Define a quantidade de itens a serem carregados por vez

const CertificatesList = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE); // 3. Novo estado para controlar a visibilidade

  // 4. Filtra os certificados com base na categoria e busca
  const filteredCertificates = allCertificates.filter(certificate => {
    const categoryMatch = activeCategory === 'Todos' || certificate.category === activeCategory;
    const searchMatch = certificate.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // 5. Efeito que reseta a contagem sempre que um filtro é alterado
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeCategory, searchTerm]);

  // 6. Função para carregar mais itens
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Nossos Serviços de Certidões</h2>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Digite o nome da certidão que você procura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

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
            // 7. Usa .slice() para mostrar apenas os itens visíveis
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
            <p className={styles.noResults}>Nenhuma certidão encontrada. Tente ajustar sua busca ou filtro.</p>
          )}
        </div>
        
        {/* 8. Botão "Ver Mais" que só aparece se houver mais itens para carregar */}
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