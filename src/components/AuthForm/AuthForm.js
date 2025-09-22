'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthForm.module.css';
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon, EmailIcon } from './AuthIcons';

const AuthForm = () => {
  // --- Estados do Componente ---
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Estados do Formulário de Login ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- Estados do Formulário de Cadastro ---
  const [regNome, setRegNome] = useState('');
  const [regSobrenome, setRegSobrenome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // --- Estados de Feedback para o Usuário ---
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Hook de Autenticação ---
  const { login, register } = useAuth();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(''); // Limpa erros ao trocar de aba
    // Reseta todos os campos para evitar confusão
    setLoginEmail('');
    setLoginPassword('');
    setRegNome('');
    setRegSobrenome('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
  };
  
  // --- Funções de Submissão ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(loginEmail, loginPassword);
      // O redirecionamento é feito dentro do AuthContext
    } catch (err) {
      setError(err.message);
    } finally {
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
      const userData = {
        nome: regNome,
        sobrenome: regSobrenome,
        email: regEmail,
        password: regPassword,
      };
      await register(userData);
      // O redirecionamento é feito dentro do AuthContext após o login automático
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização dos Formulários ---
  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit}>
      <div className={styles.inputGroup}>
        <EmailIcon />
        <input 
          type="email" 
          placeholder="E-mail" 
          required 
          value={loginEmail} 
          onChange={(e) => setLoginEmail(e.target.value)} 
        />
      </div>
      <div className={styles.inputGroup}>
        <LockIcon />
        <input 
          type={showPassword ? 'text' : 'password'} 
          placeholder="Senha" 
          required 
          value={loginPassword} 
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <div className={styles.optionsRow}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" /> Lembre-se de mim
        </label>
        <Link href="/recuperar-senha" className={styles.forgotPassword}>Esqueceu sua senha?</Link>
      </div>
      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegisterSubmit}>
      <div className={styles.inputGroup}>
        <EmailIcon />
        <input 
          type="email" 
          placeholder="E-mail" 
          required 
          value={regEmail} 
          onChange={(e) => setRegEmail(e.target.value)} 
        />
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <UserIcon />
          <input 
            type="text" 
            placeholder="Nome" 
            required 
            value={regNome} 
            onChange={(e) => setRegNome(e.target.value)} 
          />
        </div>
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Sobrenome" 
            value={regSobrenome} 
            onChange={(e) => setRegSobrenome(e.target.value)} 
          />
        </div>
      </div>
      <div className={styles.inputGroup}>
        <LockIcon />
        <input 
          type={showPassword ? 'text' : 'password'} 
          placeholder="Senha" 
          required 
          value={regPassword} 
          onChange={(e) => setRegPassword(e.target.value)} 
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeIcon}>
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <div className={styles.inputGroup}>
        <LockIcon />
        <input 
          type={showConfirmPassword ? 'text' : 'password'} 
          placeholder="Confirmar Senha" 
          required 
          value={regConfirmPassword} 
          onChange={(e) => setRegConfirmPassword(e.target.value)} 
        />
        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.eyeIcon}>
          {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <div className={styles.optionsRow}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" required /> Eu aceito os <Link href="/termos-e-condicoes">Termos e Condições</Link>.
        </label>
      </div>
      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );

  return (
    <div className={styles.authContainer}>
      <div className={styles.tabNav}>
        <button
          onClick={() => handleTabChange('login')}
          className={activeTab === 'login' ? styles.activeTab : styles.inactiveTab}
        >
          Entrar
        </button>
        <button
          onClick={() => handleTabChange('register')}
          className={activeTab === 'register' ? styles.activeTab : styles.inactiveTab}
        >
          Cadastrar
        </button>
      </div>
      <div className={styles.formContent}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {activeTab === 'login' ? renderLoginForm() : renderRegisterForm()}
      </div>
    </div>
  );
};

export default AuthForm;