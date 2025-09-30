// Salve em: src/components/MultiStepForm/steps/StepDadosPenhorSafra.js
'use client';

import { useState } from 'react';
import styles from './StepDadosPenhorSafra.module.css';

export default function StepDadosPenhorSafra({ formData, handleChange }) {
  const [activeTab, setActiveTab] = useState(formData.tipo_pessoa || 'fisica');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    handleChange({ target: { name: 'tipo_pessoa', value: tab } });
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>2. DADOS DA CERTIDÃO</h3>

      <div className={styles.tabContainer}>
        <button
          type="button"
          onClick={() => handleTabChange('fisica')}
          className={activeTab === 'fisica' ? styles.activeTab : styles.tabButton}
        >
          Pessoa física
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('juridica')}
          className={activeTab === 'juridica' ? styles.activeTab : styles.tabButton}
        >
          Pessoa jurídica
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {activeTab === 'fisica' ? (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="nome_pessoa">Nome da pessoa*</label>
              <input type="text" id="nome_pessoa" name="nome_pessoa" value={formData.nome_pessoa || ''} onChange={handleChange} placeholder="Escreva o nome completo da pessoa" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpf">CPF*</label>
              <input type="text" id="cpf" name="cpf" value={formData.cpf || ''} onChange={handleChange} placeholder="Digite o CPF" required />
            </div>
          </>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="razao_social">Razão social da empresa*</label>
              <input type="text" id="razao_social" name="razao_social" value={formData.razao_social || ''} onChange={handleChange} placeholder="Escreva a razão social da empresa" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cnpj">CNPJ*</label>
              <input type="text" id="cnpj" name="cnpj" value={formData.cnpj || ''} onChange={handleChange} placeholder="Digite o CNPJ da empresa" required />
            </div>
          </>
        )}
        
        {/* Campos comuns a ambos */}
        <div className={styles.formGroup}>
          <label htmlFor="tipo_safra">Tipo de safra*</label>
          <input type="text" id="tipo_safra" name="tipo_safra" value={formData.tipo_safra || ''} onChange={handleChange} placeholder="Digite o tipo" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="data">Data*</label>
          <input type="date" id="data" name="data" value={formData.data || ''} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="numero_registro">Número de registro</label>
          <input type="text" id="numero_registro" name="numero_registro" value={formData.numero_registro || ''} onChange={handleChange} placeholder="Digite o número" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nome_propriedade">Nome da propriedade</label>
          <input type="text" id="nome_propriedade" name="nome_propriedade" value={formData.nome_propriedade || ''} onChange={handleChange} placeholder="Digite o nome da propriedade" />
        </div>
      </div>
    </div>
  );
}