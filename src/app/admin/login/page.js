// Salve em: src/app/admin/login/page.js
'use client';
import AuthForm from "@/components/AuthForm/AuthForm";
import styles from './AdminLogin.module.css';

// Página de login específica para a área administrativa
export default function AdminLoginPage() {
  return (
    <div className={styles.pageWrapper}>
        <div className={styles.loginContainer}>
            <h1 className={styles.title}>Painel Administrativo</h1>
            <p className={styles.subtitle}>Acesso restrito</p>
            <AuthForm />
        </div>
    </div>
  );
}