// Salve em: src/components/MultiStepForm/steps/StepProtestoDados.js
'use client';

import { useState } from 'react';
import styles from './StepProtestoDados.module.css';

// Funções de máscara
const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCNPJ = (value) => value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
const maskCEP = (value) => value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

export default function StepProtestoDados({ formData, handleChange, error }) {
  const [tipoPessoa, setTipoPessoa] = useState(formData.tipo_pessoa || 'Pessoa física');

  const handleTipoPessoaChange = (tipo) => {
    setTipoPessoa(tipo);
    handleChange({ target: { name: 'tipo_pessoa', value: tipo } });
    // Limpa os campos ao trocar de aba
    handleChange({ target: { name: 'nome_completo', value: '' } });
    handleChange({ target: { name: 'cpf_cnpj', value: '' } });
    handleChange({ target: { name: 'rg', value: '' } });
  }

  const handleDocumentoChange = (e) => {
    const { name, value } = e.target;
    if (tipoPessoa === 'Pessoa física') {
      handleChange({ target: { name, value: maskCPF(value) } });
    } else {
      handleChange({ target: { name, value: maskCNPJ(value) } });
    }
  };

  const handleCepChange = (e) => {
    handleChange({ target: { name: 'cep_opcional', value: maskCEP(e.target.value) } });
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>2. Dados da Certidão</h3>
      <div className={styles.tabContainer}>
        <button type="button" onClick={() => handleTipoPessoaChange('Pessoa física')} className={tipoPessoa === 'Pessoa física' ? styles.activeTab : styles.tabButton}>Pessoa física</button>
        <button type="button" onClick={() => handleTipoPessoaChange('Pessoa jurídica')} className={tipoPessoa === 'Pessoa jurídica' ? styles.activeTab : styles.tabButton}>Pessoa jurídica</button>
      </div>

      <div className={styles.formContent}>
        {tipoPessoa === 'Pessoa física' ? (
            <>
            <div className={styles.formGroup}><label htmlFor="nome_completo">Nome completo para pesquisa de protesto*</label><input type="text" id="nome_completo" name="nome_completo" value={formData.nome_completo || ''} onChange={handleChange} required /></div>
            <div className={styles.formGroup}><label htmlFor="cpf_cnpj">CPF*</label><input type="text" id="cpf_cnpj" name="cpf_cnpj" value={formData.cpf_cnpj || ''} onChange={handleDocumentoChange} required placeholder="000.000.000-00" /></div>
            <div className={styles.formGroup}><label htmlFor="rg">RG*</label><input type="text" id="rg" name="rg" value={formData.rg || ''} onChange={handleChange} required /></div>
            </>
        ) : (
            <>
            <div className={styles.formGroup}><label htmlFor="nome_completo">Razão social da empresa para pesquisa de protesto*</label><input type="text" id="nome_completo" name="nome_completo" value={formData.nome_completo || ''} onChange={handleChange} placeholder="Escreva a razão social da empresa" required /></div>
            <div className={styles.formGroup}><label htmlFor="cpf_cnpj">CNPJ para pesquisa de Protesto*</label><input type="text" id="cpf_cnpj" name="cpf_cnpj" value={formData.cpf_cnpj || ''} onChange={handleDocumentoChange} placeholder="00.000.000/0000-00" required /></div>
            </>
        )}
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.mainLabel}>Tempo de pesquisa de protesto</label>
        <div className={styles.radioGroup}>
            <label className={styles.radioOption}>
                <input type="radio" name="tempo_pesquisa" value="5 anos" checked={formData.tempo_pesquisa === '5 anos' || !formData.tempo_pesquisa} onChange={handleChange} /> 
                <div>
                    <strong>5 anos</strong>
                    <small>Tempo de pesquisa de protestos de 5 anos</small>
                </div>
            </label>
            <label className={styles.radioOption}>
                <input type="radio" name="tempo_pesquisa" value="10 anos" checked={formData.tempo_pesquisa === '10 anos'} onChange={handleChange} /> 
                <div>
                    <strong>10 anos</strong>
                    <small>Tempo de pesquisa protestos de 10 anos</small>
                </div>
            </label>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.mainLabel} htmlFor="cep_opcional">CEP (opcional)</label>
        <p className={styles.cepDescription}>O CEP é usado para que o endereço apareça na Certidão de Protesto. Se não informado, o cartório utilizará o endereço fornecido pelo E-certidões.</p>
        <input type="text" id="cep_opcional" name="cep_opcional" value={formData.cep_opcional || ''} onChange={handleCepChange} maxLength="9" />
      </div>

    </div>
  );
}