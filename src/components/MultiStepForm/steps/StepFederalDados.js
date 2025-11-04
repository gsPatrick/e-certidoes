// Salve em: src/components/MultiStepForm/steps/StepFederalDados.js
'use client';

import { useState } from 'react';
import styles from './StepFederalDados.module.css';

// --- COMPONENTE GENÉRICO PARA CAMPO DE FORMULÁRIO ---
const FormField = ({ field, value, onChange }) => {
  const { name, label, type = 'text', options } = field;

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
    required: field.required !== false // Padrão é true
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={name}>{label}{commonProps.required && '*'}</label>
      {type === 'select' ? (
        <select {...commonProps}>
          <option value="">Selecione</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
};

export default function StepFederalDados({ formData, handleChange, error, productData }) {
  const [activeTab, setActiveTab] = useState(formData.tipo_pessoa || 'Pessoa');
  
  const { govFormFields } = productData;
  const hasPessoa = govFormFields?.pessoa?.length > 0;
  const hasEmpresa = govFormFields?.empresa?.length > 0;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    handleChange({ target: { name: 'tipo_pessoa', value: tab } });
  };

  const fieldsToRender = activeTab === 'Pessoa' ? govFormFields?.pessoa : govFormFields?.empresa;

  return (
    <div>
      <h3 className={styles.stepTitle}>1. Dados da Certidão</h3>
      <p className={styles.stepDescription}>
        Informe os dados no formulário abaixo para iniciarmos a solicitação da {productData.name}.
      </p>

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