// Crie em: src/components/MultiStepForm/steps/StepGovDados.js
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from './StepGovDados.module.css';
import SearchableDropdown from './SearchableDropdown';

// Componente genérico para renderizar campos
const FormField = ({ field, value, onChange }) => {
    const { name, label, type = 'text', options, required = true } = field;

    const handleChangeWithMask = (e) => {
        let { value } = e.target;
        if (name.toLowerCase().includes('cpf')) {
            value = value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else if (name.toLowerCase().includes('cnpj')) {
            value = value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
        }
        onChange({ target: { name, value } });
    };

    const props = { id: name, name, value: value || '', onChange: (name.toLowerCase().includes('cpf') || name.toLowerCase().includes('cnpj')) ? handleChangeWithMask : onChange, required };

    return (
        <div className={styles.formGroup}>
            <label htmlFor={name}>{label}{props.required && '*'}</label>
            {type === 'select' ? (
                <select {...props}>
                    <option value="">Selecione</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                <input type={type} {...props} />
            )}
        </div>
    );
};

export default function StepGovDados({ formData, handleChange, error, productData }) {
    const [activeTab, setActiveTab] = useState(formData.tipo_pessoa || 'Pessoa');
    const [estados, setEstados] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState({ estados: false, municipios: false });

    const { govFormFields, name: productName } = productData;
    const hasPessoa = govFormFields?.pessoa?.length > 0;
    const hasEmpresa = govFormFields?.empresa?.length > 0;

    useEffect(() => {
        if (govFormFields?.needsState || govFormFields?.needsCity) {
            setLoading(p => ({ ...p, estados: true }));
            api.get('/cartorios/estados').then(res => setEstados(res.data)).finally(() => setLoading(p => ({ ...p, estados: false })));
        }
    }, [govFormFields]);

    useEffect(() => {
        if (govFormFields?.needsCity && formData.estado) {
            setLoading(p => ({ ...p, municipios: true }));
            api.get(`/cartorios/estados/${formData.estado}/cidades`).then(res => setMunicipios(res.data)).finally(() => setLoading(p => ({ ...p, municipios: false })));
        } else {
            setMunicipios([]);
        }
    }, [formData.estado, govFormFields]);

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
                Preencha os dados abaixo para a emissão da {productName}.
            </p>

            {govFormFields?.needsTribunal && (
                <div className={styles.formGroup}>
                    <label htmlFor="regiao_tribunal">Região do Tribunal Federal*</label>
                    <select id="regiao_tribunal" name="regiao_tribunal" value={formData.regiao_tribunal || ''} onChange={handleChange} required>
                        <option value="">Selecione a Região</option>
                        <option value="1">1ª Região</option>
                        <option value="2">2ª Região</option>
                        <option value="3">3ª Região</option>
                        <option value="4">4ª Região</option>
                        <option value="5">5ª Região</option>
                    </select>
                </div>
            )}
            
            {govFormFields?.needsState && (
                <div className={styles.formGroup}>
                    <label htmlFor="estado">Estado*</label>
                    <SearchableDropdown options={estados} value={formData.estado || ''} onChange={(v) => handleDropdownChange('estado', v)} placeholder="Selecione o Estado" loading={loading.estados} />
                </div>
            )}

            {govFormFields?.needsCity && (
                <div className={styles.formGroup}>
                    <label htmlFor="municipio">Município*</label>
                    <SearchableDropdown options={municipios} value={formData.municipio || ''} onChange={(v) => handleDropdownChange('municipio', v)} placeholder="Selecione o Município" loading={loading.municipios} disabled={!formData.estado || loading.municipios} />
                </div>
            )}

            {hasPessoa && hasEmpresa && (
                <div className={styles.tabContainer}>
                    <button type="button" onClick={() => handleTabChange('Pessoa')} className={`${styles.tabButton} ${activeTab === 'Pessoa' ? styles.activeTab : ''}`}>Pessoa</button>
                    <button type="button" onClick={() => handleTabChange('Empresa')} className={`${styles.tabButton} ${activeTab === 'Empresa' ? styles.activeTab : ''}`}>Empresa</button>
                </div>
            )}

            <div className={styles.formContent}>
                {fieldsToRender?.map(field => (
                    <FormField key={field.name} field={field} value={formData[field.name]} onChange={handleChange} />
                ))}
                {error && <small className={styles.errorMessage}>{error}</small>}
            </div>
        </div>
    );
}
