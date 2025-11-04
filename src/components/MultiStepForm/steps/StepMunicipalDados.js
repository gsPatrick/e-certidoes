// Salve em: src/components/MultiStepForm/steps/StepMunicipalDados.js
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from './StepMunicipalDados.module.css';
import SearchableDropdown from './SearchableDropdown';

// --- COMPONENTE GENÉRICO PARA CAMPO DE FORMULÁRIO ---
const FormField = ({ field, value, onChange }) => {
  const { name, label, type = 'text' } = field;

  // Função para aplicar máscaras
  const handleChangeWithMask = (e) => {
    let { value } = e.target;
    if (name.toLowerCase().includes('cpf')) {
      value = value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else if (name.toLowerCase().includes('cnpj')) {
      value = value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    onChange({ target: { name, value } });
  };
  
  const commonProps = {
    id: name,
    name: name,
    value: value || '',
    onChange: name.toLowerCase().includes('cpf') || name.toLowerCase().includes('cnpj') ? handleChangeWithMask : onChange,
    required: field.required !== false
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>{label}{commonProps.required && '*'}</label>
      <input type={type} {...commonProps} />
    </div>
  );
};


export default function StepMunicipalDados({ formData, handleChange, error, productData }) {
  const [activeTab, setActiveTab] = useState(formData.tipo_pessoa || 'Pessoa');
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState({ estados: false, municipios: false });

  const { govFormFields } = productData;
  const hasPessoa = govFormFields?.pessoa?.length > 0;
  const hasEmpresa = govFormFields?.empresa?.length > 0;
  
  useEffect(() => {
    const fetchEstados = async () => {
      setLoading(prev => ({ ...prev, estados: true }));
      try { const { data } = await api.get('/cartorios/estados'); setEstados(data); } 
      catch (error) { console.error("Erro ao buscar estados:", error); } 
      finally { setLoading(prev => ({ ...prev, estados: false })); }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    if (!formData.estado) { setMunicipios([]); return; }
    const fetchMunicipios = async () => {
      setLoading(prev => ({ ...prev, municipios: true }));
      try { const { data } = await api.get(`/cartorios/estados/${formData.estado}/cidades`); setMunicipios(data); } 
      catch (error) { console.error("Erro ao buscar municípios:", error); } 
      finally { setLoading(prev => ({ ...prev, municipios: false })); }
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

  const fieldsToRender = activeTab === 'Pessoa' ? govFormFields?.pessoa : govFormFields?.empresa;

  return (
    <div>
      <h3 className={styles.stepTitle}>1. Dados da Certidão</h3>
      <p className={styles.stepDescription}>
        A {productData.name} é um documento que permite que você solicite a sua Certidão Negativa de Débitos Municipal, e que ela seja entregue no conforto da sua casa ou escritório.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="estado">Estado *</label>
        <SearchableDropdown options={estados} value={formData.estado || ''} onChange={(value) => handleDropdownChange('estado', value)} placeholder="Selecione o Estado" loading={loading.estados} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="municipio">Município *</label>
        <SearchableDropdown options={municipios} value={formData.municipio || ''} onChange={(value) => handleDropdownChange('municipio', value)} placeholder="Selecione o Município" loading={loading.municipios} disabled={!formData.estado || loading.municipios} />
      </div>

      {hasPessoa && hasEmpresa && (
        <div className={styles.tabContainer}>
          <button type="button" onClick={() => handleTabChange('Pessoa')} className={`${styles.tabButton} ${activeTab === 'Pessoa' ? styles.activeTab : ''}`}>Pessoa</button>
          <button type="button" onClick={() => handleTabChange('Empresa')} className={`${styles.tabButton} ${activeTab === 'Empresa' ? styles.activeTab : ''}`}>Empresa</button>
        </div>
      )}
      
      <div className={styles.formContent}>
        {fieldsToRender?.map(field => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={handleChange}
          />
        ))}
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>
    </div>
  );
}