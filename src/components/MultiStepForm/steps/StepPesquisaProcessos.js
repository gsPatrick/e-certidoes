// Salve em: src/components/MultiStepForm/steps/StepPesquisaProcessos.js
'use client';

import styles from './StepPesquisa.module.css';

const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCNPJ = (value) => value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');

export default function StepPesquisaProcessos({ formData, handleChange, error, productData }) {

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
      <p className={styles.stepDescription}>{productData.description}</p>

      <div className={styles.formGroup}>
        <label htmlFor="cpf_cnpj">CPF ou CNPJ *</label>
        <input
          type="text"
          id="cpf_cnpj"
          name="cpf_cnpj"
          value={formData.cpf_cnpj || ''}
          onChange={handleCpfCnpjChange}
          placeholder="Digite o documento para a pesquisa"
          required
        />
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>
    </div>
  );
}