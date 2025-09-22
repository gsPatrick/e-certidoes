// Salve em: src/components/Header/Header.js
'use client';

import { useState, useEffect } from 'react'; // Adicionado useEffect
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Importar para fechar o menu na navegação
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCartIcon } from './ShoppingCartIcon';
import { MenuIcon, CloseIcon } from './MenuIcons';
import styles from './Header.module.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu quando a rota muda
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Camada de Overlay (agora um elemento separado) */}
        <div
          className={`${styles.overlay} ${isMenuOpen ? styles.overlayVisible : ''}`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="e-Certidões Logo"
              width={200}
              height={50}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </div>

        {/* Menu de Navegação */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <div className={styles.mobileHeader}>
            <span>Menu</span>
            <button onClick={closeMenu} className={styles.closeButton}>
              <CloseIcon />
            </button>
          </div>
          <ul className={styles.navList}>
            <li><Link href="/">Início</Link></li>
            <li><Link href="/certidoes">Certidões</Link></li>
            <li><Link href="/sobre-nos">Sobre Nós</Link></li>
            <li><Link href="/contato">Contato</Link></li>
            <li><Link href="/assessoria">Assessoria Jurídica</Link></li>
            
            {/* Seção da conta DENTRO do menu mobile */}
            <li className={styles.mobileOnlyAccountSection}>
              {isAuthenticated ? (
                  <>
                    <Link href="/minha-conta/painel" className={styles.accountButton}>Painel</Link>
                    <button onClick={logout} className={styles.logoutButton}>Sair</button>
                  </>
                ) : (
                  <Link href="/minha-conta" className={`${styles.accountButton} ${styles.loginButton}`}>
                    Minha Conta
                  </Link>
                )}
            </li>
          </ul>
        </nav>

        {/* Ações do Usuário e Carrinho */}
        <div className={styles.actions}>
          <Link href="/carrinho" className={styles.cart}>
            <ShoppingCartIcon />
            {itemCount > 0 && <span className={styles.cartCount}>{itemCount}</span>}
          </Link>

          <div className={styles.accountSection}>
            {isAuthenticated ? (
              <>
                <div className={styles.welcomeMessage}>
                  Olá, {user.nome.split(' ')[0]}
                </div>
                <div className={styles.authButtons}>
                  <Link href="/minha-conta/painel" className={styles.accountButton}>Painel</Link>
                  <button onClick={logout} className={styles.logoutButton}>Sair</button>
                </div>
              </>
            ) : (
              <Link href="/minha-conta" className={`${styles.accountButton} ${styles.loginButton}`}>
                Minha Conta
              </Link>
            )}
          </div>

          <button className={styles.hamburgerButton} onClick={handleMenuToggle}>
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;