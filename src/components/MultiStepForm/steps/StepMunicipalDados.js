// Salve em: src/components/MultiStepForm/steps/StepMunicipalDados.js
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from './StepMunicipalDados.module.css';
import SearchableDropdown from './SearchableDropdown';

// Funções de máscara
const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCNPJ = (value) => value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');

export default function StepMunicipalDados({ formData, handleChange, error, productData }) {
  const [activeTab, setActiveTab] = useState(formData.tipo_pessoa || 'Pessoa');
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState({ estados: false, municipios: false });

  // Busca estados na montagem do componente
  useEffect(() => {
    const fetchEstados = async () => {
      setLoading(prev => ({ ...prev, estados: true }));
      try {
        const { data } = await api.get('/cartorios/estados');
        setEstados(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      } finally {
        setLoading(prev => ({ ...prev, estados: false }));
      }
    };
    fetchEstados();
  }, []);

  // Busca municípios quando um estado é selecionado
  useEffect(() => {
    if (!formData.estado) {
      setMunicipios([]);
      return;
    }
    const fetchMunicipios = async () => {
      setLoading(prev => ({ ...prev, municipios: true }));
      try {
        const { data } = await api.get(`/cartorios/estados/${formData.estado}/cidades`);
        setMunicipios(data);
      } catch (error) {
        console.error("Erro ao buscar municípios:", error);
      } finally {
        setLoading(prev => ({ ...prev, municipios: false }));
      }
    };
    fetchMunicipios();
  }, [formData.estado]);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    handleChange({ target: { name: 'tipo_pessoa', value: tab } });
  };
  
  const handleDropdownChange = (name, value) => {
    handleChange({ target: { name, value } });
    if (name === 'estado') {
      handleChange({ target: { name: 'municipio', value: '' } });
    }
  };

  const handleCpfCnpjChange = (e) => {
    const value = e.target.value;
    const name = activeTab === 'Pessoa' ? 'cpf' : 'cnpj';
    const maskedValue = activeTab === 'Pessoa' ? maskCPF(value) : maskCNPJ(value);
    handleChange({ target: { name, value: maskedValue } });
  };


  return (
    <div>
      <h3 className={styles.stepTitle}>1. Dados da Certidão</h3>
      <p className={styles.stepDescription}>
        A {productData.name} é um documento que permite que você solicite a sua Certidão Negativa de Débitos Municipal, e que ela seja entregue no conforto da sua casa ou escritório.
      </p>

      {/* --- CAMPO ESTADO CORRIGIDO (APENAS UM) --- */}
      <div className={styles.formGroup}>
        <label htmlFor="estado">Estado *</label>
        <SearchableDropdown options={estados} value={formData.estado || ''} onChange={(value) => handleDropdownChange('estado', value)} placeholder="Selecione o Estado" loading={loading.estados} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="municipio">Município *</label>
        <SearchableDropdown options={municipios} value={formData.municipio || ''} onChange={(value) => handleDropdownChange('municipio', value)} placeholder="Selecione o Município" loading={loading.municipios} disabled={!formData.estado || loading.municipios} />
      </div>

      <div className={styles.tabContainer}>
        <button type="button" onClick={() => handleTabChange('Pessoa')} className={`${styles.tabButton} ${activeTab === 'Pessoa' ? styles.activeTab : ''}`}>Pessoa</button>
        <button type="button" onClick={() => handleTabChange('Empresa')} className={`${styles.tabButton} ${activeTab === 'Empresa' ? styles.activeTab : ''}`}>Empresa</button>
      </div>
      
      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label htmlFor="nome">{activeTab === 'Pessoa' ? 'Nome*' : 'Razão Social*'}</label>
          <input type="text" id="nome" name="nome" value={formData.nome || ''} onChange={handleChange} required />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="cpf_cnpj">{activeTab === 'Pessoa' ? 'CPF*' : 'CNPJ*'}</label>
          <input type="text" id="cpf_cnpj" name={activeTab === 'Pessoa' ? 'cpf' : 'cnpj'} value={formData[activeTab === 'Pessoa' ? 'cpf' : 'cnpj'] || ''} onChange={handleCpfCnpjChange} required />
          {error && <small className={styles.errorMessage}>{error}</small>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="inscricao_imovel">Inscrição do Imóvel*</label>
          <input type="text" id="inscricao_imovel" name="inscricao_imovel" value={formData.inscricao_imovel || ''} onChange={handleChange} required />
        </div>
      </div>
    </div>
  );
}