'use client'; // Este componente usa hooks, então precisa ser um Client Component

import { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

// Componente interno para cada categoria de cookie na visão de personalização
const CookieCategory = ({ title, description, isAlwaysActive = false, isOpen, onToggle }) => {
  return (
    <div className={styles.category}>
      <div className={styles.categoryHeader} onClick={onToggle}>
        <div className={styles.categoryTitleWrapper}>
          <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>›</span>
          <h4 className={styles.categoryTitle}>{title}</h4>
        </div>
        {isAlwaysActive && <span className={styles.alwaysActive}>Sempre ativo</span>}
      </div>
      {isOpen && (
        <div className={styles.categoryDescription}>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};


const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    // Verifica no localStorage se o consentimento já foi dado
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setIsVisible(false);
  };
  
  const handleSavePreferences = () => {
    // Lógica para salvar preferências específicas (pode ser implementado com mais detalhes)
    localStorage.setItem('cookie_consent', 'personalized');
    setIsVisible(false);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {!isPersonalizing ? (
        // Visão Inicial do Banner
        <div className={styles.banner}>
          <div className={styles.textWrapper}>
            <h3 className={styles.title}>Valorizamos sua privacidade</h3>
            <p className={styles.description}>
              Utilizamos cookies para aprimorar sua experiência de navegação, exibir anúncios ou conteúdo personalizado e analisar nosso tráfego. Ao clicar em “Aceitar todos”, você concorda com nosso uso de cookies. <a href="/politica-de-cookies">Política de Cookies</a>
            </p>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={() => setIsPersonalizing(true)} className={`${styles.button} ${styles.personalizeBtn}`}>Personalizar</button>
            <button onClick={handleReject} className={`${styles.button} ${styles.rejectBtn}`}>Rejeitar</button>
            <button onClick={handleAccept} className={`${styles.button} ${styles.acceptBtn}`}>Aceitar tudo</button>
          </div>
        </div>
      ) : (
        // Visão de Personalização
        <div className={styles.personalizeView}>
          <h3 className={styles.title}>Personalizar preferências de consentimento</h3>
          <p className={styles.description}>
            Os cookies são utilizados para você a navegar com eficiência e executar certas funções. Você encontrará informações detalhadas sobre todos os cookies sob cada categoria de consentimento abaixo.
            Os cookies que são classificados como "Necessários" são armazenados em seu navegador, pois são essenciais para possibilitar o uso de funcionalidades básicas do site. <button className={styles.linkButton}>Mostrar mais</button>
          </p>

          <CookieCategory
            title="Necessário"
            description="Os cookies necessários são cruciais para as funções básicas do site e o site não funcionará como pretendido sem eles. Esses cookies não armazenam nenhum dado pessoalmente identificável."
            isAlwaysActive
            isOpen={openSections['necessario']}
            onToggle={() => toggleSection('necessario')}
          />
          <CookieCategory
            title="Funcional"
            description="Cookies funcionais ajudam a executar certas funcionalidades, como compartilhar o conteúdo do site em plataformas de mídia social, coletar feedbacks e outros recursos de terceiros."
            isOpen={openSections['funcional']}
            onToggle={() => toggleSection('funcional')}
          />
          <CookieCategory
            title="Analíticos"
            description="Cookies analíticos são usados para entender como os visitantes interagem com o site. Esses cookies ajudam a fornecer informações sobre métricas o número de visitantes, taxa de rejeição, fonte de tráfego, etc."
            isOpen={openSections['analiticos']}
            onToggle={() => toggleSection('analiticos')}
          />
          <CookieCategory
            title="Desempenho"
            description="Os cookies de desempenho são usados para entender e analisar os principais índices de desempenho do site, o que ajuda a oferecer uma melhor experiência do usuário para os visitantes."
            isOpen={openSections['desempenho']}
            onToggle={() => toggleSection('desempenho')}
          />
          <CookieCategory
            title="Anúncio"
            description="Os cookies de anúncios são usados para entregar aos visitantes anúncios personalizados com base nas páginas que visitaram antes e analisar a eficácia da campanha publicitária."
            isOpen={openSections['anuncio']}
            onToggle={() => toggleSection('anuncio')}
          />

          <div className={styles.saveButtonWrapper}>
            <button onClick={handleSavePreferences} className={`${styles.button} ${styles.acceptBtn}`}>Salvar minhas preferências</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;