// Salve em: src/components/AuthModal/AuthModal.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthModal.module.css';
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon, EmailIcon } from '@/components/AuthForm/AuthIcons';

export default function AuthModal({ onAuthSuccess }) {
  const { login, register } = useAuth();
  
  const [activeTab, setActiveTab] = useState('register');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Estados dos formulários
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regNome, setRegNome] = useState('');
  const [regSobrenome, setRegSobrenome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(loginEmail, loginPassword);
      setSuccessMessage('Login realizado com sucesso! Finalize sua compra.');
      setTimeout(() => {
        onAuthSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Falha no login. Verifique seus dados.');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userData = { nome: regNome, sobrenome: regSobrenome, email: regEmail, password: regPassword };
      // O register do AuthContext já faz o login automático
      await register(userData);
      setSuccessMessage('Cadastro realizado! Agora você pode finalizar sua compra.');
      // Aguarda um pouco para o usuário ler a mensagem e então fecha o modal
      setTimeout(() => {
        onAuthSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Falha no cadastro. Tente novamente.');
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className={styles.feedbackState}>Processando...</div>;
    }
    if (successMessage) {
      return <div className={styles.feedbackState}>{successMessage}</div>;
    }

    return (
      <>
        <div className={styles.tabNav}>
          <button onClick={() => setActiveTab('login')} className={activeTab === 'login' ? styles.activeTab : ''}>Entrar</button>
          <button onClick={() => setActiveTab('register')} className={activeTab === 'register' ? styles.activeTab : ''}>Cadastrar</button>
        </div>
        <div className={styles.formContent}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className={styles.inputGroup}><EmailIcon /><input type="email" placeholder="E-mail" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} /></div>
              <div className={styles.inputGroup}><LockIcon /><input type={showPassword ? 'text' : 'password'} placeholder="Senha" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div>
              <button type="submit" className={styles.submitButton}>Entrar</button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className={styles.inputGroup}><EmailIcon /><input type="email" placeholder="E-mail" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} /></div>
              <div className={styles.formRow}><div className={styles.inputGroup}><UserIcon /><input type="text" placeholder="Nome" required value={regNome} onChange={(e) => setRegNome(e.target.value)} /></div><div className={styles.inputGroup}><input type="text" placeholder="Sobrenome" value={regSobrenome} onChange={(e) => setRegSobrenome(e.target.value)} /></div></div>
              <div className={styles.inputGroup}><LockIcon /><input type={showPassword ? 'text' : 'password'} placeholder="Senha" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div>
              <div className={styles.inputGroup}><LockIcon /><input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirmar Senha" required value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.eyeIcon}>{showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div>
              <button type="submit" className={styles.submitButton}>Cadastrar e Continuar</button>
            </form>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {renderContent()}
      </div>
    </div>
  );
}