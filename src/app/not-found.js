// Salve em: src/app/not-found.js

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
// Reutilizaremos o CSS de uma página de texto para manter a consistência
import styles from './politica-de-privacidade/PrivacyPolicy.module.css';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.pageWrapper} style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className={styles.container} style={{ textAlign: 'center' }}>
          <h1 className={styles.title} style={{ fontSize: '4rem', margin: '0' }}>404</h1>
          <h2 className={styles.sectionTitle} style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>Página Não Encontrada</h2>
          <div className={styles.content}>
            <p>
              Desculpe, a página que você está procurando não existe ou foi movida.
            </p>
            <Link 
              href="/" 
              style={{
                display: 'inline-block',
                marginTop: '1.5rem',
                padding: '0.8rem 2rem',
                backgroundColor: '#294B29',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold'
              }}
            >
              Voltar para o Início
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}