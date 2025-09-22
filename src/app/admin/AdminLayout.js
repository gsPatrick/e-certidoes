// Salve em: src/app/admin/AdminLayout.js
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <-- CORREÇÃO: ADICIONADO O IMPORT
import PageLoader from '@/components/PageLoader/PageLoader';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }) {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/admin/login');
            } else if (user?.role !== 'admin') {
                alert('Acesso negado. Esta área é restrita para administradores.');
                router.push('/');
            }
        }
    }, [user, isAuthenticated, loading, router]);

    if (loading || !isAuthenticated || user?.role !== 'admin') {
        return <PageLoader />;
    }

    return (
        <div className={styles.adminWrapper}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    Admin e-Certidões
                </div>
                <nav className={styles.nav}>
                    {/* Agora o Link funcionará */}
                    <Link href="/admin/dashboard" className={styles.navLink}>Pedidos</Link>
                </nav>
                <div className={styles.footerNav}>
                    <button onClick={logout} className={`${styles.navLink} ${styles.logoutButton}`}>Sair</button>
                </div>
            </aside>
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <span>Bem-vindo, {user.nome}!</span>
                </header>
                <div className={styles.contentArea}>
                    {children}
                </div>
            </main>
        </div>
    );
}