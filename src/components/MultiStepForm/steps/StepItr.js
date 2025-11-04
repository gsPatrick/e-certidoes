// Crie em: src/components/MultiStepForm/steps/StepItr.js
'use client';

import styles from './StepItr.module.css';

export default function StepItr({ formData, handleChange, error, productData }) {
  return (
    <div>
      <h3 className={styles.stepTitle}>1. Dados da Certidão</h3>
      <p className={styles.stepDescription}>
        Preencha os dados abaixo para a emissão da Certidão de Tributos Federais de Imóvel Rural (ITR).
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="nirf">NIRF *</label>
        <input
          type="text"
          id="nirf"
          name="nirf"
          value={formData.nirf || ''}
          onChange={handleChange}
          placeholder="Digite o número do NIRF"
          required
        />
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>
    </div>
  );
}