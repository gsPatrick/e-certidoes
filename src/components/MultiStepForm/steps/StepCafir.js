// Crie em: src/components/MultiStepForm/steps/StepCafir.js
'use client';

import styles from './StepCafir.module.css';

export default function StepCafir({ formData, handleChange, error, productData }) {
  return (
    <div>
      <h3 className={styles.stepTitle}>1. Dados da Certidão</h3>
      <p className={styles.stepDescription}>
        Digite o NIRF ou CIB do imóvel que deseja o Cadastro de Imóveis Rurais - CAFIR.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="nirf_cib">NIRF / CIB *</label>
        <input
          type="text"
          id="nirf_cib"
          name="nirf_cib"
          value={formData.nirf_cib || ''}
          onChange={handleChange}
          placeholder="Digite o NIRF ou o CIB"
          required
        />
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>
    </div>
  );
}