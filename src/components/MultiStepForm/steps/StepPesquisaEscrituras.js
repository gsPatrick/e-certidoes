// Salve em: src/components/MultiStepForm/steps/StepPesquisaEscrituras.js
'use client';

import { useState } from 'react';
import styles from './StepPesquisaEscrituras.module.css';

const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCNPJ = (value) => value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');

export default function StepPesquisaEscrituras({ formData, handleChange, error, productData }) {
    const [showFilters, setShowFilters] = useState(false);

    const handleCpfCnpjChange = (e) => {
        const value = e.target.value;
        if (value.replace(/\D/g, '').length <= 11) {
          handleChange({ target: { name: 'cpf_cnpj', value: maskCPF(value) } });
        } else {
          handleChange({ target: { name: 'cpf_cnpj', value: maskCNPJ(value) } });
        }
    };
    
    return (
        <div>
            <h3 className={styles.stepTitle}>{productData.name}</h3>
            <p className={styles.stepDescription}>
                Informe no mínimo o CPF/CNPJ e o nome para buscar escrituras ou procurações da pessoa.
            </p>

            <div className={styles.formGroup}>
                <label htmlFor="cpf_cnpj">CPF/CNPJ *</label>
                <input
                    type="text"
                    id="cpf_cnpj"
                    name="cpf_cnpj"
                    value={formData.cpf_cnpj || ''}
                    onChange={handleCpfCnpjChange}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="nome_razao_social">Nome / Razão Social *</label>
                <input
                    type="text"
                    id="nome_razao_social"
                    name="nome_razao_social"
                    value={formData.nome_razao_social || ''}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.filtersToggle}>
                <label>
                    <input
                        type="checkbox"
                        checked={showFilters}
                        onChange={(e) => setShowFilters(e.target.checked)}
                    />
                    Desejo usar filtros opcionais
                </label>
            </div>

            {showFilters && (
                <div className={styles.filtersContainer}>
                    <div className={styles.formGroup}>
                        <label htmlFor="tipo_ato">Tipo de ato</label>
                        <select id="tipo_ato" name="tipo_ato" value={formData.tipo_ato || ''} onChange={handleChange}>
                            <option value="">Todos</option>
                            <option value="Procuração">Procuração</option>
                            <option value="Escritura">Escritura</option>
                        </select>
                    </div>
                    <div className={styles.dateRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="data_de">De</label>
                            <input type="date" id="data_de" name="data_de" value={formData.data_de || ''} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="data_ate">Até</label>
                            <input type="date" id="data_ate" name="data_ate" value={formData.data_ate || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>
            )}
            
            {error && <small className={styles.errorMessage}>{error}</small>}
        </div>
    );
}