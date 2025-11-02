// Salve em: src/components/MultiStepForm/steps/StepDadosCertidaoGov.js
'use client';

import { useState, useEffect } from 'react';
import styles from './StepEstadualDados.module.css'; // Reutilizando o CSS corrigido
import SearchableDropdown from './SearchableDropdown';
import api from '@/services/api';

// Funções de máscara
const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCNPJ = (value) => value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');

export default function StepDadosCertidaoGov({ formData, handleChange, error, productData }) {
    const { category, govFormFields = {}, name } = productData;
    
    // Identifica se é a certidão específica do TRF
    const isTRF = name && name.includes('(TRF)');

    const [activeTab, setActiveTab] = useState(() => {
        if (govFormFields.pessoa && govFormFields.pessoa.length > 0) return formData.tipo_pessoa || 'Pessoa';
        return 'Empresa';
    });

    const [estados, setEstados] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState({ estados: false, municipios: false });

    // Lógica para carregar estados se necessário
    useEffect(() => {
        // Carrega estados para Estaduais e Municipais, mas não para o TRF
        if ((govFormFields.needsState || govFormFields.needsCity) && !isTRF) {
            setLoading(prev => ({ ...prev, estados: true }));
            api.get('/cartorios/estados').then(res => setEstados(res.data)).finally(() => setLoading(prev => ({ ...prev, estados: false })));
        }
    }, [govFormFields, isTRF]);

    // Lógica para carregar municípios se necessário
    useEffect(() => {
        if (govFormFields.needsCity && formData.estado) {
            setLoading(prev => ({ ...prev, municipios: true }));
            api.get(`/cartorios/estados/${formData.estado}/cidades`).then(res => setMunicipios(res.data)).finally(() => setLoading(prev => ({ ...prev, municipios: false })));
        }
    }, [govFormFields, formData.estado]);
    
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

    // Função aprimorada para renderizar campos dinamicamente
    const renderField = (field) => {
        const isRequired = field.required !== false;
        const inputType = field.type || 'text';

        const applyMask = (e) => {
            let { name, value } = e.target;
            if (name === 'cpf' || name === 'cpf_requisitante' || (name === 'titulo_ou_cpf' && value.replace(/\D/g, '').length <= 11)) {
                value = maskCPF(value);
            } else if (name === 'cnpj') {
                value = maskCNPJ(value);
            }
            handleChange({ target: { name, value } });
        };

        return (
            <div className={styles.formGroup} key={field.name}>
                <label htmlFor={field.name}>{field.label}{isRequired && '*'}</label>
                {inputType === 'select' ? (
                    <select id={field.name} name={field.name} value={formData[field.name] || ''} onChange={handleChange} required={isRequired}>
                        <option value="">Selecione</option>
                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : (
                    <input
                        type={inputType}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={applyMask}
                        required={isRequired}
                        placeholder={field.placeholder || ''}
                    />
                )}
            </div>
        );
    };
    
    const fieldsPessoa = govFormFields.pessoa || [];
    const fieldsEmpresa = govFormFields.empresa || [];

    return (
        <div>
            <h3 className={styles.stepTitle}>1. Dados da Certidão</h3>
            <p className={styles.stepDescription}>
                Preencha os dados abaixo para a emissão da {productData.name}.
            </p>

            {/* Renderiza o SELECT de Região APENAS para o TRF */}
            {isTRF && (
                <div className={styles.formGroup}>
                    <label htmlFor="regiao_tribunal">Região do Tribunal Federal *</label>
                    <select id="regiao_tribunal" name="regiao_tribunal" value={formData.regiao_tribunal || ''} onChange={handleChange} required>
                        <option value="">Selecione a Região</option>
                        <option value="1ª Região">1ª Região</option>
                        <option value="2ª Região">2ª Região</option>
                        <option value="3ª Região">3ª Região</option>
                        <option value="4ª Região">4ª Região</option>
                        <option value="5ª Região">5ª Região</option>
                        <option value="6ª Região">6ª Região</option>
                    </select>
                </div>
            )}

            {/* Renderiza o campo de Estado para Estaduais (que NÃO são TRF) */}
            {govFormFields.needsState && !isTRF && (
                <div className={styles.formGroup}>
                    <label htmlFor="estado">Estado *</label>
                    <SearchableDropdown options={estados} value={formData.estado || ''} onChange={(value) => handleDropdownChange('estado', value)} placeholder="Selecione o Estado" loading={loading.estados} />
                </div>
            )}
            
            {/* Renderiza os campos de Estado e Município para Municipais */}
            {govFormFields.needsState && govFormFields.needsCity && (
                <>
                    <div className={styles.formGroup}>
                        <label htmlFor="estado">Estado *</label>
                        <SearchableDropdown options={estados} value={formData.estado || ''} onChange={(value) => handleDropdownChange('estado', value)} placeholder="Selecione o Estado" loading={loading.estados} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="municipio">Município *</label>
                        <SearchableDropdown options={municipios} value={formData.municipio || ''} onChange={(value) => handleDropdownChange('municipio', value)} placeholder="Selecione o Município" loading={loading.municipios} disabled={!formData.estado || loading.municipios} />
                    </div>
                </>
            )}

            {/* Abas Pessoa/Empresa */}
            {(fieldsPessoa.length > 0 || fieldsEmpresa.length > 0) && (
                <div className={styles.tabContainer}>
                    {fieldsPessoa.length > 0 && (
                        <button type="button" onClick={() => handleTabChange('Pessoa')} className={activeTab === 'Pessoa' ? styles.activeTab : styles.tabButton}>Pessoa</button>
                    )}
                    {fieldsEmpresa.length > 0 && (
                        <button type="button" onClick={() => handleTabChange('Empresa')} className={activeTab === 'Empresa' ? styles.activeTab : styles.tabButton}>Empresa</button>
                    )}
                </div>
            )}

            <div className={styles.formContent}>
                {activeTab === 'Pessoa' && fieldsPessoa.map(renderField)}
                {activeTab === 'Empresa' && fieldsEmpresa.map(renderField)}
                {error && <small className={styles.errorMessage}>{error}</small>}
            </div>
        </div>
    );
}