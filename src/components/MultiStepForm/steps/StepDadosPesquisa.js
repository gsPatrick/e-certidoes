// Salve em: src/components/MultiStepForm/steps/StepDadosPesquisa.js
'use client';

import { useState } from 'react';
import styles from './StepDadosPesquisa.module.css';

// Funções para aplicar máscaras de formatação
const maskCPF = (value) => {
  return value
    .replace(/\D/g, '') // Remove todos os caracteres não numéricos
    .slice(0, 11) // Limita o comprimento a 11 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Aplica o primeiro ponto
    .replace(/(\d{3})(\d)/, '$1.$2') // Aplica o segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Aplica o hífen
};

const maskCNPJ = (value) => {
  return value
    .replace(/\D/g, '') // Remove todos os caracteres não numéricos
    .slice(0, 14) // Limita o comprimento a 14 dígitos
    .replace(/(\d{2})(\d)/, '$1.$2') // Aplica o primeiro ponto
    .replace(/(\d{3})(\d)/, '$1.$2') // Aplica o segundo ponto
    .replace(/(\d{3})(\d)/, '$1/$2') // Aplica a barra
    .replace(/(\d{4})(\d)/, '$1-$2'); // Aplica o hífen
};

export default function StepDadosPesquisa({ formData, handleChange, error }) {
  const [activeTab, setActiveTab] = useState(formData.tipo_pesquisa || 'pessoa');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Notifica o componente pai sobre a mudança de aba
    handleChange({ target: { name: 'tipo_pesquisa', value: tab } });
  };
  
  // Handlers específicos para cada campo, aplicando a máscara
  const handleCpfChange = (e) => {
    handleChange({ target: { name: 'cpf', value: maskCPF(e.target.value) } });
  };

  const handleCnpjChange = (e) => {
    handleChange({ target: { name: 'cnpj', value: maskCNPJ(e.target.value) } });
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>2. DADOS DA PESQUISA</h3>

      <div className={styles.tabContainer}>
        <button
          type="button"
          onClick={() => handleTabChange('pessoa')}
          className={activeTab === 'pessoa' ? styles.activeTab : styles.tabButton}
        >
          Pessoa
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('empresa')}
          className={activeTab === 'empresa' ? styles.activeTab : styles.tabButton}
        >
          Empresa
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {activeTab === 'pessoa' ? (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="nome_completo">Nome completo (Opcional)</label>
              <input
                type="text"
                id="nome_completo"
                name="nome_completo"
                value={formData.nome_completo || ''}
                onChange={handleChange}
                placeholder="Escreva o nome completo para pesquisa"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpf">CPF *</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf || ''}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                required
              />
              {/* Exibe a mensagem de erro se a prop 'error' for recebida */}
              {error && <small className={styles.errorMessage}>{error}</small>}
            </div>
          </>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="razao_social">Razão social (Opcional)</label>
              <input
                type="text"
                id="razao_social"
                name="razao_social"
                value={formData.razao_social || ''}
                onChange={handleChange}
                placeholder="Escreva a razão social da empresa"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cnpj">CNPJ *</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj || ''}
                onChange={handleCnpjChange}
                placeholder="00.000.000/0000-00"
                required
              />
              {/* Exibe a mensagem de erro se a prop 'error' for recebida */}
              {error && <small className={styles.errorMessage}>{error}</small>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}