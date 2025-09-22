import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.footerLinks}>
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>
          <Link href="/reembolso-e-devolucao">Política de Reembolso e Devolução</Link>
          <Link href="/termos-e-condicoes">Termos e Condições</Link>
          <Link href="/faq">Tire suas Dúvidas</Link>
        </nav>

        <hr className={styles.separator} />

        <div className={styles.copyrightArea}>
          <p className={styles.copyrightText}>
            E-Certidões @ 2025. Todos os Direitos Reservados
          </p>
          <p className={styles.developerCredit}>
            Desenvolvido por{' '}
            <a 
              href="https://codebypatrick.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.developerLink}
            >
              Patrick.Developer
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;