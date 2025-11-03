// Salve em: src/components/MultiStepForm/steps/StepEstadualDados.js
'use client';

import { useState } from 'react';
import styles from './StepEstadualDados.module.css';

// Funções para aplicar máscaras de formatação
const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCNPJ = (value) => value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');

export default function StepEstadualDados({ formData, handleChange, error, productData }) {
  const [activeTab, setActiveTab] = useState(formData.tipo_pessoa || 'Pessoa');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    handleChange({ target: { name: 'tipo_pessoa', value: tab } });
  };

  // Handlers para aplicar máscaras
  const handleCpfChange = (e) => handleChange({ target: { name: 'cpf', value: maskCPF(e.target.value) } });
  const handleCnpjChange = (e) => handleChange({ target: { name: 'cnpj', value: maskCNPJ(e.target.value) } });
  const handleRequisitanteCpfChange = (e) => handleChange({ target: { name: 'cpf_requisitante', value: maskCPF(e.target.value) } });


  return (
    <div>
      <h3 className={styles.stepTitle}>2. Dados da Certidão</h3>
      <p className={styles.stepDescription}>
        Selecione Pessoa ou Empresa e digite o número do CPF ou CNPJ que deseja a {productData.name}.
      </p>

      <div className={styles.tabContainer}>
        <button type="button" onClick={() => handleTabChange('Pessoa')} className={activeTab === 'Pessoa' ? styles.activeTab : ''}>Pessoa</button>
        <button type="button" onClick={() => handleTabChange('Empresa')} className={activeTab === 'Empresa' ? styles.activeTab : ''}>Empresa</button>
      </div>

      <div className={styles.formContent}>
        {activeTab === 'Pessoa' ? (
          <>
            <div className={styles.formGroup}><label htmlFor="nome">Nome</label><input type="text" id="nome" name="nome" value={formData.nome || ''} onChange={handleChange} /></div>
            <div className={styles.formGroup}><label htmlFor="cpf">CPF</label><input type="text" id="cpf" name="cpf" value={formData.cpf || ''} onChange={handleCpfChange} /></div>
            <div className={styles.formGroup}><label htmlFor="tipo_certidao_estadual">Tipo</label><select id="tipo_certidao_estadual" name="tipo_certidao_estadual" value={formData.tipo_certidao_estadual || ''} onChange={handleChange}><option value="">Selecione</option><option value="Falência">Falência</option><option value="Cível">Cível</option><option value="Criminal">Criminal</option></select></div>
            <div className={styles.formGroup}><label htmlFor="cpf_requisitante">CPF do Requisitante</label><input type="text" id="cpf_requisitante" name="cpf_requisitante" value={formData.cpf_requisitante || ''} onChange={handleRequisitanteCpfChange} /></div>
            <div className={styles.formGroup}><label htmlFor="genero">Gênero</label><select id="genero" name="genero" value={formData.genero || ''} onChange={handleChange}><option value="">Selecione</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option></select></div>
            <div className={styles.formGroup}><label htmlFor="nome_mae">Nome da Mãe</label><input type="text" id="nome_mae" name="nome_mae" value={formData.nome_mae || ''} onChange={handleChange} /></div>
            <div className={styles.formGroup}><label htmlFor="nome_pai">Nome do Pai</label><input type="text" id="nome_pai" name="nome_pai" value={formData.nome_pai || ''} onChange={handleChange} /></div>
            <div className={styles.formGroup}><label htmlFor="data_nascimento">Data de Nascimento</label><input type="date" id="data_nascimento" name="data_nascimento" value={formData.data_nascimento || ''} onChange={handleChange} /></div>
            <div className={styles.formGroup}><label htmlFor="rg">RG</label><input type="text" id="rg" name="rg" value={formData.rg || ''} onChange={handleChange} /></div>
          </>
        ) : (
          <>
            <div className={styles.formGroup}><label htmlFor="nome_empresa">Nome</label><input type="text" id="nome_empresa" name="nome_empresa" value={formData.nome_empresa || ''} onChange={handleChange} /></div>
            <div className={styles.formGroup}><label htmlFor="cnpj">CNPJ</label><input type="text" id="cnpj" name="cnpj" value={formData.cnpj || ''} onChange={handleCnpjChange} /></div>
            <div className={styles.formGroup}><label htmlFor="tipo_certidao_estadual">Tipo</label><select id="tipo_certidao_estadual" name="tipo_certidao_estadual" value={formData.tipo_certidao_estadual || ''} onChange={handleChange}><option value="">Selecione</option><option value="Falência">Falência</option><option value="Cível">Cível</option><option value="Criminal">Criminal</option></select></div>
            <div className={styles.formGroup}><label htmlFor="endereco">Endereço</label><input type="text" id="endereco" name="endereco" value={formData.endereco || ''} onChange={handleChange} /></div>
            <div className={styles.formGroup}><label htmlFor="nome_fantasia">Nome Fantasia</label><input type="text" id="nome_fantasia" name="nome_fantasia" value={formData.nome_fantasia || ''} onChange={handleChange} /></div>
          </>
        )}
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>
    </div>
  );
}