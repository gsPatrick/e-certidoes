// Salve em: src/components/MultiStepForm/steps/StepPesquisaVeiculo.js
'use client';

import styles from './StepPesquisa.module.css'; // Usaremos um CSS genérico para pesquisas simples

export default function StepPesquisaVeiculo({ formData, handleChange, error, productData }) {
  return (
    <div>
      <h3 className={styles.stepTitle}>{productData.name}</h3>
      <p className={styles.stepDescription}>
        {productData.description}
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="placa_chassi">Placa ou Chassi *</label>
        <input
          type="text"
          id="placa_chassi"
          name="placa_chassi"
          value={formData.placa_chassi || ''}
          onChange={handleChange}
          placeholder="Digite a placa ou o chassi do veículo"
          required
        />
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>
    </div>
  );
}