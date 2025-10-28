// Salve em: src/components/MultiStepForm/steps/StepPesquisaSintegra.js
'use client';

import styles from './StepPesquisa.module.css';

const maskCNPJ = (value) => value.replace(/\D/g, '').slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2');

export default function StepPesquisaSintegra({ formData, handleChange, error, productData }) {

  const handleCnpjChange = (e) => {
    handleChange({ target: { name: 'cnpj', value: maskCNPJ(e.target.value) } });
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>{productData.name}</h3>
      <p className={styles.stepDescription}>
        Identificação do estabelecimento. Preencha ao menos um dos campos para prosseguir.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="cnpj">CNPJ</label>
        <input
          type="text"
          id="cnpj"
          name="cnpj"
          value={formData.cnpj || ''}
          onChange={handleCnpjChange}
          placeholder="00.000.000/0000-00"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="inscricao_estadual">Inscrição Estadual</label>
        <input
          type="text"
          id="inscricao_estadual"
          name="inscricao_estadual"
          value={formData.inscricao_estadual || ''}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="nire">NIRE</label>
        <input
          type="text"
          id="nire"
          name="nire"
          value={formData.nire || ''}
          onChange={handleChange}
        />
      </div>
      
      {error && <small className={styles.errorMessage}>{error}</small>}
      <p className={styles.infoText}>Ao menos 1 (um) campo deverá ser preenchido.</p>
    </div>
  );
}