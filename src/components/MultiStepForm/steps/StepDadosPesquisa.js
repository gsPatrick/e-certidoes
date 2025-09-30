// Salve em: src/components/MultiStepForm/steps/StepDadosPesquisa.js
'use client';

import { useState } from 'react';
import styles from './StepDadosPesquisa.module.css';

export default function StepDadosPesquisa({ formData, handleChange }) {
  const [activeTab, setActiveTab] = useState(formData.tipo_pesquisa || 'pessoa');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Propaga a mudança para o formulário principal
    handleChange({ target: { name: 'tipo_pesquisa', value: tab } });
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
                placeholder="Escreva o nome completo para pesquisa de bens"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpf">CPF *</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf || ''}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="razao_social">Razão social *</label>
              <input
                type="text"
                id="razao_social"
                name="razao_social"
                value={formData.razao_social || ''}
                onChange={handleChange}
                placeholder="Escreva a razão social da empresa para pesquisa de bens"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cnpj">CNPJ *</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj || ''}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}